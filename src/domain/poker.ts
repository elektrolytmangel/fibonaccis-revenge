export const DECK = ["0", "1", "2", "3", "5", "8", "13", "21", "42", "?"] as const;
export type Card = (typeof DECK)[number];

export interface Participant {
  id: string;
  name: string;
}

export interface RoomState {
  participants: Participant[];
  votes: Record<string, Card>;
  revealed: boolean;
}

export type RoomAction =
  | { type: "join"; participant: Participant }
  | { type: "leave"; id: string }
  | { type: "vote"; id: string; card: Card }
  | { type: "reveal" }
  | { type: "reset" };

export const initialRoom: RoomState = { participants: [], votes: {}, revealed: false };

export function roomReducer(state: RoomState, action: RoomAction): RoomState {
  switch (action.type) {
    case "join":
      if (state.participants.some((p) => p.id === action.participant.id)) return state;
      return { ...state, participants: [...state.participants, action.participant] };
    case "leave": {
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.id),
        votes: Object.fromEntries(Object.entries(state.votes).filter(([id]) => id !== action.id)),
      };
    }
    case "vote":
      // Votes can be changed until the reveal, never after.
      if (state.revealed || !state.participants.some((p) => p.id === action.id)) return state;
      return { ...state, votes: { ...state.votes, [action.id]: action.card } };
    case "reveal":
      return Object.keys(state.votes).length === 0 ? state : { ...state, revealed: true };
    case "reset":
      return { ...state, votes: {}, revealed: false };
  }
}

export function votedCount(state: RoomState): number {
  return state.participants.filter((p) => p.id in state.votes).length;
}

/** Fibonacci numbers up to the first one at or above `n` (0, 1, 2, 3, 5, 8, ...). */
export function nextFibonacci(n: number): number {
  let [a, b] = [0, 1];
  while (a < n) [a, b] = [b, a + b];
  return a;
}

/**
 * The estimate of a round: the smallest Fibonacci number that is at least the average of the
 * numeric votes. `null` when nobody cast a numeric vote (only "?" or no votes).
 */
export function estimate(state: RoomState): number | null {
  const numeric = state.participants
    .flatMap((p) => (p.id in state.votes ? [state.votes[p.id]] : []))
    .filter((c) => /^\d+$/.test(c))
    .map(Number);
  if (numeric.length === 0) return null;
  return nextFibonacci(numeric.reduce((x, y) => x + y, 0) / numeric.length);
}
