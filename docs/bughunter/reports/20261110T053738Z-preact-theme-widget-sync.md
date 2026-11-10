# BugHunter audit: Preact host theme sync to Connect widget

- Run: `20261110T053738Z-ae690412de5e48959b2fb33c11ddbb00`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `737d10db0519475f52f68c97a63d0ef41613296a` (`737d10d docs(bughunter): audit Preact Twitter Card social preview (#83)`)
- Workflow: host theme toggle → document `data-theme` / `dark` / `cc--darkmode` → `<QratiConnect theme={theme} />` attribute on the custom element
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host keeps a single `'light' | 'dark'` state, writes it to the document before paint and on toggle, and passes the same value into `QratiConnect`. The SDK React wrapper forwards `theme` onto `<qrati-connect>`. Cookie-consent dark styling uses the `cc--darkmode` class already added in #50.

## Trace

1. Entry: `index.html` blocking script reads `localStorage['qc-theme']` (light/dark only) or `prefers-color-scheme`, then sets `data-theme`, `html.dark`, and `html.cc--darkmode`.
2. `src/main.tsx` renders `App` into `#app`. `App` `useState(initTheme)` re-reads via `readSavedTheme` / `getInitialTheme` and reapplies the same three document signals.
3. Toggle (`src/app.tsx`): next theme is the opposite literal; `setTheme`, document attributes/classes, `persistTheme(next)`.
4. Embed: `<QratiConnect organizationId={ORGANIZATION_ID} theme={theme} router="hash" />`. `theme` is the host state, not a second source.
5. SDK contract (`qrati-connect-ts` `src/exports/react.tsx`): `createElement('qrati-connect', { …, theme })`. `theme` defaults to `'light'` only when omitted; this host always passes the current value.
6. Persistence: `src/theme.js` writes only after a user toggle; read path rejects any stored value other than `light`/`dark`.

Open PR at selection: [#80](https://github.com/qrati-labs/qrati-connect-preact-example/pull/80) light-theme cookie-consent off-toggle contrast (`src/index.css` `--cc-toggle-off-bg`, consent contrast test, docs). Paths/behavior do not overlap this theme-prop workflow.

## Falsification

- **Widget stays light after host toggle:** not evidenced in this host. Preact re-renders with `theme={theme}`; the wrapper puts `theme` on the element. Whether the custom element observes the attribute is an SDK concern, not a missing host prop.
- **Pre-paint vs React first paint disagree:** both use the same storage key and the same light/dark-or-OS rule.
- **Consent modal ignores host dark theme:** `cc--darkmode` is set in the blocking script, `initTheme`, and `toggleTheme` (issue #50).
- **Invalid stored theme:** `readSavedTheme` and the inline script both ignore non-literals; `getInitialTheme` then uses OS preference.
- Adjacent, out of scope: cookie-consent toggle contrast (open #80 / #79), gallery org-id, hash router, GTM, Twitter/OG tags.

## Scope and non-goals

Host theme state, document classes, persistence, and the `theme` prop on `QratiConnect` only. Not SDK custom-element attribute observation, not cookie-consent CSS, not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads of `index.html`, `src/app.tsx`, `src/theme.js`, `src/main.tsx`, `src/config.ts`, plus `qrati-connect-ts` `src/exports/react.tsx` / `src/types.ts`
- Isolated worktree from preflight remote SHA `737d10d`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`

## Limitations

No browser toggle against a live `<qrati-connect>` upgrade. SDK internals beyond the React wrapper were not executed.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

_Timing table inserted after `finish`._
