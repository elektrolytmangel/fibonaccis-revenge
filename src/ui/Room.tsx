import { useState } from "react";
import { votedCount } from "../domain/poker";
import { useI18n } from "../i18n/i18n";
import type { RoomApi } from "../room/useLocalRoom";
import { Deck } from "./Deck";
import { Estimate } from "./Estimate";
import { Participants } from "./Participants";
import { Settings } from "./Settings";

export function Room({ room, link }: { room: RoomApi; link: string }) {
  const { state, me } = room;
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const voted = votedCount(state);
  const waiting = state.participants.length - voted;

  return (
    <main className="page page--room">
      <header className="header">
        <h1 className="title title--small">Fibonacci’s Revenge</h1>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => {
            void navigator.clipboard?.writeText(link);
            setCopied(true);
          }}
        >
          {copied ? t("room.linkCopied") : t("room.copyLink")}
        </button>
      </header>

      <Deck selected={state.votes[me.id]} disabled={state.revealed} onPick={room.vote} />

      <div className="actions">
        <div className="actions__buttons">
          <button
            type="button"
            className="btn btn--primary"
            disabled={state.revealed || voted === 0}
            onClick={room.reveal}
          >
            {t("room.reveal")}
          </button>
          <button type="button" className="btn btn--secondary" onClick={room.reset}>
            {t("room.reset")}
          </button>
        </div>
        <p className="hint" role="status">
          {state.revealed
            ? ""
            : voted === 0
              ? t("room.hintStart")
              : waiting > 0
                ? t("room.waiting", { count: waiting })
                : t("room.allVoted")}
        </p>
      </div>

      <Estimate state={state} />

      <Participants state={state} meId={me.id} />

      <footer className="footer">
        {room.addDemoTeammate && (
          <button type="button" className="btn btn--quiet" onClick={room.addDemoTeammate}>
            {t("room.addDemo")}
          </button>
        )}
        <Settings />
      </footer>
    </main>
  );
}
