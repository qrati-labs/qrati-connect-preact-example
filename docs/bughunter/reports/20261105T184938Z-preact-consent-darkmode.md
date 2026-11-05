# BugHunter audit: Preact cookie-consent dark mode

- Run: `20261105T184938Z-c5245e8945d04e6f867d57c9e5605acf`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `a01bbad5fdfadd8ece1a3f6945215061b5f28216` (`a01bbad docs(bughunter): audit Preact analytics consent withdrawal (#49)`)
- Workflow: host light/dark theme writers → vanilla-cookieconsent `cc--darkmode` on `html` → consent/preferences modal color-scheme and dark-scheme tokens
- Disposition: P3 confirmed; narrow `cc--darkmode` class sync + regression test
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/50
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Host dark theme does not enable cookie-consent dark mode** — **Evidence:** `index.html` pre-paint bootstrap, `initTheme`, and `toggleTheme` in `src/app.tsx` set `data-theme` and toggle `html.dark` only. vanilla-cookieconsent 3.1.0 `dist/css-components/dark-scheme.css` applies dark tokens on `.cc--darkmode` and `color-scheme: dark` on `.cc--darkmode #cc-main`. This repo never writes `cc--darkmode`. Host CSS overrides a subset of `--cc-*` on `html.dark #cc-main` / `[data-theme='dark'] #cc-main`. **Failure:** with a dark host theme, the consent UI does not receive the library dark scheme; leftover `:root` light tokens (separators, category hover, concrete light borders) and UA `color-scheme` stay light. **Fix:** `classList.toggle('cc--darkmode', theme === 'dark')` on the same three writers. **Test:** `tests/consent-darkmode.test.cjs` — `node --test tests/consent-darkmode.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `index.html` blocking theme script; then `src/main.tsx` renders `App` and `initCookieConsent()`.
2. Inputs: `localStorage['qc-theme']` (`'light'|'dark'`), else `prefers-color-scheme: dark`.
3. Authz: none; public example.
4. Theme writes (pre-fix): `data-theme` + `classList.toggle('dark', …)` only.
5. Consent UI: `#cc-main` from vanilla-cookieconsent after geo; library dark scheme gated on `html.cc--darkmode`.
6. Output (post-fix): dark host theme also sets `cc--darkmode`; light removes it. Gallery `theme` prop and consent mode/GTM unchanged.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- Theme-toggle audit (20261105T124438Z) treated cookie tokens under `html.dark` as adjacent, not the library `cc--darkmode` contract.
- Partial `#cc-main` variable overrides do not set `color-scheme: dark` and do not replace every dark-scheme token on `.cc--darkmode`.
- Sibling Vue/Svelte/Solid/Qwik/Next hosts add/remove `cc--darkmode` with the host theme; that is the documented switch, not a style preference.
- Consent still accepts/rejects without the class; this is presentation of the CMP, not a geo/GTM defect.

## Scope and non-goals

Cookie-consent dark-mode class sync on this Preact host only. Not brand-token redesign, not other example repos, no production fetch.

## Tests and verification

- Authored: `tests/consent-darkmode.test.cjs`
- Command: `node --test tests/consent-darkmode.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: https://cookieconsent.orestbida.com/advanced/ui-customization.html
- Library source (same version as package.json): vanilla-cookieconsent 3.1.0 `dark-scheme.css`

## Limitations

No browser screenshot of `#cc-main` in dark mode. No live `qrati.com` request.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER
