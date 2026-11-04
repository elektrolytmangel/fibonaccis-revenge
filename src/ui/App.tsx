import { useState } from "react";
import type { Participant } from "../domain/poker";
import { I18nProvider } from "../i18n/i18n";
import { useLocalRoom } from "../room/useLocalRoom";
import { Landing } from "./Landing";
import { Room } from "./Room";

const ROOM_HASH = /^#\/room\/([\w-]+)$/;

function randomId(): string {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 8);
}

function roomIdFromHash(): string | null {
  return ROOM_HASH.exec(window.location.hash)?.[1] ?? null;
}

function JoinedRoom({ me }: { me: Participant }) {
  const room = useLocalRoom(me);
  return <Room room={room} link={window.location.href} />;
}

export function App() {
  const [me, setMe] = useState<Participant | null>(null);

  const start = (name: string) => {
    if (!roomIdFromHash()) window.location.hash = `#/room/${randomId()}`;
    setMe({ id: randomId(), name });
  };

  return (
    <I18nProvider>
      {me ? <JoinedRoom me={me} /> : <Landing roomId={roomIdFromHash()} onStart={start} />}
    </I18nProvider>
  );
}
