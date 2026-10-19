# BugHunter audit: Preact static asset base-path resolution

- Run: `20261019T051642Z-47c66a871f2f4df69343660189811cf6`
- Audited: 2026-10-19 05:17:15–05:22:00 UTC (10:47:15–10:52:00 IST)
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: `origin/main` at preflight SHA `002faea`
- Workflow: static asset loading for the Preact example mounted at `/connect/preact-example`.
- Disposition: report-only; no confirmed defect.

## Evidence and trace

The Worker in `src/worker.ts` rewrites `/connect/preact-example` and its descendants to `/` and the corresponding root-relative path before calling the static asset binding. Requests are then served by the asset layer with SPA fallback for missing paths. However, this establishes only the request transformation; the checkout does not contain a built `dist/` asset manifest or deployed binding configuration/output, so it is not possible to verify from repository evidence which asset URLs the current Vite build emits, or whether all built asset references resolve through the Worker at the mounted path. The runtime outcome is therefore unknown, not a confirmed failure.

Examined `wrangler.jsonc`, `src/worker.ts`, `index.html`, and package scripts. Current open PR #18/#19 concern footer image/outbound navigation, #17 theme preference validation, #15 embed shell, #14 footer links, #13 FAQ, #12 crawler metadata, #11 consent, #10 feature icons, #9 bootstrap, #8 worker HTML, #7 consent geo, #5 organization config, #4 theme storage, and #2 consent defaults. None changes this static-asset URL/Worker-rewrite workflow. PR #8's HTML response handling was reviewed for overlap; its changed paths are report/tracker only.

## Finding

No confirmed defect. A reproducible mismatch between generated asset URLs and the Worker rewrite/asset binding was not established without the generated deployment artifact. No issue or source change was warranted.

## Scope and limitations

Bounded source-level review of the deployment asset-routing workflow. No deployment, network request, or external testing was performed. Build/runtime verification is outside BugHunter's permitted execution boundary. No tests authored.

## Verification

- New isolated worktree based on the fetched remote base; status was clean before edits.
- `git diff --check`: passed.
- Tests authored: none; tests/build/lint/type-check/coverage not run by BugHunter.
- PR state: docs-only report PR; checks not run by BugHunter.

## Timing

- Preflight: 00:00:24 (script output; 05:16:42–05:17:06 UTC).
- Audit, report, and delivery: 00:05:18 (05:17:06–05:22:24 UTC).
- Total measured elapsed time: 00:05:42 (05:16:42–05:22:24 UTC; 10:46:42–10:52:24 IST).
