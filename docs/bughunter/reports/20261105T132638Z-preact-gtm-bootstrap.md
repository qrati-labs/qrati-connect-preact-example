# BugHunter audit: Preact consent-gated GTM bootstrap

- Run: `20261105T132638Z-a73d9a26116f4abf81aecfdfe63f63b8`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `8481966d83dafa6b48f7aee04f574ba734dd0cd9` (`8481966 docs(bughunter): audit Preact Open Graph and JSON-LD social preview (#33)`)
- Workflow: consent-gated Google Tag Manager container load (`src/lib/cookieConsent.ts` `syncGtm` → `gtm.js`)
- Disposition: P2 confirmed; narrow source fix
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/34
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

`[P2] Consent-gated GTM inject skips documented gtm.js bootstrap event` — **Evidence:** `src/lib/cookieConsent.ts` `syncGtm`; trigger is analytics accepted (`acceptedCategory('analytics')`) with `VITE_GTM_ID` set (geo opt-out now enables analytics by default, issue #29 / PR #30). **Failure:** the only GTM load path appends `gtm.js` without queuing `{'gtm.start', event: 'gtm.js'}` on `dataLayer`. Google’s web-container install requires that push immediately before the script; it is Container Loaded / All Pages. `index.html` has no GTM IIFE; worker `__GTM_ID__` replacement is a no-op on current HTML. **Fix:** `dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })` immediately before creating the script. **Test:** `node --test tests/gtm-bootstrap.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` calls `initCookieConsent()`.
2. Inputs: geo mode selects opt-in vs opt-out; `syncGtm` on consent callbacks and after `CookieConsent.run`.
3. Authz/validation: inject only when analytics accepted, `gtmId` present, and `#gtm-script` absent.
4. Side effects: `gtag('consent', 'update', …)` then (before fix) script append only.
5. Output: `gtm.js` network load without documented Container Loaded event on `dataLayer`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

Sibling call sites in this repository: only `syncGtm`. Worker GTM HTML substitution does not emit `gtm.js` events on current `index.html` (no placeholders). Other example repos are out of scope; the React example’s Vite plugin still emits the official `gtm.start` / `event: 'gtm.js'` push on its HTML path.

Prior consent audits covered denied defaults, geo fail-closed JSON, run() initialization, and opt-out `analytics.enabled`; they did not check the GTM container bootstrap event.

## Falsification

- Loading `gtm.js` alone is not the documented install; the snippet push is what queues Container Loaded (`gtm.js`). Virtual `gtm.init` / `gtm.init_consent` events do not replace it.
- Missing `twitter:` tags, empty `ORGANIZATION_ID`, Google Fonts, and worker `Content-Length` reuse are adjacent and not this workflow.
- Production presence of `VITE_GTM_ID` is a deploy concern; the inject path is still reachable in source when the env is set.

## Scope and non-goals

Bootstrap push on the existing consent-gated inject only. Not restoring pre-consent HTML GTM snippets, not deleting worker placeholders, not other examples.

## Tests and verification

- Authored: `tests/gtm-bootstrap.test.cjs`
- Command: `node --test tests/gtm-bootstrap.test.cjs` — **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; clean at delivery
- Build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- CodeGraph: unindexed for this worktree; focused file reads used

## Limitations

No live GTM container execution in this run. Confidence is high against Google’s published install snippet and the sibling React Vite GTM plugin. Exact tag-firing matrix inside a minified `gtm.js` build was not executed.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T13:26:38Z | 2026-11-05T13:27:02Z | 00:00:24 (0.4 min) | 18:56:38–18:57:02 |
| `audit` | 2026-11-05T13:27:28Z | 2026-11-05T13:33:43Z | 00:06:15 (6.2 min) | 18:57:28–19:03:43 |
| `delivery` | 2026-11-05T13:32:47Z | 2026-11-05T13:33:43Z | 00:00:56 (0.9 min) | 19:02:47–19:03:43 |
| **Total run (preflight start to finish)** | 2026-11-05T13:26:38Z | 2026-11-05T13:33:43Z | **00:07:05 (7.1 min)** | **18:56:38–19:03:43** |
| Unclassified interval between marked phases | — | — | 00:00:00 (0.0 min) | — |

Timing-table insertion occurred after this measurement snapshot. Audit and delivery overlap because delivery started before audit was closed.
