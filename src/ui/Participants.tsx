import type { RoomState } from "../domain/poker";
import { Avatar } from "./Avatar";

export function Participants({ state, meId }: { state: RoomState; meId: string }) {
  return (
    <ul className="people" aria-label="Participants">
      {state.participants.map((p) => {
        const card = state.votes[p.id];
        const voted = card !== undefined;
        return (
          <li key={p.id} className="person">
            <Avatar id={p.id} name={p.name} />
            <span className="person__name">
              {p.name}
              {p.id === meId ? " (you)" : ""}
            </span>
            {state.revealed ? (
              <span className="chip chip--value">{voted ? card : "–"}</span>
            ) : (
              <span className={voted ? "chip chip--done" : "chip"}>
                {voted ? "✓ Voted" : "Thinking…"}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
