import { useCallback, useReducer } from "react";
import {
  type Card,
  DECK,
  initialRoom,
  type Participant,
  type RoomState,
  roomReducer,
} from "../domain/poker";

/**
 * What the UI needs from a room. Today it is backed by local React state; the kith
 * integration will provide the same interface backed by synced changes.
 */
export interface RoomApi {
  state: RoomState;
  me: Participant;
  vote(card: Card): void;
  reveal(): void;
  reset(): void;
  /** Development only: add a teammate who already voted, to try the UI alone. */
  addDemoTeammate?(): void;
}

const DEMO_NAMES = ["Ana", "Ben", "Chloe", "Dev", "Eli", "Fay"];

export function useLocalRoom(me: Participant): RoomApi {
  const [state, dispatch] = useReducer(roomReducer, initialRoom, (s) =>
    roomReducer(s, { type: "join", participant: me }),
  );

  const addDemoTeammate = useCallback(() => {
    const n = state.participants.length;
    const id = `demo-${n}`;
    dispatch({ type: "join", participant: { id, name: DEMO_NAMES[n % DEMO_NAMES.length] } });
    const card = DECK[Math.floor(Math.random() * 8)];
    dispatch({ type: "vote", id, card });
  }, [state.participants.length]);

  return {
    state,
    me,
    vote: (card) => dispatch({ type: "vote", id: me.id, card }),
    reveal: () => dispatch({ type: "reveal" }),
    reset: () => dispatch({ type: "reset" }),
    addDemoTeammate: import.meta.env.DEV ? addDemoTeammate : undefined,
  };
}
