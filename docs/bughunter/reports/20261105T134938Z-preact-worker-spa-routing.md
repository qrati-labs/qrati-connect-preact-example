# BugHunter audit: Preact Worker prefix routing and SPA HTML delivery

- Run: `20261105T134938Z-a96ee63ef4a946ffa0e3c86668a17f3f`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `91ac9b408b7882c42ca6b3108732f434d14b4891` (`91ac9b4 fix(consent): queue GTM gtm.js bootstrap before loading container (#35)`)
- Workflow: Cloudflare Worker prefix rewrite, static-asset dispatch, and HTML GTM placeholder handling for `/connect/preact-example`
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. Browser navigations to the mounted example can be served as the SPA `index.html` fallback without invoking `src/worker.ts`, while non-navigation requests that miss a dist-root asset still hit the Worker, which strips `/connect/preact-example` and fetches `env.ASSETS`. That split matches Cloudflare Workers static-asset routing for `not_found_handling: "single-page-application"` with `compatibility_date` after `2025-04-01` and default `run_worker_first: false`. Current `index.html` has no `__GTM_ID__` placeholders or GTM comment blocks, so the Worker HTML rewrite is a no-op when it does run. GTM bootstrap is client-side in `src/lib/cookieConsent.ts` (already fixed on this SHA). Prefix stripping remains necessary for JS/CSS/favicon under Vite `base: '/connect/preact-example/'`.

## Trace

1. Entry: zone route `*qrati.com/connect/preact-example*` (`wrangler.jsonc`).
2. Inputs: request URL pathname; optional `VITE_GTM_ID` / `GTM_ID` Worker env (unused on current HTML).
3. Authz: none; public static example.
4. Routing (Cloudflare docs, worker-script + SPA pages, retrieved 2026-11-05):
   - Default asset-first: matching dist files are served without the User Worker.
   - Dist layout is root (`index.html`, `assets/`, `public/` copies), not `/connect/preact-example/…`, so prefixed paths generally do not match as files.
   - With `not_found_handling: "single-page-application"` and `compatibility_date: "2026-07-06"` (≥ `2025-04-01`), **navigation** requests (`Sec-Fetch-Mode: navigate`) skip the User Worker and serve `/index.html` with 200.
   - Non-navigation misses invoke `src/worker.ts`.
5. Worker transform (`src/worker.ts`):
   - `/connect/preact-example` or `/connect/preact-example/` → `/`
   - `/connect/preact-example/…` → path after the prefix
   - `env.ASSETS.fetch` (html_handling + SPA fallback apply to the binding)
   - Non-HTML returned as-is
   - HTML: replace `__GTM_ID__` or strip GTM comment blocks; return `new Response(html, { status, statusText, headers: res.headers })`
6. Output: HTML shell from SPA fallback or Worker; hashed assets and `public/` files via prefix strip.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Navigation skips Worker:** not a broken page. SPA fallback serves `dist/index.html`. Script/style hrefs are Vite-base absolute (`/connect/preact-example/…`), so they do not depend on Worker HTML rewriting.
- **GTM HTML rewrite never runs in browsers:** not a GTM failure. `index.html` has no placeholders; `syncGtm` injects `gtm.js` after analytics consent.
- **Stale `Content-Length` / `ETag` after rewrite:** Cloudflare default asset headers document `Content-Type`, `Cache-Control`, `ETag`, `CF-Cache-Status` — not `Content-Length` or `Content-Encoding`. Current HTML is unchanged when the rewrite runs, so validators still match the body. Prior 2026-10-16 worker audit left this as an unknown; this run still cannot claim a reachable failure without an edge response.
- **`run_worker_first` unset:** required only if HTML must be transformed on every navigation. That is not the current GTM contract.
- Adjacent, out of scope: empty `VITE_ORGANIZATION_ID`, Google Fonts `@import`, theme toggle, hash router, favicon (fixed #28).

## Scope and non-goals

Worker prefix routing, SPA navigation vs User Worker, and HTML GTM substitution only. Not consent/GTM JS, not other example repos, no production fetch.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Worker script routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/), [SPA](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/), [Bindings](https://developers.cloudflare.com/workers/static-assets/binding/), [Headers](https://developers.cloudflare.com/workers/static-assets/headers/)

## Limitations

No live `qrati.com` request, no wrangler/miniflare execution, no ASSETS response-header capture. Edge `Sec-Fetch-Mode` behavior is taken from Cloudflare docs, not observed on production.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-05T13:49:38Z | 2026-11-05T13:50:00Z | 00:00:22 (0.4 min) |
| `audit` | 2026-11-05T13:50:26Z | 2026-11-05T13:54:54Z | 00:04:28 (4.5 min) |
| `delivery` | 2026-11-05T13:54:54Z | 2026-11-05T13:56:15Z | 00:01:21 (1.4 min) |
| **Total run (preflight start to finish)** | 2026-11-05T13:49:38Z | 2026-11-05T13:56:15Z | **00:06:37 (6.6 min)** |
| Unclassified interval between marked phases | — | — | 00:00:26 (0.4 min) |

- Preflight: 19:19:38–19:20:00 IST
- Audit: 19:20:26–19:24:54 IST
- Delivery: 19:24:54–19:26:15 IST
- Total: 19:19:38–19:26:15 IST

Timing-table insertion itself occurs after this measurement snapshot.
