# BugHunter audit: Preact cookie-consent opt-out analytics

- Run: `20261105T120039Z-2a302e384033481c8c43e99bdc1669fe`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `cf4d67be95d92c411c3b8336f9fdab405631e755` (`cf4d67b fix(favicon): resolve icon against mounted example base (#28)`)
- Workflow: geo-selected cookie-consent mode and analytics category activation (`src/lib/cookieConsent.ts` → `CookieConsent.run` → `syncGtm`)
- Disposition: P2 confirmed; narrow source fix
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/29
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

`[P2] Opt-out cookie consent never enables analytics` — **Evidence:** `src/lib/cookieConsent.ts` `initCookieConsent` / `checkConsentRequired`; trigger is a geo payload `{ required: false }` (or session cache `'false'`). `CookieConsent.run` uses `mode: 'opt-out'`, `autoShow: false`, `analytics: {}`. vanilla-cookieconsent v3 documents `[category].enabled` default `false` and documents `opt-out` as running only categories with `enabled: true` (configuration reference; maintainer on orestbida/cookieconsent#538: `enabled` takes effect only in `opt-out`). **Failure:** `acceptedCategory('analytics')` stays false; `syncGtm` keeps Google consent mode denied and skips `gtm.js`. Banner does not show, so the visitor cannot opt in. **Fix:** `analytics: { enabled: true }`. In `opt-in` mode the library ignores `enabled` and still waits for explicit accept. **Test:** `node --test tests/consent-opt-out-analytics.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` calls `initCookieConsent()`.
2. Inputs: geo fetch to `/api/cookie-consent-geo` on `qrati.com` hosts, else `https://qrati.com/api/cookie-consent-geo`; `sessionStorage` key `qrati_geo_consent_required`.
3. Authz/validation: non-OK, non-boolean `required`, or fetch errors fail closed (`required = true`). Boolean `false` is the opt-out path.
4. Transform: `mode: required ? 'opt-in' : 'opt-out'`, `autoShow: required`.
5. Persistence/side effects: `CookieConsent.run`; `onFirstConsent` / `onConsent` / `onChange` / post-run `syncGtm()`; `gtag('consent', 'update', …)` and conditional GTM script inject.
6. Output: analytics granted only if `acceptedCategory('analytics')` is true.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

Sibling call sites in this repository: only this `categories` object. Other example repos are out of scope.

Prior consent audits on this repo covered Google consent defaults, geo fail-closed JSON, and run() initialization; they did not check category `enabled` vs opt-out.

## Scope and non-goals

Opt-out analytics category default only. Not geo API correctness, not worker GTM HTML placeholders, not other example repositories.

## Tests and verification

- Authored: `tests/consent-opt-out-analytics.test.cjs`
- Command: `node --test tests/consent-opt-out-analytics.test.cjs` — **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; clean at delivery
- Build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**

## Limitations

No live geo/GTM request, no vanilla-cookieconsent runtime execution in this run. Confidence is high for the documented category default and opt-out activation rule against this source. Production GTM ID presence remains a separate deployment concern.

## Timing

Copied from the timer ledger. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-05T12:00:39Z | 2026-11-05T12:01:01Z | 00:00:22 (0.4 min) |
| `audit` | 2026-11-05T12:01:15Z | 2026-11-05T12:06:39Z | 00:05:24 (5.4 min) |
| **Total run (preflight start to finish)** | 2026-11-05T12:00:39Z | 2026-11-05T12:06:39Z | **00:06:00 (6.0 min)** |
| Unclassified interval between marked phases | — | — | 00:00:14 (0.2 min) |

- Preflight: 17:30:39–17:31:01 IST
- Audit: 17:31:15–17:36:39 IST
- Total: 17:30:39–17:36:39 IST
