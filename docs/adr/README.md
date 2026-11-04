# Architecture decision records

One file per decision: `NNNN-short-title.md`, copied from [0000-template.md](0000-template.md).
ADRs are never edited after acceptance. To change a decision, write a new ADR
that supersedes the old one.

| ADR                                  | Decision                                                             |
| ------------------------------------ | -------------------------------------------------------------------- |
| [0001](0001-react-vite-kith-npm.md)  | TypeScript + Vite + React, kith as npm tarball from a GitHub Release |
| [0003](0003-flat-headspace-style.md) | Flat, Headspace-oriented visual style, no micro-movements            |
| [0002](0002-requirements-as-code.md) | Requirements as code with automated traceability                     |

Open questions waiting for an ADR:

- [ ] Room/vote data model on top of kith changes (hidden votes until reveal)
- [ ] Participant identity and room admission (depends on kith invitations)
- [ ] Where the relay is hosted
