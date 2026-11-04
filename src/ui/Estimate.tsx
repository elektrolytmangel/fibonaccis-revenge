import { estimate, type RoomState } from "../domain/poker";
import { useI18n } from "../i18n/i18n";

/** The one result row. Always present; empty until the votes are revealed. */
export function Estimate({ state }: { state: RoomState }) {
  const { t } = useI18n();
  const value = state.revealed ? (estimate(state) ?? "–") : "";
  return (
    <section className="estimate" aria-label={t("room.estimate")}>
      <h2 className="estimate__label">{t("room.estimate")}</h2>
      <p className="estimate__value" aria-live="polite">
        {value}
      </p>
    </section>
  );
}
