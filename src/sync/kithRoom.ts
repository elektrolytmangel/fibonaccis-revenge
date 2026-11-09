import init, { generateSecretKey, KithClient } from "@elektrolytmangel/kith-wasm";
import { deleteDeviceKey, loadOrCreateDeviceKey } from "@elektrolytmangel/kith-wasm/kith-web.js";
import type { Card, RoomState } from "../domain/poker";
import { NEW_ROOM_DOC, parseRoomDoc, patch, type RoomDoc, toRoomState } from "./roomDoc";

/** Default relay; an invite link carries the relay of the room it belongs to. */
export const DEFAULT_RELAY: string = import.meta.env.VITE_KITH_RELAY ?? "ws://localhost:8080/v1/ws";

const DOC_TYPE = "poker-room";
const INVITE_TTL_SECONDS = 60 * 60;
const JOIN_TIMEOUT_MS = 2 * 60 * 1000;
const SESSION_PREFIX = "fr.room.";

interface Session {
  /** IndexedDB name (and device-key name) of this room's kith client. */
  db: string;
  name: string;
  relay: string;
  /** Room name, kept for the list of joined rooms. */
  title?: string;
  /** When the room was joined (ms), to order the list. */
  at?: number;
}

export interface RoomSummary {
  id: string;
  title?: string;
}

function readSession(org: string): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_PREFIX + org);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function saveSession(org: string, s: Session): void {
  try {
    localStorage.setItem(SESSION_PREFIX + org, JSON.stringify(s));
  } catch {
    /* the room still works, but a reload cannot rejoin it */
  }
}

/** Rooms this browser has joined, newest first. */
export function joinedRooms(): RoomSummary[] {
  const out: (RoomSummary & { at: number })[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(SESSION_PREFIX)) continue;
      const s = readSession(key.slice(SESSION_PREFIX.length));
      if (s) out.push({ id: key.slice(SESSION_PREFIX.length), title: s.title, at: s.at ?? 0 });
    }
  } catch {
    /* no storage: no list */
  }
  return out.sort((a, b) => b.at - a.at).map(({ id, title }) => ({ id, title }));
}

/** Does this browser already know the room (so reopening it needs no name)? */
export function knownRoom(org: string): boolean {
  return readSession(org) !== null;
}

let wasm: Promise<unknown> | null = null;
const ensureWasm = () => {
  wasm ??= init();
  return wasm;
};

async function openClient(db: string): Promise<KithClient> {
  await ensureWasm();
  const key = await loadOrCreateDeviceKey(db, generateSecretKey);
  // One client owns a database at a time (Web Lock): a second tab on the same room fails here.
  return KithClient.open(db, key, false);
}

const newDbName = () => `fr-${crypto.randomUUID()}`;

type Listener = () => void;

/** One joined room: a kith client in its own database, connected to the room's org. */
export class KithRoom {
  readonly me: string;
  private doc: RoomDoc = NEW_ROOM_DOC;
  private state: RoomState = toRoomState(NEW_ROOM_DOC);
  private listeners = new Set<Listener>();
  private connected = false;
  private lastCatchUp = 0;
  private onJoined: (() => void) | null = null;
  private closed = false;

  private constructor(
    private readonly client: KithClient,
    readonly org: string,
    private readonly session: Session,
  ) {
    this.me = client.deviceId();
  }

  /** Create a room: a new org (this device is its admin) with an empty room document. */
  static async create(
    name: string,
    title: string | undefined,
    relay = DEFAULT_RELAY,
  ): Promise<KithRoom> {
    const db = newDbName();
    const client = await openClient(db);
    const org = client.createOrg();
    client.createDocument(
      DOC_TYPE,
      JSON.stringify({ ...NEW_ROOM_DOC, title: title?.trim() || undefined }),
    );
    const room = new KithRoom(client, org, {
      db,
      name,
      relay,
      title: title?.trim() || undefined,
      at: Date.now(),
    });
    saveSession(org, room.session);
    room.start();
    return room;
  }

