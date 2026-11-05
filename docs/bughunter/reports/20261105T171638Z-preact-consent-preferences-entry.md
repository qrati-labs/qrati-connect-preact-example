# BugHunter audit: Preact cookie-preferences re-entry

- Run: `20261105T171638Z-2aabca72d45b4729832ad09cc800d50c`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `5a82dff36c723e6484bd3932e57cf79d8c08ad75` (`5a82dff fix(theme): apply saved theme before first CSS paint (#44)`)
- Workflow: reopen cookie preferences after first consent (`src/lib/cookieConsent.ts` → footer control in `src/app.tsx` → `CookieConsent.showPreferences()`)
- Disposition: P3 confirmed; narrow host wiring + regression test
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/45
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

`[P3] No host control to reopen cookie preferences after first consent` — **Evidence:** `src/main.tsx` `initCookieConsent()`; `src/lib/cookieConsent.ts` `autoShow: required`; `src/app.tsx` footer nav (qrati.com / npm / GitHub / Pricing only). vanilla-cookieconsent v3.1.0 binds `[data-cc="show-preferencesModal"]` at `run()` and otherwise opens the modal from `showPreferences()` or the first-visit **Manage preferences** button. **Failure:** after Accept/Reject, or in opt-out (`autoShow: false`), visitors cannot change analytics consent. **Fix:** export `showCookiePreferences()` (await init, then `CookieConsent.showPreferences()`) and add a footer **Cookie Preferences** button with `data-cc="show-preferencesModal"`. **Test:** `node --test tests/consent-preferences-entry.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` starts consent init (async) then renders `App`.
2. Inputs: geo `/api/cookie-consent-geo` or `https://qrati.com/api/cookie-consent-geo`; session cache `qrati_geo_consent_required`.
3. Authz: none; public example.
4. Consent run: first-visit modal only when `required`; preferences sections already present (issue #40).
5. Side effects: `syncGtm` on first consent / consent / change (unchanged).
6. Output: footer control always in the DOM; click awaits init and opens the preferences modal. `data-cc` also binds when `run()` sees the button (after the first `await`, Preact has rendered).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Reachable:** yes. Opt-in: banner auto-hides after a choice; no second entry. Opt-out: banner never auto-shows (`autoShow: false` after issue #29).
- **Intentional minimal demo:** rejected. The host already ships the preferences modal and **Manage preferences** on the first-visit banner (issue #40). Sibling Connect examples (React, Qwik, Solid) expose a persistent footer control.
- **Empty `VITE_GTM_ID` means no analytics:** does not remove the consent cookie or the advertised analytics category; GTM can still be set at build time.
- **Library floating button:** v3.1.0 does not add a persistent preferences control unless the host binds `data-cc` or calls `showPreferences()`.
- Adjacent, out of scope: geo fail-closed (#6), opt-out default (#29), GTM bootstrap (#34), empty sections (#40).

## Scope and non-goals

Host Preact example re-entry control only. Not a legal opinion. No production fetch. No other example repos.

## Tests and verification

- Authored: `tests/consent-preferences-entry.test.cjs`
- Command: `node --test tests/consent-preferences-entry.test.cjs` — **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; clean at delivery
- Build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- CodeGraph: unindexed for this worktree; focused file reads used
- Issue #45 created and read back OPEN; no mapped owner to assign

## Limitations

No browser click of the live modal in this run. Confidence is high against library `data-cc` / `showPreferences` wiring and sibling host pattern.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T17:16:38Z | 2026-11-05T17:17:02Z | 00:00:24 (0.4 min) | 22:46:38–22:47:02 |
| `audit` | 2026-11-05T17:17:19Z | 2026-11-05T17:22:45Z | 00:05:25 (5.4 min) | 22:47:19–22:52:45 |
| `delivery` | 2026-11-05T17:22:39Z | 2026-11-05T17:23:25Z | 00:00:46 (0.8 min) | 22:52:39–22:53:25 |
| **Total run (preflight start to finish)** | 2026-11-05T17:16:38Z | 2026-11-05T17:23:25Z | **00:06:47 (6.8 min)** | **22:46:38–22:53:25** |
| Unclassified interval between marked phases | — | — | 00:00:12 (0.2 min) | — |

Timing-table insertion occurred after this measurement snapshot. Audit and delivery overlap because delivery started before audit was closed.
