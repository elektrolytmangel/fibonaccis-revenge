import { useState } from "react";
import { useI18n } from "../i18n/i18n";
import { Settings } from "./Settings";

interface Props {
  /** Room id from the link, if the user arrived through one. */
  roomId: string | null;
  onStart(name: string): void;
}

export function Landing({ roomId, onStart }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const valid = name.trim().length > 0;
  return (
    <main className="page page--narrow">
      <h1 className="title">Fibonacci’s Revenge</h1>
      <p className="lead">{roomId ? t("landing.leadInvited") : t("landing.lead")}</p>
      <form
        className="panel stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onStart(name.trim());
        }}
      >
        <label className="field">
          <span>{t("landing.name")}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={!valid}>
          {roomId ? t("landing.join") : t("landing.create")}
        </button>
      </form>
      <Settings />
    </main>
  );
}
