import { type Card, DECK } from "../domain/poker";

interface Props {
  selected: Card | undefined;
  disabled: boolean;
  onPick(card: Card): void;
}

export function Deck({ selected, disabled, onPick }: Props) {
  return (
    <fieldset className="deck">
      <legend className="sr-only">Choose your card</legend>
      {DECK.map((card) => {
        const isSelected = card === selected;
        return (
          <button
            key={card}
            type="button"
            className={isSelected ? "card card--selected" : "card"}
            aria-pressed={isSelected}
            aria-label={card === "☕" ? "Coffee break" : card === "?" ? "Unsure" : card}
            disabled={disabled}
            onClick={() => onPick(card)}
          >
            <span className="card__value">{card}</span>
            {isSelected && <span className="card__mark">✓ Your pick</span>}
          </button>
        );
      })}
    </fieldset>
  );
}
