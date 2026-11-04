import {
  type Card,
  estimate,
  initialRoom,
  nextFibonacci,
  type RoomAction,
  type RoomState,
  roomReducer,
  votedCount,
} from "./poker";

const run = (actions: RoomAction[], from: RoomState = initialRoom) =>
  actions.reduce(roomReducer, from);
const join = (id: string): RoomAction => ({ type: "join", participant: { id, name: id } });

describe("room", () => {
  // req: REQ-ROOM-001
  it("lets a user join an empty room", () => {
    expect(run([join("ana")]).participants).toEqual([{ id: "ana", name: "ana" }]);
  });

  // req: REQ-ROOM-003
  it("counts who has voted without exposing what", () => {
    const s = run([join("ana"), join("ben"), { type: "vote", id: "ana", card: "5" }]);
    expect(votedCount(s)).toBe(1);
  });
});

describe("voting", () => {
  // req: REQ-VOTE-002
  it("allows changing a vote until reveal, not after", () => {
    let s = run([join("ana"), { type: "vote", id: "ana", card: "3" }]);
    s = run([{ type: "vote", id: "ana", card: "8" }], s);
    expect(s.votes.ana).toBe("8");
    s = run([{ type: "reveal" }, { type: "vote", id: "ana", card: "1" }], s);
    expect(s.votes.ana).toBe("8");
  });

  // req: REQ-VOTE-003
  it("reveals only when somebody voted", () => {
    expect(run([join("ana"), { type: "reveal" }]).revealed).toBe(false);
    const s = run([join("ana"), { type: "vote", id: "ana", card: "2" }, { type: "reveal" }]);
    expect(s.revealed).toBe(true);
  });

  // req: REQ-VOTE-005
  it("resets all votes and hides them again", () => {
    const s = run([
      join("ana"),
      { type: "vote", id: "ana", card: "2" },
      { type: "reveal" },
      { type: "reset" },
    ]);
    expect(s).toMatchObject({ votes: {}, revealed: false });
    expect(s.participants).toHaveLength(1);
  });

  // req: REQ-VOTE-004
  it("finds the next Fibonacci number at or above a value", () => {
    expect([0, 0.5, 1, 1.5, 4, 5, 5.1, 10.5, 17, 21, 31.5, 100].map(nextFibonacci)).toEqual([
      0, 1, 1, 2, 5, 5, 8, 13, 21, 21, 34, 144,
    ]);
  });

  // req: REQ-VOTE-004
  it("estimates the next Fibonacci number above the average of numeric votes", () => {
    const base = [join("a"), join("b"), join("c")];
    const vote = (id: string, card: Card): RoomAction => ({ type: "vote", id, card });
    expect(estimate(run([...base, vote("a", "3"), vote("b", "5"), vote("c", "?")]))).toBe(5);
    expect(estimate(run([...base, vote("a", "8"), vote("b", "13")]))).toBe(13);
    expect(estimate(run([...base, vote("a", "5"), vote("b", "5")]))).toBe(5);
    expect(estimate(run([...base, vote("a", "21"), vote("b", "42")]))).toBe(34);
    expect(estimate(run([...base, vote("a", "?")]))).toBeNull();
    expect(estimate(run(base))).toBeNull();
  });
});
