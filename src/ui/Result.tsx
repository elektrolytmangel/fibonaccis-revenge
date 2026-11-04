import { summarize, type RoomState } from "../domain/poker";

export function Result({ state }: { state: RoomState }) {
  const s = summarize(state);
  const max = Math.max(...s.distribution.map((d) => d.count), 1);
  return (
    <section className="panel stack" aria-label="Result">
      <h2 className="subtitle">
        {s.consensus
          ? `Everyone agrees on ${s.distribution[0].card}`
          : "Votes differ. Talk it through."}
      </h2>
      {s.average !== null && (
        <p className="average">
          Average <strong>{s.average}</strong>
        </p>
      )}
      <ul className="bars" aria-label="Distribution">
        {s.distribution.map((d) => (
          <li key={d.card} className="bar">
            <span className="bar__label">{d.card}</span>
            <span className="bar__track">
              <span className="bar__fill" style={{ width: `${(d.count / max) * 100}%` }} />
            </span>
            <span className="bar__count">
              {d.count} {d.count === 1 ? "vote" : "votes"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
