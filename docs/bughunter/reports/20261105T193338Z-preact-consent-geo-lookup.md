# BugHunter audit: Preact cookie-consent geo lookup

- Run: `20261105T193338Z-28a49cdc3b5a4720b7070e089b23ce43`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `cc57207c039a0e6a198f08e0ebc3af7d24b7b090` (`cc57207 docs(bughunter): audit Preact FAQ disclosure workflow (#52)`)
- Workflow: cookie-consent geo lookup — endpoint selection, `sessionStorage` cache, and fail-closed mapping into `CookieConsent.run` mode
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. On first load, `checkConsentRequired` reads `sessionStorage` key `qrati_geo_consent_required`. A cache miss fetches the geo API with `cache: 'no-store'`, accepts only HTTP OK plus a boolean `required`, persists that boolean, and otherwise returns `true` without writing the cache (issue #6). Hostnames containing `qrati.com` use same-origin `/api/cookie-consent-geo`; every other hostname uses `https://qrati.com/api/cookie-consent-geo`. `initCookieConsent` maps `required` to `mode: required ? 'opt-in' : 'opt-out'`, `autoShow: required`, and `analytics.enabled: !required`. vanilla-cookieconsent documents `opt-in` as accept-before-scripts and `opt-out` as running categories with `enabled: true`; `autoShow` defaults true and is correctly disabled when the geo API says consent is not required. This worker does not serve `/api/cookie-consent-geo`. Network or parse failures take the existing catch path (`true` / opt-in).

## Trace

1. Entry: `src/main.tsx` `void initCookieConsent()` → `src/lib/cookieConsent.ts` `checkConsentRequired`.
2. Inputs: `window.location.hostname`; `sessionStorage` `qrati_geo_consent_required`; `fetch(geoUrl, { cache: 'no-store' })`.
3. Authz: none; public example. No cookies sent on the cross-origin localhost path (default `fetch` credentials).
4. Validation: `!response.ok` → `true`, no cache; JSON `required` must be boolean or `true`, no cache; `catch` → `true`.
5. State: session-scoped cache of `'true'` / `'false'` only after a validated payload. `initPromise` memoizes a single `CookieConsent.run`.
6. Side effects: one geo GET per session until the tab is closed; no GTM injection in this function (`syncGtm` is adjacent).
7. Output: consent modal auto-shown in required regions; silent opt-out elsewhere with analytics enabled by config (issue #29 / #47).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR. Prior geo audit (2026-10-16, issue #6) covered invalid HTTP/JSON handling only.

## Falsification

- **`hostname.includes('qrati.com')` substring:** the Wrangler route is zone `qrati.com`. A clone on `notqrati.com` would call same-origin `/api/...` and fail closed if that path is missing. Not a reachable production miss for this example.
- **Session cache skips refetch:** intended. Values are only stored after schema checks. Tampering requires script access to `sessionStorage`.
- **Localhost CORS failure:** `hostname` is not `qrati.com`, so the client calls `https://qrati.com/api/cookie-consent-geo`. A CORS or network error returns `true` (opt-in, `autoShow: true`). Safe.
- **Worker SPA fallback intercepts geo:** `wrangler.jsonc` pattern is `*qrati.com/connect/preact-example*` only. `/api/cookie-consent-geo` is not this Worker.
- **`respectGpc` default false:** library default. Banner copy does not promise Global Privacy Control. Not a broken geo lookup.
- **Stale geo after travel in one tab:** session-only; not a violated invariant in this host.
- Adjacent, out of scope: GTM bootstrap, analytics withdrawal, preferences modal, org id, hash router, worker SPA routing, FAQ, theme.

## Scope and non-goals

Geo URL selection, session cache, and fail-closed mapping into consent mode on this Preact host only. Not a legal opinion. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- Existing `tests/cookie-consent-geo.test.ts` covers invalid HTTP/JSON only; not executed here.
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [CookieConsent `mode` / `autoShow` / `[category].enabled`](https://cookieconsent.orestbida.com/reference/configuration-reference.html)

## Limitations

No live `qrati.com` geo response, no CORS probe from localhost, no browser sessionStorage exercise.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T19:33:38Z | 2026-11-05T19:34:02Z | 00:00:24 (0.4 min) | 01:03:38–01:04:02 |
| `audit` | 2026-11-05T19:34:19Z | 2026-11-05T19:38:52Z | 00:04:33 (4.5 min) | 01:04:19–01:08:52 |
| `delivery` | 2026-11-05T19:38:52Z | 2026-11-05T19:39:28Z | 00:00:36 (0.6 min) | 01:08:52–01:09:28 |
| **Total run (preflight start to finish)** | 2026-11-05T19:33:38Z | 2026-11-05T19:39:28Z | **00:05:50 (5.8 min)** | **01:03:38–01:09:28** |
| Unclassified interval between marked phases | — | — | 00:00:17 (0.3 min) | — |

- Preflight: 01:03:38–01:04:02 IST (6 Nov)
- Audit: 01:04:19–01:08:52 IST (6 Nov)
- Delivery: 01:08:52–01:09:28 IST (6 Nov)
- Total: 01:03:38–01:09:28 IST (6 Nov)

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
