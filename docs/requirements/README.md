# Requirements

Requirements are plain Markdown, versioned with the code, reviewed in PRs,
and traced to tests automatically ([ADR 0002](../adr/0002-requirements-as-code.md)).

## Files

| File                               | Prefix | Area                                          |
| ---------------------------------- | ------ | --------------------------------------------- |
| [room.md](room.md)                 | `ROOM` | Rooms and participants                        |
| [voting.md](voting.md)             | `VOTE` | Cards, hidden votes, reveal, reset            |
| [i18n.md](i18n.md) | `LANG` | Languages, plurals |
| [ui.md](ui.md)                     | `UI`   | Visual style, accessibility, responsiveness   |
| [sync.md](sync.md)                 | `SYNC` | Use of kith: live sync, rejoin, privacy       |
| [platform.md](platform.md)         | `PLAT` | Stack, packaging, browsers                    |
| [TRACEABILITY.md](TRACEABILITY.md) |        | **Generated.** Requirement → code/test matrix |

## Format

Each requirement is a level-3 heading with a stable ID, followed by one
metadata line and the text:

```markdown
### REQ-VOTE-001: Votes hidden until reveal

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** design §Voting

Other participants' votes must not be shown until a reveal.
```

| Field    | Values                                                                                      |
| -------- | ------------------------------------------------------------------------------------------- |
| Priority | `must`, `should`, `could`                                                                   |
| Phase    | implementation phase from the design doc (1–4)                                              |
| Status   | `proposed` → `accepted` → `partial` → `implemented` → `verified`; or `deferred`, `rejected` |
| Verify   | `test` (automated), `review`, `manual`                                                      |
| Source   | design doc section, issue `#123`, ADR                                                       |

Rules:

- IDs are never reused or renumbered. Retire a requirement by setting `rejected`.
- Use "must/should" wording; one testable statement per requirement.
- Decisions _about_ requirements go in [`docs/adr/`](../adr/).

## Tracing to code

Reference a requirement in a comment next to the test that verifies it:

```ts
// req: REQ-VOTE-001
it("hides other votes before reveal", () => {
  /* ... */
});
```

Production code may reference IDs too (e.g. `// TODO(REQ-ROOM-003)`).

`scripts/reqs.py` checks, locally and in CI:

1. IDs are unique and well-formed; metadata values are valid.
2. Every `REQ-…` reference in code (`src/`, `tests/`, `e2e/`) points to an existing requirement.
3. Every `implemented`/`verified` requirement with `Verify: test` has a test reference.
4. `TRACEABILITY.md` is up to date.

```sh
python3 scripts/reqs.py            # check
python3 scripts/reqs.py --write    # regenerate TRACEABILITY.md
```

## Workflow

1. New need → open a **Requirement** issue or a PR adding it with `Status: proposed`.
2. Review and accept → `accepted`.
3. Implementation PRs list the IDs they address and move the status, with tests tagged `req: …`.
4. Release checklist: every `must` for the release's phase is `implemented`.
