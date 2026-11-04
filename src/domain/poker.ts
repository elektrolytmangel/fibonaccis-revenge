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

export interface Summary {
  distribution: { card: Card; count: number }[];
  /** Average of the numeric cards, or null if there are none. */
  average: number | null;
  /** True when at least two people voted and all votes are the same card. */
  consensus: boolean;
  voters: number;
}

export function summarize(state: RoomState): Summary {
  const cards = state.participants.flatMap((p) => (p.id in state.votes ? [state.votes[p.id]] : []));
  const distribution = DECK.map((card) => ({
    card,
    count: cards.filter((c) => c === card).length,
  })).filter((d) => d.count > 0);
  const numeric = cards.filter((c) => /^\d+$/.test(c)).map(Number);
  const average =
    numeric.length === 0
      ? null
      : Math.round((numeric.reduce((a, b) => a + b, 0) / numeric.length) * 10) / 10;
  return {
    distribution,
    average,
    consensus: cards.length >= 2 && distribution.length === 1,
    voters: cards.length,
  };
}
