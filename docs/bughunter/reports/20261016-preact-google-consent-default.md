# Preact cookie consent initialization audit

## Run metadata
- Run ID: `20261016T101838Z-0a2a02f5de8d47c5add9223e371a9104`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base branch / reviewed SHA: `origin/main` / `002faea7e6dd8505cdf5b570229c4e3407f0fabf`
- Workflow: page load → geo-gated cookie banner → Google consent synchronization and tag loading.
- Selection: clean, freshly fetched dedicated example, no overlapping open PR; rotated from prior audit workflow but same consent category due no clean unaffected mature alternative.
- Scope: static HTML consent default, Preact initialization (`src/main.tsx`, `src/lib/cookieConsent.ts`), worker HTML behavior, and relevant test inventory. No neighboring repositories or production configuration reviewed.
- Timing: measured elapsed wall time from preflight start `2026-10-16T10:18:38Z` to finish `2026-10-16T10:22:50Z`, total `00:04:11`. Phase table (UTC): preflight 10:18:38–10:19:45, 00:01:07; graph/scope 10:20:08–10:20:47, 00:00:39; source review 10:20:47–10:22:17, 00:01:29; research 10:21:21–10:21:50, 00:00:30; test authoring 10:21:50–10:22:03, 00:00:12; patch review 10:22:03–10:22:10, 00:00:07; report/PR 10:22:10–10:22:50, 00:00:40. Timer reports unclassified interval 00:00:00; note that source review and research were measured concurrently, so phase durations overlap and must not be summed. Measurement boundary: timer finish at `2026-10-16T10:22:50Z`; it captured report preparation, but preceded commit/push/PR creation and remote verification. Those actions are outside the measured interval; no duration is inferred for them.

## Workflow trace
`src/main.tsx` invokes `initCookieConsent()` before rendering the Preact app. `src/lib/cookieConsent.ts` awaits a geo endpoint (same-origin on qrati.com, otherwise qrati.com), caches the required flag in session storage, and fails closed to requiring consent on exceptions. It then configures `vanilla-cookieconsent` with opt-in/auto-show in required regions and opt-out elsewhere. Callbacks synchronize four Google consent categories and inject the GTM script only after analytics acceptance. `src/worker.ts` only rewrites example asset paths and substitutes/removes GTM snippets in HTML; it does not establish consent defaults. `index.html` previously loaded Iconify in the head before the deferred module initialized consent.

## Findings
- **High / high confidence — confirmed defect.** `src/lib/cookieConsent.ts:13-23,32-67` emitted only `consent update`, after asynchronous geo lookup and CMP setup; `index.html:16` loaded an external script before that flow completed. No initial denied default existed. Google documents setting explicit defaults before tags can act on consent and then updating after user interaction.[1] A tag could therefore run before consent state was initialized, undermining the expected default-denied behavior.
- **Disposition:** fixed in this PR by synchronously queuing denied defaults for analytics and all three advertising categories in the document head, before external scripts. Existing CMP callbacks remain responsible for updates. Added a focused static regression test checking order and all four denied values.
- **Trigger / impact:** every page load before geo resolution and consent initialization, especially when third-party tags execute early.

## Test and coverage inventory
- Unit: no existing test suite discovered in the repository inventory. Added `tests/consent-default.test.cjs`; intended command: `node --test tests/consent-default.test.cjs` — **NOT RUN BY BUG HUNTER** (cron policy prohibits tests/package commands).
- Integration: none identified; not run.
- E2E: none identified; not run.
- Coverage: not measured. `git diff --check` permitted hygiene check: run, no output/errors.

## Performance and maintainability
No runtime baseline measured. The change is a short synchronous inline initialization and adds no requests or timers. No other change proposed.

## External research
- Google for Developers, “Set up consent mode on websites,” https://developers.google.com/tag-platform/security/guides/consent (accessed 2026-10-16). Supports setting defaults before tags and updating consent after user interaction.[1]

## Verification and delivery
- CodeGraph initialized for this isolated worktree; indexed 8 files / 39 nodes / 52 edges. MCP exploration then traced `initCookieConsent` and `syncGtm`. Focused source inspection verified callers and worker behavior.
- Duplicate issue search returned none. Created and read back issue #1: https://github.com/qrati-labs/qrati-connect-preact-example/issues/1
- Changed files: `index.html`, `tests/consent-default.test.cjs`, this report, and `docs/bughunter/INDEX.md`.
- CI/dev test command: `node --test tests/consent-default.test.cjs` (not run by BugHunter).
- PR: [#2](https://github.com/qrati-labs/qrati-connect-preact-example/pull/2), head `b94cb88cf7a8d3bbdc84be5f130e9aae4f09c77c`; state OPEN, mergeable, body includes `Fixes #1`, and `closingIssuesReferences` includes issue #1. Current checks read once: GitGuardian Security Checks pending; Workers Builds pending.
- No merge or deploy performed.

## Sources
[1] https://developers.google.com/tag-platform/security/guides/consent
