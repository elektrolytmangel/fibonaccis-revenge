import { useState } from "react";

interface Props {
  /** Room id from the link, if the user arrived through one. */
  roomId: string | null;
  onStart(name: string): void;
}

export function Landing({ roomId, onStart }: Props) {
  const [name, setName] = useState("");
  const valid = name.trim().length > 0;
  return (
    <main className="page page--narrow">
      <h1 className="title">Fibonacci’s Revenge</h1>
      <p className="lead">
        {roomId ? "You’ve been invited to estimate together." : "Estimate together, calmly."}
      </p>
      <form
        className="panel stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onStart(name.trim());
        }}
      >
        <label className="field">
          <span>Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
            autoFocus
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={!valid}>
          {roomId ? "Join room" : "Create room"}
        </button>
      </form>
    </main>
  );
}
