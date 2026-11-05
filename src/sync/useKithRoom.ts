import { useEffect, useState, useSyncExternalStore } from "react";
import { initialRoom } from "../domain/poker";
import type { RoomApi } from "../room/useLocalRoom";
import type { Backend } from "../ui/App";
import { KithRoom, knownRoom } from "./kithRoom";

/** Rooms in this page by id: StrictMode runs effects twice, a database must open once. */
const rooms = new Map<string, Promise<KithRoom>>();

function loadRoom(org: string): Promise<KithRoom> {
  let p = rooms.get(org);
  if (!p) {
    p = KithRoom.open(org);
    rooms.set(org, p);
    p.catch(() => rooms.delete(org));
  }
  return p;
}

const noSubscribe = () => () => {};
const noState = () => initialRoom;

/** The `RoomApi` of the UI backed by a kith room: `null` while it opens, an `Error` if it fails. */
function useKithRoom(org: string): RoomApi | null | Error {
  const [loaded, setLoaded] = useState<KithRoom | Error | null>(null);
  useEffect(() => {
    let live = true;
    loadRoom(org).then(
      (r) => live && setLoaded(r),
      (e) => live && setLoaded(e instanceof Error ? e : new Error(String(e))),
    );
    return () => {
      live = false;
    };
  }, [org]);

  const room = loaded instanceof KithRoom ? loaded : null;
  const state = useSyncExternalStore(room?.subscribe ?? noSubscribe, room?.getState ?? noState);
  useEffect(() => {
    room?.start();
    return () => room?.stop();
  }, [room]);

  if (!room) return loaded instanceof Error ? loaded : null;
  const me = state.participants.find((p) => p.id === room.me) ?? { id: room.me, name: "" };
  return {
    state,
    me,
    vote: (card) => room.vote(card),
    reveal: () => room.reveal(),
    reset: () => room.reset(),
    createLink: async () => room.createLink(),
  };
}

export const kithBackend: Backend = {
  async create(name) {
    const room = await KithRoom.create(name);
    rooms.set(room.org, Promise.resolve(room));
    return room.org;
  },
  async join(name, invite) {
    const room = await KithRoom.join(name, invite);
    rooms.set(room.org, Promise.resolve(room));
    return room.org;
  },
  isKnown: knownRoom,
  useRoom: (roomId) => useKithRoom(roomId),
};
