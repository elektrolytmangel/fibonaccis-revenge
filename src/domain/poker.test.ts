import {
  initialRoom,
  roomReducer,
  summarize,
  votedCount,
  type RoomAction,
  type RoomState,
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
  it("starts a new round with no votes", () => {
    const s = run([
      join("ana"),
      { type: "vote", id: "ana", card: "2" },
      { type: "reveal" },
      { type: "reset" },
    ]);
    expect(s).toMatchObject({ votes: {}, revealed: false, round: 2 });
    expect(s.participants).toHaveLength(1);
  });

  // req: REQ-VOTE-004
  it("summarizes distribution, average and consensus", () => {
    const base = [join("a"), join("b"), join("c")];
    const mixed = summarize(
      run([
        ...base,
        { type: "vote", id: "a", card: "3" },
        { type: "vote", id: "b", card: "5" },
        { type: "vote", id: "c", card: "?" },
      ]),
    );
    expect(mixed.average).toBe(4);
    expect(mixed.consensus).toBe(false);
    expect(mixed.distribution.map((d) => d.card)).toEqual(["3", "5", "?"]);

    const same = summarize(
      run([...base, { type: "vote", id: "a", card: "8" }, { type: "vote", id: "b", card: "8" }]),
    );
    expect(same.consensus).toBe(true);
    expect(summarize(run([join("a"), { type: "vote", id: "a", card: "8" }])).consensus).toBe(false);
  });
});
