import { useEffect, useState } from "react";
import type { Participant } from "../domain/poker";
import { I18nProvider } from "../i18n/i18n";
import { type RoomApi, useLocalRoom } from "../room/useLocalRoom";
import { Landing } from "./Landing";
import { Room } from "./Room";

/**
 * Where rooms live. `local` keeps everything in this tab (tests, demos); `kith` syncs through
 * a kith relay, end-to-end encrypted.
 */
export interface Backend {
  /** Start a room as its first participant; resolves to the room id for the link. */
  create(name: string): Promise<string>;
  /** Join with an invite link (waits until the host admits this device); resolves to the room id. */
  join(name: string, invite: string): Promise<string>;
  /** Is this room already known to this browser (rejoin without a name)? */
  isKnown(roomId: string): boolean;
  /** React hook that provides the `RoomApi` of a joined room. */
  useRoom(roomId: string, name: string | null): RoomApi | null | Error;
}

const ROOM_HASH = /^#\/room\/([\w-]+)$/;
const JOIN_HASH = /^#\/join\/(.+)$/;

function randomId(): string {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 8);
}

function parseHash(): { room: string | null; invite: string | null } {
  const hash = window.location.hash;
  return {
    room: ROOM_HASH.exec(hash)?.[1] ?? null,
    invite: JOIN_HASH.exec(hash)?.[1] ? decodeURIComponent(JOIN_HASH.exec(hash)?.[1] ?? "") : null,
  };
}

/** Everything in this tab, nobody else can join: tests and offline demos. */
export const localBackend: Backend = (() => {
  const names = new Map<string, string>();
  return {
    create: async (name) => {
      const id = randomId();
      names.set(id, name);
      return id;
    },
    // A "room link" is just the room id here.
    join: async (name, link) => {
      names.set(link, name);
      return link;
    },
    isKnown: () => false,
    useRoom(roomId, name) {
      const [me] = useState<Participant>(() => ({
        id: randomId(),
        name: name ?? names.get(roomId) ?? "",
      }));
      return useLocalRoom(me);
    },
  };
})();

function JoinedRoom({
  backend,
  roomId,
  name,
}: {
  backend: Backend;
  roomId: string;
  name: string | null;
}) {
  const room = backend.useRoom(roomId, name);
  if (room instanceof Error || room === null) {
    return (
      <Landing roomId={roomId} busy={room === null} error={room?.message} onStart={() => {}} />
    );
  }
  return <Room room={room} />;
}

export function App({ backend = localBackend }: { backend?: Backend }) {
  const [route, setRoute] = useState(parseHash);
  const [joined, setJoined] = useState<{ roomId: string; name: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // A room link this browser already knows reopens the room (REQ-ROOM-004).
  const reopen = route.room !== null && backend.isKnown(route.room);
  const roomId = joined?.roomId ?? (reopen ? route.room : null);

  const start = async (name: string) => {
    setError(null);
    setBusy(true);
    try {
      if (route.invite) {
        const id = await backend.join(name, route.invite);
        window.location.hash = `#/room/${id}`;
        setJoined({ roomId: id, name });
      } else if (route.room) {
        // Local backend: a plain room link.
        const id = await backend.join(name, route.room);
        setJoined({ roomId: id, name });
      } else {
        const id = await backend.create(name);
        window.location.hash = `#/room/${id}`;
        setJoined({ roomId: id, name });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <I18nProvider>
      {roomId ? (
        <JoinedRoom backend={backend} roomId={roomId} name={joined?.name ?? null} />
      ) : (
        <Landing
          roomId={route.room ?? (route.invite ? "invite" : null)}
          busy={busy}
          error={error ?? undefined}
          waiting={busy && route.invite !== null}
          onStart={start}
        />
      )}
    </I18nProvider>
  );
}
