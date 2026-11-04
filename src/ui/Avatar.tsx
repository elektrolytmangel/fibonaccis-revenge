const TINTS = ["yellow", "blue", "pink", "green"] as const;

function tintFor(id: string): (typeof TINTS)[number] {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TINTS[h % TINTS.length];
}

export function Avatar({ id, name }: { id: string; name: string }) {
  return (
    <span className={`avatar avatar--${tintFor(id)}`} aria-hidden="true">
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
