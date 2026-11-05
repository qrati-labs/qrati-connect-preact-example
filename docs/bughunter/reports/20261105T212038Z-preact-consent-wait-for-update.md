# BugHunter audit: Preact Consent Mode wait_for_update

- Run: `20261105T212038Z-0bc26230ac904ff899f8e1c82b31c17c`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `c70b6665e743d854f78a36572c3e897e001c1cfa` (`c70b666 docs(bughunter): audit Preact cookie-consent persistence (#56)`)
- Workflow: blocking Google Consent Mode `default` in `index.html` vs async CMP (`initCookieConsent` geo lookup) and whether missing `wait_for_update` lets Google tags fire before `consent` `update`
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host sets Consent Mode v2 defaults to `denied` in a blocking `index.html` script (issue #1) with no `wait_for_update`. Google documents `wait_for_update` as optional for **advanced** consent, where Google tags may already be on the page while an async CMP catches up. This example uses **basic** consent: `src/lib/cookieConsent.ts` `syncGtm` injects `gtm.js` only after analytics is accepted (and `VITE_GTM_ID` is set). There is no GTM snippet, `gtag('config')`, or other Google tag in the HTML that could send measurement during the geo `fetch`. Default denied without a wait window therefore does not violate the documented Consent Mode contract on this host.

## Trace

1. Entry: `index.html` head scripts run before `#app` / `/src/main.tsx`. First script defines `dataLayer` / `gtag` and `gtag('consent', 'default', { analytics_storage, ad_storage, ad_user_data, ad_personalization: 'denied' })`.
2. Inputs: no region list and no `wait_for_update` on that default. Geo `{ required }` is fetched later in `checkConsentRequired` (`/api/cookie-consent-geo` or `https://qrati.com/api/cookie-consent-geo`).
3. Authz: none; public example.
4. CMP: `src/main.tsx` `void initCookieConsent()` then `render(<App />)`. `CookieConsent.run` is after the geo await. `onFirstConsent` / `onConsent` / `onChange` / post-`run` call `syncGtm`.
5. Side effects: `syncGtm` issues `gtag('consent', 'update', …)` from `acceptedCategory('analytics')`. Only then, if analytics is granted, `VITE_GTM_ID` is set, and `#gtm-script` is absent, it queues `gtm.start` / `event: 'gtm.js'` and appends `gtm.js` (issues #29/#34/#47).
6. Output: until the user (or opt-out default) grants analytics, no GTM container loads. Google tags cannot fire during the async geo gap because they are not on the page.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Google optional `wait_for_update` (500ms) vs sibling React/Qwik Vite/layout snippets:** those hosts also set regional/`wait_for_update` defaults in contexts that may load GTM earlier. This host’s documented setup is basic consent (container after grant). The optional wait does not apply when no Google tag is present to wait.
- **Geo fetch longer than 500ms:** even if geo is slow, nothing in `index.html` or `src/main.tsx` loads GTM, Ads, or GA before `syncGtm`. Fonts (`src/index.css` Google Fonts `@import`) are not Consent Mode tags (prior fonts audit).
- **`.env.example` empty `VITE_GTM_ID`:** `syncGtm` never injects `gtm.js` on the default example; consent update still runs. No measurement send path.
- **Ads flags follow analytics:** same mapping as React `updateGtagConsent({ analytics: accepted, ads: !required || accepted })` in GDPR regions; UI has no separate ads category (withdrawal audit). Not this workflow.
- **Issue #1 already required denied defaults before tags:** still present; this run asked whether the remaining Google optional (`wait_for_update`) is required given async CMP. It is not, for basic consent.

## Scope and non-goals

Host Preact Consent Mode default vs async CMP / GTM inject timing only. Not a legal opinion. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused file reads used
- Google: [Set up consent mode](https://developers.google.com/tag-platform/security/guides/consent) (`wait_for_update` optional for async CMP when tags may fire); [Consent mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode) (basic vs advanced)

## Limitations

No Tag Assistant session, no live `qrati.com` request, no timing of the geo endpoint. Library GTM inject path taken from this repository’s `syncGtm`.

## Timing (measured wall-clock)

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T21:20:38Z | 2026-11-05T21:21:01Z | 00:00:23 (0.4 min) | 02:50:38–02:51:01 |
| `audit` | 2026-11-05T21:21:17Z | 2026-11-05T21:25:48Z | 00:04:31 (4.5 min) | 02:51:17–02:55:48 |
| `delivery` | 2026-11-05T21:25:48Z | 2026-11-05T21:26:33Z | 00:00:45 (0.8 min) | 02:55:48–02:56:33 |
| **Total run (preflight start to finish)** | 2026-11-05T21:20:38Z | 2026-11-05T21:26:33Z | **00:05:55 (5.9 min)** | **02:50:38–02:56:33** |
| Unclassified interval between marked phases | — | — | 00:00:16 (0.3 min) | — |

- Preflight: 02:50:38–02:51:01 IST (6 Nov)
- Audit: 02:51:17–02:55:48 IST (6 Nov)
- Delivery: 02:55:48–02:56:33 IST (6 Nov)
- Total: 02:50:38–02:56:33 IST (6 Nov)

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
