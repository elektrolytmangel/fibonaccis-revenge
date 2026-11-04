import { type Card, DECK } from "../domain/poker";
import { useI18n } from "../i18n/i18n";

interface Props {
  selected: Card | undefined;
  disabled: boolean;
  onPick(card: Card): void;
}

export function Deck({ selected, disabled, onPick }: Props) {
  const { t } = useI18n();
  return (
    <fieldset className="deck">
      <legend className="sr-only">{t("room.deck")}</legend>
      {DECK.map((card) => {
        const isSelected = card === selected;
        return (
          <button
            key={card}
            type="button"
            className={isSelected ? "card card--selected" : "card"}
            aria-pressed={isSelected}
            aria-label={card === "?" ? t("room.unsure") : card}
            disabled={disabled}
            onClick={() => onPick(card)}
          >
            <span className="card__value">{card}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
