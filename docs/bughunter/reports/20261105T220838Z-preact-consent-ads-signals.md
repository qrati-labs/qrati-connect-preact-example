# BugHunter audit: Preact Consent Mode advertising signals vs analytics category

- Run: `20261105T220838Z-9788fa1fbe7a437e8cb99db9e24e71a6`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `fe36ae1715523e1224c42fbbb42993fd0b96f4e1` (`fe36ae1 fix(ui): let Connect PhotoSwipe stack above the theme toggle (#59)`)
- Workflow: Google Consent Mode v2 `ad_storage` / `ad_user_data` / `ad_personalization` updates when the host’s only optional cookie category is `analytics`
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host has a single optional category (`analytics`). `syncGtm` copies that boolean onto all four Consent Mode v2 storage signals, including advertising. That mapping is reachable, but it does not violate a stated contract in this repository: the UI never offers a separate ads choice, no advertising tags are loaded from this host unless `VITE_GTM_ID` is set at build time, and the Qwik sibling uses the same analytics→ads grant. Prior opt-in analytics work (#47) listed the ads split as adjacent, not a failed analytics default.

## Trace

1. Entry: `index.html` blocking stub sets `gtag('consent', 'default', { analytics_storage, ad_storage, ad_user_data, ad_personalization: 'denied' })`. `src/main.tsx` calls `initCookieConsent()`.
2. Inputs: geo `required` from `/api/cookie-consent-geo` (or `https://qrati.com/api/cookie-consent-geo`); user Accept all / Reject analytics / preferences save; optional `import.meta.env.VITE_GTM_ID`.
3. Authz: none; public example.
4. Categories (`src/lib/cookieConsent.ts`): `necessary` read-only enabled; `analytics.enabled: !required`. Language copy describes essential + analytics cookies only. Preferences `sections` link those two categories.
5. `syncGtm` (onFirstConsent / onConsent / onChange / post-`run`): `analytics = CookieConsent.acceptedCategory('analytics')`; `gtag('consent', 'update', { analytics_storage, ad_storage, ad_user_data, ad_personalization: analytics ? 'granted' : 'denied' })`. GTM script injects only when `analytics && gtmId`.
6. Output: denied defaults remain until `CookieConsent.run` completes and `syncGtm` runs. Reject analytics denies all four. Accept analytics grants all four. Empty `VITE_GTM_ID` (`.env.example`) skips `gtm.js`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Ads granted without an ads category:** not a broken analytics toggle. This host defines one optional category; vanilla-cookieconsent “Accept all” enables every non-readonly category, which is only `analytics`.
- **GDPR disclosure gap vs Google’s separate ad signals:** not evidenced user impact here. No ads category, no ads cookie table, and GTM is not part of the default example. Consent Mode updates without `gtm.js` do not set advertising cookies in this repo.
- **Opt-out regions (`required === false`) grant ads on load:** matches the Qwik host’s non-GDPR path (`updateGtagConsent({ analytics: true, ads: true })`). Geo fail-closed still uses opt-in (`required` true).
- **React/Vue/Solid `adsState` split:** sibling pattern, not a Preact-host contract. Qwik still maps ads to analytics accept (`ads: !required || accepted`).
- **Worker `GTM_ID` HTML rewrite:** current `index.html` has no `__GTM_ID__` or GTM comment blocks; client GTM is `VITE_GTM_ID` only. Already covered by the worker SPA / GTM bootstrap audits.
- Adjacent, out of scope: `wait_for_update`, cookie persistence, geo lookup, dark mode, withdrawal `autoClear`, PhotoSwipe stacking (#59).

## Scope and non-goals

Preact example Consent Mode advertising signals vs the analytics category only. Not SDK ads, not other example repos, no production fetch, no Tag Assistant session.

## Tests and verification

- Authored: none (report-only).
- Command: n/a (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: Google Consent Mode websites guide (search/index); vanilla-cookieconsent v3.1.0 `acceptedCategory` / `onConsent`; MDN containing-block list (overflow not in the fixed-position ancestor list; used only to avoid reopening #59)
- Duplicate search: `gh issue list --repo qrati-labs/qrati-connect-preact-example --state all`; no open or closed issue for an ads/analytics Consent Mode split. Report-only: no issue created.

## Limitations

No live `qrati.com` request, no GTM container inspection, no browser Consent Mode debug. Whether a production `VITE_GTM_ID` container fires ads tags is unknown.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T22:08:38Z | 2026-11-05T22:09:01Z | 00:00:23 (0.4 min) | 03:38:38–03:39:01 |
| `audit` | 2026-11-05T22:09:20Z | 2026-11-05T22:13:36Z | 00:04:16 (4.3 min) | 03:39:20–03:43:36 |
| `delivery` | 2026-11-05T22:13:36Z | 2026-11-05T22:14:25Z | 00:00:49 (0.8 min) | 03:43:36–03:44:25 |
| **Total run (preflight start to finish)** | 2026-11-05T22:08:38Z | 2026-11-05T22:14:25Z | **00:05:47 (5.8 min)** | **03:38:38–03:44:25** |
| Unclassified interval between marked phases | — | — | 00:00:18 (0.3 min) | — |

- Preflight: 03:38:38–03:39:01 IST (6 Nov)
- Audit: 03:39:20–03:43:36 IST (6 Nov)
- Delivery: 03:43:36–03:44:25 IST (6 Nov)
- Total: 03:38:38–03:44:25 IST (6 Nov)

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
