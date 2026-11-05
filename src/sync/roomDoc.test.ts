import { estimate } from "../domain/poker";
import { NEW_ROOM_DOC, parseRoomDoc, patch, type RoomDoc, toRoomState } from "./roomDoc";

/** RFC 7396 merge patch, as kith applies it. */
function merge(target: unknown, p: unknown): unknown {
  if (p === null || typeof p !== "object" || Array.isArray(p)) return p;
  const base = (target && typeof target === "object" ? target : {}) as Record<string, unknown>;
  const out = { ...base };
  for (const [k, v] of Object.entries(p)) {
    if (v === null) delete out[k];
    else out[k] = merge(base[k], v);
  }
  return out;
}
const apply = (doc: RoomDoc, ...ps: object[]) =>
  ps.reduce<RoomDoc>((d, p) => merge(d, p) as RoomDoc, doc);

describe("room document", () => {
  // req: REQ-SYNC-001
  it("maps joins, hidden votes and reveal to the room state", () => {
    const doc = apply(
      NEW_ROOM_DOC,
      patch.join("a", "Ana", 1),
      patch.join("b", "Ben", 2),
      patch.vote("a", "5", 1),
      patch.vote("b", "8", 1),
    );
    const s = toRoomState(doc);
    expect(s.participants.map((p) => p.name)).toEqual(["Ana", "Ben"]);
    expect(s.votes).toEqual({ a: "5", b: "8" });
    expect(s.revealed).toBe(false);
    const revealed = toRoomState(apply(doc, patch.reveal(doc.round)));
    expect(revealed.revealed).toBe(true);
    expect(estimate(revealed)).toBe(8); // average 6.5 -> 8
  });

  // req: REQ-SYNC-002
  it("converges whatever the order of concurrent patches", () => {
    const base = apply(NEW_ROOM_DOC, patch.join("a", "Ana", 1), patch.join("b", "Ben", 2));
    const votes = [patch.vote("a", "3", 1), patch.vote("b", "13", 1)];
    const reset = patch.reset(1);
    const x = apply(base, ...votes, reset);
    const y = apply(base, reset, ...votes.toReversed());
    expect(toRoomState(x)).toEqual(toRoomState(y));
    // votes cast in round 1 do not count after the reset to round 2
    expect(toRoomState(x).votes).toEqual({});
    expect(toRoomState(x).revealed).toBe(false);
  });

  // req: REQ-SYNC-002
  it("reset hides a revealed round and allows new votes", () => {
    let doc = apply(NEW_ROOM_DOC, patch.join("a", "Ana", 1), patch.vote("a", "5", 1));
    doc = apply(doc, patch.reveal(1), patch.reset(1), patch.vote("a", "2", 2));
    const s = toRoomState(doc);
    expect(s.revealed).toBe(false);
    expect(s.votes).toEqual({ a: "2" });
  });

  it("ignores malformed data from other devices", () => {
    const doc = parseRoomDoc(
      JSON.stringify({
        round: "x",
        players: { a: { name: "A", vote: "99" }, b: 5, c: { name: 3 } },
      }),
    );
    expect(Object.keys(doc.players)).toEqual(["a"]);
    expect(doc.players.a.vote).toBeUndefined();
    expect(parseRoomDoc("not json")).toEqual(NEW_ROOM_DOC);
  });
});
