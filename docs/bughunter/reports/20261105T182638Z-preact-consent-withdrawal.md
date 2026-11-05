# BugHunter audit: Preact analytics consent withdrawal

- Run: `20261105T182638Z-94e9f0da38fd47229fc98720eacb66d7`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `914a6a3d8d002f3c38d8b4e40a6d92f8e1546e75` (`914a6a3 fix(consent): do not pre-enable analytics in opt-in mode (#48)`)
- Workflow: Cookie Preferences “Reject analytics” / save after a prior analytics accept — `onChange` → `syncGtm` consent-mode update, GTM script lifetime, and cookie `autoClear`
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. After analytics is accepted, `CookieConsent.run` callbacks (`onFirstConsent`, `onConsent`, `onChange`) and the post-`run` `syncGtm()` all call the same updater. Withdrawing analytics via the preferences modal therefore issues `gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })`. Google Consent Mode’s documented withdrawal mechanism is that update, not removing `gtm.js`. The early return `if (!analytics || !gtmId || document.getElementById('gtm-script')) return` leaves an already-injected container in place, which matches Consent Mode (the container stays; storage flags change). `categories.analytics` has no `autoClear` cookie list; vanilla-cookieconsent only deletes named cookies when that array is present. This host does not set `_ga` / `_gid` itself. `.env.example` has an empty `VITE_GTM_ID`, and `syncGtm` does not inject `gtm.js` without an ID, so the default example never plants analytics cookies to clear. Sibling React `autoClear` of `_ga`/`_gid` is a stricter pattern, not a violated contract in this repository’s banner or preferences copy (optional analytics; no deletion promise).

## Trace

1. Entry: `src/main.tsx` `void initCookieConsent()`; footer `Cookie Preferences` (`src/app.tsx`) calls `showCookiePreferences()` after init.
2. Inputs: geo `required` selects `opt-in` vs `opt-out`; `CookieConsent.acceptedCategory('analytics')`; optional `VITE_GTM_ID`.
3. Authz: none; public example. Preferences UI is reachable (`data-cc="show-preferencesModal"` plus `onClick`).
4. Validation / mode: `checkConsentRequired` fail-closes on bad HTTP/JSON; `analytics.enabled: !required` (issue #47 / SHA `914a6a3`).
5. Accept path: `syncGtm` updates Consent Mode; if analytics accepted and `gtmId` set and `#gtm-script` absent, pushes `gtm.start` / `event: 'gtm.js'` then appends `gtm.js` (issue #34).
6. Withdraw path: preferences “Reject analytics” or save with analytics off → `onChange` → `syncGtm` with `analytics === false` → consent update to `denied` for analytics and ad storage flags; inject skipped.
7. Output: Google tags should honor denied storage; host page and widget remain usable. No `autoClear` of third-party analytics cookies.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **GTM script remains after reject:** expected for Consent Mode. Google’s site setup tells implementers to `gtag('consent', 'update', …)` after CMP interaction; it does not require unloading the container.
- **Missing `autoClear`:** library no-ops without a cookie name array. Not a broken modal or a broken `gtag` update. Unproven leftover `_ga` on the default empty-GTM example.
- **Ads flags follow analytics:** this host has only `necessary` and `analytics` categories. Granting/denying ad storage with the analytics toggle is the same mapping used when React calls `updateGtagConsent({ analytics: accepted, ads: !required || accepted })` in GDPR regions. UI copy does not offer a separate ads category.
- **Double handler (`data-cc` + `onClick`):** if the library is not yet `run()`, `data-cc` is a no-op and `onClick` awaits init then `showPreferences()`. After init, showing preferences twice is not a failed withdraw path.
- Adjacent, out of scope: opt-in default (#47), preferences sections (#40), footer re-entry (#45), GTM bootstrap event (#34), org id, favicon, hash router, worker SPA routing, Google Fonts.

## Scope and non-goals

Analytics consent withdrawal after accept on this Preact host only. Not a legal opinion. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Google Consent Mode (websites)](https://developers.google.com/tag-platform/security/guides/consent); vanilla-cookieconsent v3 `onChange` / category `autoClear` (requires a cookie-name array)

## Limitations

No live `qrati.com` request, no Tag Assistant session, no `VITE_GTM_ID` injected in this run. Consent-library `autoClear` execution was not run.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T18:26:38Z | 2026-11-05T18:27:03Z | 00:00:25 (0.4 min) | 23:56:38–23:57:03 |
| `audit` | 2026-11-05T18:27:23Z | 2026-11-05T18:31:53Z | 00:04:31 (4.5 min) | 23:57:23–00:01:53 |
| `delivery` | 2026-11-05T18:31:53Z | 2026-11-05T18:33:11Z | 00:01:18 (1.3 min) | 00:01:53–00:03:11 |
| **Total run (preflight start to finish)** | 2026-11-05T18:26:38Z | 2026-11-05T18:33:11Z | **00:06:33 (6.5 min)** | **23:56:38–00:03:11** |
| Unclassified interval between marked phases | — | — | 00:00:20 (0.3 min) | — |

- Preflight: 23:56:38–23:57:03 IST (5 Nov)
- Audit: 23:57:23 IST (5 Nov)–00:01:53 IST (6 Nov)
- Delivery: 00:01:53–00:03:11 IST (6 Nov)
- Total: 23:56:38 IST (5 Nov)–00:03:11 IST (6 Nov)

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
