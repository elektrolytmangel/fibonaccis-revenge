import { useState } from "react";
import { votedCount } from "../domain/poker";
import type { RoomApi } from "../room/useLocalRoom";
import { Deck } from "./Deck";
import { Participants } from "./Participants";
import { Result } from "./Result";

export function Room({ room, link }: { room: RoomApi; link: string }) {
  const { state, me } = room;
  const [copied, setCopied] = useState(false);
  const voted = votedCount(state);
  const waiting = state.participants.length - voted;

  return (
    <main className="page">
      <header className="header">
        <h1 className="title title--small">Round {state.round}</h1>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => {
            void navigator.clipboard?.writeText(link);
            setCopied(true);
          }}
        >
          {copied ? "Link copied" : "Copy invite link"}
        </button>
      </header>

      <Participants state={state} meId={me.id} />

      {state.revealed ? (
        <>
          <Result state={state} />
          <div className="actions">
            <button type="button" className="btn btn--primary" onClick={room.reset}>
              Next round
            </button>
          </div>
        </>
      ) : (
        <>
          <Deck selected={state.votes[me.id]} disabled={false} onPick={room.vote} />
          <div className="actions">
            <button
              type="button"
              className="btn btn--primary"
              disabled={voted === 0}
              onClick={room.reveal}
            >
              Reveal votes
            </button>
            <p className="hint" role="status">
              {voted === 0
                ? "Pick a card to get started."
                : waiting > 0
                  ? `Waiting for ${waiting} more ${waiting === 1 ? "vote" : "votes"}…`
                  : "Everyone has voted."}
            </p>
          </div>
        </>
      )}

      {room.addDemoTeammate && (
        <button type="button" className="btn btn--quiet dev" onClick={room.addDemoTeammate}>
          Add test teammate (dev only)
        </button>
      )}
    </main>
  );
}
