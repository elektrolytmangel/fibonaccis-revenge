# Contributing

1. Find or write the requirement your change serves (`docs/requirements/`).
   If none exists, open a _Requirement_ issue first.
2. Branch from `main`, implement, and add tests tagged `// req: REQ-…`.
3. Run lint, type check, tests and `python3 scripts/reqs.py --write`
   (see the [development guide](docs/guides/development.md)).
4. Open a PR and fill in the template. Changes to architecture, the sync model
   or dependencies need an ADR (`docs/adr/`).
