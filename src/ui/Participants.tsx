import type { RoomState } from "../domain/poker";
import { useI18n } from "../i18n/i18n";
import { Avatar } from "./Avatar";

export function Participants({ state, meId }: { state: RoomState; meId: string }) {
  const { t } = useI18n();
  return (
    <ul className="people" aria-label={t("room.participants")}>
      {state.participants.map((p) => {
        const card = state.votes[p.id];
        const voted = card !== undefined;
        return (
          <li key={p.id} className="person">
            <Avatar id={p.id} name={p.name} />
            <span className="person__name">
              {p.name}
              {p.id === meId ? ` ${t("room.you")}` : ""}
            </span>
            {state.revealed ? (
              <span className="chip chip--value">{voted ? card : "–"}</span>
            ) : (
              <span className={voted ? "chip chip--done" : "chip"}>
                {voted ? t("room.voted") : t("room.thinking")}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
