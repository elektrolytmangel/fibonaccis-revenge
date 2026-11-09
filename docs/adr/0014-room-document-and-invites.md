# 0014: Room as kith org and one JSON document; invites as join links

- **Status:** accepted
- **Date:** 2026-11-05
- **Requirements:** REQ-SYNC-001..004, REQ-ROOM-002..004, REQ-PLAT-002

## Context

kith 0.2.0-beta.1 (`@elektrolytmangel/kith-wasm`) gives a group per org (MLS, end-to-end
encrypted), JSON documents whose key-wise merge patches (RFC 7396) never conflict,
IndexedDB persistence with a device key, and multi-use invite links that an admin device
must accept while online.

## Decision

- **A room is a kith org.** The room id in the URL (`#/room/<org>`) is the org id. The creator is its admin.
- **Each room has its own kith client**, in its own IndexedDB database and with its own device key (no identity shared between rooms; two rooms can be open in two tabs, because kith allows one client per database).
- **One JSON document** per room (`poker-room`): `{round, revealedRound, players: {<deviceId>: {name, joined, vote?, round?}}}`. A device only writes its own player entry, `reveal` sets `revealedRound = round`, `reset` sets `round = round + 1`. A vote counts only if `vote.round === round`; votes are shown when `revealedRound === round`. This converges for concurrent vote, reveal and reset without deleting keys.
- **Hidden votes are UI-only.** Votes are in the shared document; the UI shows them after Reveal. Commit-reveal stays an option for later.
- **Join link = fresh multi-use kith invite** (`createMultiInvite`, kith 0.2.0-beta.3), `#/join/<invite>`, valid 24 h for up to 20 devices, so one link in the team chat is enough. "Copy invite link" still makes a new one per click. Whoever holds a valid invite is admitted automatically by the creator's device, so **the creator must be online** while someone joins. Late joiners fetch the state from any online member (`catchUp`).
- The app takes the relay from the invite; the creator's relay is `VITE_KITH_RELAY` (default `ws://localhost:8080/v1/ws`).

## Consequences

- The room is only as available as its members: joining needs the creator online; state needs one online member.
- Anyone with a link can join and vote under any name; there is no admission step beyond the invite. Acceptable for estimation data and kith beta.
- A browser that loses its IndexedDB loses the room identity (a new invite is needed).
- Moving to kith's next releases may change the wire format (pre-1.0); upgrades are a deliberate version bump of the tarball URL.

## Alternatives considered

- One kith client for all rooms: `createDocument` uses "the only org", ambiguous with several.
- One event per action (`create`/`edit` byte payloads with an app reducer): more code, same guarantees; the JSON document already merges key-wise.
- Votes as commit-reveal: not needed for the first version.
