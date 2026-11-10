# 0013: Minimal in-house i18n

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-LANG-001, REQ-LANG-002

## Context

The UI must be available in German, English, Polish and Russian, with correct plurals (Polish and Russian have one/few/many).
The app has about 30 strings and a single plural message.

## Decision

No i18n library. `src/i18n/messages.ts` holds typed dictionaries (English is the source; `de`, `pl` and `ru` are typed
`Record<MessageKey, ...>` so a missing key is a compile error). `src/i18n/i18n.tsx` provides `I18nProvider`/`useI18n`,
language detection (saved choice, then `navigator.languages`, then English), persistence in `localStorage`,
`<html lang>` updates, and plurals via the built-in `Intl.PluralRules`.

## Consequences

- No dependency and no runtime message-format parser; the bundle stays small.
- Only `{count}` interpolation and plural variants exist. If messages get richer (dates, numbers with units,
  rich text), switch to a library (e.g. Lingui or i18next) in a new ADR.
- Translations were written by the agent; a native speaker should review German, Polish and Russian.

## Alternatives considered

- react-i18next / Lingui / Paraglide: more features than needed for this size.
