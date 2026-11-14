# BugHunter audit: Preact Worker HTML GTM rewrite vs client syncGtm

- Run: `20261114T053638Z-d11b4507405840a2b18618fa20e22d0b`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `30ca10977513d670a80b179893a2eb667e210485` (`30ca109 fix(a11y): underline in-sentence hero links (#88)`)
- Workflow: deployed HTML path — Cloudflare Worker GTM placeholder substitution/removal vs consent-gated client `syncGtm` (`src/worker.ts`, `index.html`, `src/lib/cookieConsent.ts`)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The Worker still rewrites HTML bodies to replace `__GTM_ID__` or strip paired GTM comment blocks, but current `index.html` has neither placeholders nor those comment blocks, so that branch is a no-op on this SHA. Analytics bootstrap that can actually load `gtm.js` is client-side: denied Consent Mode defaults in `index.html`, then `syncGtm()` after CookieConsent, which injects `gtm.js` only when analytics is accepted and build-time `VITE_GTM_ID` is set (issues #1/#34). Worker `env.GTM_ID` / `env.VITE_GTM_ID` cannot enable GTM on this document. README documents Vite `.env`, not Worker secrets. That is unused Worker HTML logic, not a broken user-facing analytics path.

## Trace

1. Entry: `wrangler.jsonc` route `*qrati.com/connect/preact-example*`; `src/worker.ts` `fetch` strips prefix `/connect/preact-example` then `env.ASSETS.fetch`.
2. Inputs: request URL; optional Worker env `VITE_GTM_ID` / `GTM_ID`; HTML `content-type`.
3. Authz: none; public example.
4. Worker HTML branch: non-HTML returned unchanged. HTML: if `gtmId` is set and not `__GTM_ID__`, `replaceAll('__GTM_ID__', gtmId)`; else regex-remove `<!-- Google Tag Manager -->` / noscript pairs. Response rebuilt with original `status` / `headers`.
5. Static document: `index.html` first script sets `gtag('consent','default',{ analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' })`. No `__GTM_ID__`, no GTM comments.
6. Client path: `src/main.tsx` `initCookieConsent()` → `src/lib/cookieConsent.ts` `syncGtm`. `gtmId = import.meta.env.VITE_GTM_ID`. Consent update always; `gtm.js` inject only if `acceptedCategory('analytics')`, `gtmId` truthy, and `#gtm-script` absent. Queues `gtm.start` / `event: 'gtm.js'` before script src (issue #34).
7. Output: page HTML unchanged by Worker GTM rewrite; GTM container loads only after analytics accept + baked Vite ID.

Open PR at selection: [#80](https://github.com/qrati-labs/qrati-connect-preact-example/pull/80) light-theme cookie-consent off-toggle contrast (`src/index.css` `--cc-toggle-off-bg`, consent test, docs). Does not change Worker HTML rewrite, `index.html` GTM placeholders, or `syncGtm`.

## Falsification

- **Missing Worker placeholders mean GTM can never load:** rejected. Client `syncGtm` is the live inject path; tests/gtm-bootstrap.test.cjs asserts that path.
- **Cloudflare `GTM_ID` should inject the container:** not the documented contract. `.env.example` / README use `VITE_GTM_ID` at build time. Worker env without matching HTML tokens is unused, not a failed default.
- **Content-Length after rewrite:** rewrite does not change this document’s body; length mismatch is not evidenced here.
- **Denied defaults missing:** rejected; first `index.html` script still sets Consent Mode defaults before other tags (issue #1).
- **Empty `VITE_GTM_ID`:** `.env.example` is empty; `syncGtm` returns before inject. Example does not claim production analytics without an ID.
- Adjacent, out of scope: cookie-consent off-toggle (open #80 / #79), geo fail-closed, hash-router gallery, org-id fallback.

## Scope and non-goals

Worker HTML GTM substitution vs client consent-gated GTM on this Preact example only. Not live `qrati.com` HTTP, not GTM container contents, not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads of `src/worker.ts`, `index.html`, `src/lib/cookieConsent.ts`, `src/main.tsx`, `wrangler.jsonc`, `.env.example`, `README.md`, `tests/gtm-bootstrap.test.cjs`
- Isolated worktree from preflight remote SHA `30ca109`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`
- Primary docs: [Google Tag Manager web-page snippet / `gtm.js` dataLayer bootstrap](https://developers.google.com/tag-platform/tag-manager/web/install); [Consent Mode defaults](https://developers.google.com/tag-platform/security/guides/consent)

## Limitations

No live Worker invocation, no Cloudflare env inspection, no browser GTM network. Worker `Request` header reuse after a hypothetical future body rewrite remains unproven on the edge runtime.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

TIMING_TABLE_PLACEHOLDER
