# fibonaccis-revenge

A web scrum poker (planning poker) for estimating work with Fibonacci cards. Built
on [kith](https://github.com/elektrolytmangel/kith): participants hold the data and
sync through a relay that stores nothing, end-to-end encrypted.

Status and next steps: [PLAN.md](PLAN.md). Design: [docs/design/0001-scrum-poker-on-kith.md](docs/design/0001-scrum-poker-on-kith.md).

## Repository layout

```
src/                 web app (TypeScript, Vite, React)
tests/               unit/integration tests (Vitest)
e2e/                 browser tests (two participants), if added
docs/
  design/            design documents
  requirements/      requirements (REQ-…) + generated traceability matrix
  adr/               architecture decision records
  guides/            development guide
scripts/             requirements checker
.github/             CI, issue/PR templates, dependabot, CODEOWNERS
```

## Quick start

```sh
python3 scripts/reqs.py        # requirements check (works today)
npm ci && npm run dev
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). License: [MIT](LICENSE).
