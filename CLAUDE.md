# CLAUDE.md

fibonaccis-revenge: a web scrum poker (planning poker) built on the
[kith](https://github.com/elektrolytmangel/kith) local-first, end-to-end encrypted
sync library. TypeScript + Vite + React. Start with [README.md](README.md).

## Always: keep PLAN.md current

[PLAN.md](PLAN.md) is the handover document between sessions.

- **At the start of a session:** read `PLAN.md` before doing anything else.
- **Whenever you make a plan** (next steps, a multi-step task, a proposal to the
  user): write it into `PLAN.md` (_Next steps_, _Open questions_), not only in chat.
- **Whenever you finish or stop work:** update `PLAN.md` in the same change:
  check off done items, update _Where things stand_, add new decisions,
  pitfalls and open issues, add a dated line to _Log_, set _Last updated_.
- Record user decisions under _Decisions_ so later sessions don't re-ask them.
- Keep it short and current: replace stale text instead of appending history.
- When a decision is the user's to make, ask; don't guess.

## How to work here

- Workflow and local commands: [docs/guides/development.md](docs/guides/development.md).
- Requirements: `docs/requirements/`; tag tests `// req: REQ-…`; run `python3 scripts/reqs.py --write`.
- Decisions that shape architecture, protocol use or dependencies get an ADR in `docs/adr/`.
- Branch + PR for every change. Once all CI checks on your PR have passed, merge it
  yourself (`gh pr merge <n> --merge --delete-branch`, then update local `main`).
  Never merge with failing or pending checks, never force-push; tags/releases stay the user's.
- After a successful merge, continue with the next item in `PLAN.md` without asking.
