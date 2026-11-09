import { useEffect, useRef, useState } from "react";
import { votedCount } from "../domain/poker";
import { useI18n } from "../i18n/i18n";
import type { RoomApi } from "../room/useLocalRoom";
import { copyText } from "./clipboard";
import { Deck } from "./Deck";
import { Estimate } from "./Estimate";
import { Participants } from "./Participants";
import { Settings } from "./Settings";

export function Room({ room, onHome }: { room: RoomApi; onHome?: () => void }) {
  const { state, me } = room;
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [manualLink, setManualLink] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);
  const voted = votedCount(state);
  const waiting = state.participants.length - voted;

  return (
    <main className="page page--room">
      <header className="header">
        <h1 className="title title--small header__title">
          <span className={state.title ? "app-name" : undefined}>Fibonacci’s Revenge</span>
          {state.title && <span className="room-name">{state.title}</span>}
        </h1>
        <div className="menu" ref={menuRef}>
          <button
            type="button"
            className="btn btn--menu"
            aria-label={t("room.menu")}
            aria-expanded={menuOpen}
            aria-controls="room-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋯
          </button>
          {menuOpen && (
            <div id="room-menu" className="menu__panel">
              <button
                type="button"
                className="btn btn--item"
                onClick={() => {
                  setManualLink(null);
                  const link = room.createLink();
                  copyText(link).then(
                    () => setCopied(true),
                    async () => {
                      setCopied(false);
                      setManualLink(await link.catch(() => null));
                    },
                  );
                }}
              >
                {copied ? t("room.linkCopied") : t("room.copyLink")}
              </button>
              {manualLink && (
                <p className="menu__copy" role="status">
                  {manualLink}
                </p>
              )}
              {onHome && (
                <button type="button" className="btn btn--item" onClick={onHome}>
                  {t("room.myRooms")}
                </button>
              )}
              <button
                type="button"
                className="btn btn--item"
                onClick={async () => {
                  if (!window.confirm(t("room.leaveConfirm"))) return;
                  await room.leave();
                  onHome?.();
                }}
              >
                {t("room.leave")}
              </button>
              {room.addDemoTeammate && (
                <button type="button" className="btn btn--item" onClick={room.addDemoTeammate}>
                  {t("room.addDemo")}
                </button>
              )}
              <Settings />
            </div>
          )}
        </div>
      </header>

      <div className="room-body">
        <div className="dock">
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
        </div>

        <Participants state={state} meId={me.id} />
      </div>
    </main>
  );
}