  /**
   * Join with an invite link. Resolves once the room's admin (who must be online) admitted
   * this device; rejects after two minutes or if the claim fails.
   */
  static async join(name: string, invite: string): Promise<KithRoom> {
    await ensureWasm();
    const { org, relay } = KithClient.parseInvite(invite) as { org: string; relay: string };
    const existing = readSession(org);
    if (existing) return KithRoom.open(org);
    const db = newDbName();
    const client = await openClient(db);
    const room = new KithRoom(client, org, { db, name, relay, at: Date.now() });
    const joined = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("The host did not admit you in time.")),
        JOIN_TIMEOUT_MS,
      );
      room.onJoined = () => {
        clearTimeout(timer);
        resolve();
      };
    });
    room.connect();
    room.client.claimInvite(invite);
    try {
      await joined;
    } catch (e) {
      room.stop();
      room.client.free();
      throw e;
    }
    saveSession(org, room.session);
    room.start();
    return room;
  }

  /** Reopen a room this browser has joined before (same device identity and data). */
  static async open(org: string): Promise<KithRoom> {
    const session = readSession(org);
    if (!session) throw new Error("Unknown room");
    const client = await openClient(session.db);
    const room = new KithRoom(client, org, session);
    room.start();
    return room;
  }

  // --- external store for React ---------------------------------------------------------

  subscribe = (l: Listener): (() => void) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  getState = (): RoomState => this.state;

  // --- actions --------------------------------------------------------------------------

  vote(card: Card): void {
    if (this.state.revealed) return;
    this.edit(patch.vote(this.me, card, this.doc.round));
  }

  reveal(): void {
    if (Object.keys(this.state.votes).length === 0) return;
    this.edit(patch.reveal(this.doc.round));
  }

  reset(): void {
    this.edit(patch.reset(this.doc.round));
  }

  /** A fresh one-time invite link for another person (this device must be an admin). */
  createLink(base = `${location.origin}${location.pathname}`): string {
    const invite = this.client.createInvite(this.org, this.session.relay, INVITE_TTL_SECONDS);
    return `${base}#/join/${encodeURIComponent(invite)}`;
  }

  /**
   * Leave for good: remove this device from the participant list, close the client and forget
   * the room (session, device key, database) on this device. Rejoining needs a new invite.
   */
  async leave(): Promise<void> {
    const id = this.docId();
    if (id) {
      try {
        this.client.updateDocument(id, JSON.stringify(patch.leave(this.me)));
      } catch {
        /* offline or closed: the entry stays until someone else removes it */
      }
    }
    // Give the removal a moment to reach the relay before the connection closes.
    await new Promise((r) => setTimeout(r, 400));
    this.listeners.clear();
    this.stop();
    this.closed = true;
    this.client.free();
    try {
      localStorage.removeItem(SESSION_PREFIX + this.org);
    } catch {
      /* ignore */
    }
    await deleteDeviceKey(this.session.db).catch(() => {});
    indexedDB.deleteDatabase(this.session.db);
  }

  /** Connect (idempotent). */
  start(): void {
    if (this.closed) return;
    if (!this.connected) this.connect();
    this.refresh();
  }

  /** Disconnect; the stored data stays. */
  stop(): void {
    if (this.closed) return;
    this.client.disconnect();
    this.connected = false;
  }

  // --- internals ------------------------------------------------------------------------

  private connect(): void {
    this.connected = true;
    this.client.connect(this.session.relay, this.org, (e: KithEvent) => this.onEvent(e));
  }

  private docId(): string | undefined {
    const objects = this.client.objects(DOC_TYPE) as { objectId: string; scope: string }[];
    return objects.find((o) => o.scope === this.org)?.objectId;
  }

  private edit(p: object): void {
    const id = this.docId();
    if (!id) return;
    this.client.updateDocument(id, JSON.stringify(p));
    this.refresh();
  }

  private refresh(): void {
    const id = this.docId();
    if (!id) return;
    this.doc = parseRoomDoc(this.client.documentJson(id));
    const mine = this.doc.players[this.me];
    if (mine?.name !== this.session.name) {
      // Announce this device (first start, or the name changed since).
      this.client.updateDocument(
        id,
        JSON.stringify(patch.join(this.me, this.session.name, mine?.joined ?? Date.now())),
      );
      this.doc = parseRoomDoc(this.client.documentJson(id));
    }
    if (this.doc.title !== this.session.title) {
      this.session.title = this.doc.title;
      saveSession(this.org, this.session);
    }
    this.state = toRoomState(this.doc);
    for (const l of this.listeners) l();
  }

  private onEvent(e: KithEvent): void {
    switch (e.type) {
      case "inviteClaimed":
        // Anyone holding a valid invite is admitted (REQ-ROOM-002: anonymous joining).
        if (this.client.isAdmin(this.org) && e.from) this.client.acceptClaim(e.from);
        break;
      case "joined":
        this.onJoined?.();
        this.catchUp(true);
        break;
      case "presence":
      case "connected":
        this.catchUp(false);
        break;
      case "received":
      case "syncReceived":
        this.refresh();
        break;
    }
  }

  /** Exchange missing changes with an online peer (throttled). */
  private catchUp(force: boolean): void {
    const now = Date.now();
    if (!force && now - this.lastCatchUp < 1500) return;
    this.lastCatchUp = now;
    try {
      this.client.catchUp();
    } catch {
      /* not connected yet; the next presence event retries */
    }
  }
}

interface KithEvent {
  type: string;
  from?: string;
}
