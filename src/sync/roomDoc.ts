import { type Card, DECK, type RoomState } from "../domain/poker";

/**
 * The shared room document (a kith JSON document, merged key by key).
 *
 * Rounds make Reset and Reveal convergent without deleting keys: a vote counts only when it
 * was cast in the current `round`, and the votes are shown when `revealedRound` equals it.
 */
export interface RoomDoc {
  /** Optional room name, set by the creator. */
  title?: string;
  round: number;
  revealedRound: number;
  players: Record<string, PlayerDoc>;
}

export interface PlayerDoc {
  name: string;
  /** Join time in ms, to order the participant list. */
  joined: number;
  vote?: Card;
  /** Round of `vote`. */
  round?: number;
}

export const NEW_ROOM_DOC: RoomDoc = { round: 1, revealedRound: 0, players: {} };

const isCard = (v: unknown): v is Card => (DECK as readonly unknown[]).includes(v);

/** Tolerant parse: the document is written by other devices, so check what is read. */
export function parseRoomDoc(json: string): RoomDoc {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return NEW_ROOM_DOC;
  }
  const o = (raw ?? {}) as Record<string, unknown>;
  const players: Record<string, PlayerDoc> = {};
  for (const [id, p] of Object.entries((o.players ?? {}) as Record<string, unknown>)) {
    const q = (p ?? {}) as Record<string, unknown>;
    if (typeof q.name !== "string") continue;
    players[id] = {
      name: q.name.slice(0, 24),
      joined: typeof q.joined === "number" ? q.joined : 0,
      vote: isCard(q.vote) ? q.vote : undefined,
      round: typeof q.round === "number" ? q.round : undefined,
    };
  }
  const title = typeof o.title === "string" ? o.title.trim().slice(0, 40) : "";
  return {
    title: title || undefined,
    round: typeof o.round === "number" ? o.round : 1,
    revealedRound: typeof o.revealedRound === "number" ? o.revealedRound : 0,
    players,
  };
}

export function toRoomState(doc: RoomDoc): RoomState {
  const entries = Object.entries(doc.players).sort(
    ([ia, a], [ib, b]) => a.joined - b.joined || ia.localeCompare(ib),
  );
  const votes: RoomState["votes"] = {};
  for (const [id, p] of entries) {
    if (p.vote !== undefined && p.round === doc.round) votes[id] = p.vote;
  }
  return {
    title: doc.title,
    participants: entries.map(([id, p]) => ({ id, name: p.name })),
    votes,
    revealed: doc.revealedRound === doc.round,
  };
}

/** JSON merge patches (RFC 7396) for the actions of a room. */
export const patch = {
  leave: (id: string) => ({ players: { [id]: null } }),
  join: (id: string, name: string, now: number) => ({ players: { [id]: { name, joined: now } } }),
  vote: (id: string, card: Card, round: number) => ({ players: { [id]: { vote: card, round } } }),
  reveal: (round: number) => ({ revealedRound: round }),
  reset: (round: number) => ({ round: round + 1 }),
};
