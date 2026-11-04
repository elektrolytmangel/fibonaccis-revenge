# 0001: Scrum poker on kith

- **Status:** draft (stub, to be filled together with the user)
- **Date:** 2026-11-04

## Product concept

Teams estimate work with Fibonacci cards. Everyone picks a card privately, then
the round is revealed together. No account, no server-side data: participants
sync through a kith relay, end-to-end encrypted.

## Scope (phases)

1. **Local app**: room UI, deck, hidden votes, reveal, reset, running on local state (REQ-ROOM-_, REQ-VOTE-_).
2. **Sync via kith**: rooms as kith orgs; live sync, late join, encryption (REQ-SYNC-*).
3. **Polish**: result summary, rejoin, configurable decks, mobile.
4. **Hardening**: admission/permissions once kith supports invitations and permission checks.

## Style (user choice pending)

Goal (REQ-UI-001): a unique look that feels friendly and is not overloaded. Options, each inspired by
well-known products; the choice only changes the design tokens (REQ-UI-003):

| Option             | Inspiration               | Feel                                                                                             |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------ |
| A. Paper & Ink     | Notion, Medium            | Warm off-white, near-black text, one accent, serif headings, thin borders. Calm, editorial.      |
| B. Playful Chunky  | Duolingo, Headspace       | Bright flat colours, big 16-20 px radii, thick bottom-border buttons, bouncy motion. Energetic.  |
| C. Soft Modern     | Linear, Stripe, Vercel    | Cool neutrals, one indigo accent, soft shadows, crisp sans-serif, excellent dark mode. Polished. |
| D. Pastel Workshop | Figma/FigJam, Miro, Slack | Pastel tinted cards per value, friendly rounded sans, sticky-note feel. Collaborative.           |

## Voting and hidden votes (open)

Changes in kith are visible to every group member, so "hidden until reveal" cannot
be enforced cryptographically by the data model alone. Options to decide in an ADR:

- UI-only hiding (votes are in the shared log, UI shows them after reveal). Simple; trusts participants.
- Commit–reveal: publish `hash(vote, nonce)`, publish `(vote, nonce)` on reveal. Prevents peeking in the UI and tampering after the fact.

## Data model (open)

Sketch: per room one object history for the round (`start`, `vote`, `reveal`, `reset` changes),
merged with kith's merger. To be decided in an ADR.

## Risks

- kith is alpha: no permission checks, relay does not verify membership, sync needs another online peer.
- Not suitable for sensitive data until those gaps close; estimation data is low-sensitivity.

## Open questions

See [PLAN.md](../../PLAN.md#open-questions-for-the-user).
