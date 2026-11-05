# BugHunter audit: Preact hash-router gallery embed

- Run: `20261105T122238Z-65b336b6d13f4c07bc3551199f1efa8d`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `e0fed6ec32beb8992d57671960ea2ac91b3d61cc`
- Workflow: host wiring of `QratiConnect` `router="hash"` from the Preact landing page through the SDK router mode used for in-widget navigation and shareable deep links.
- Disposition: report-only; no confirmed defect.
- Issue: none; no defect established.
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented.

## Trace and evidence

Entry: `index.html` mounts `#app` and loads `src/main.tsx`. `src/main.tsx` starts cookie-consent initialization (out of scope) and `render(<App />, ...)`.

Host embed: `src/app.tsx` renders

`<QratiConnect organizationId={ORGANIZATION_ID} theme={theme} router="hash" />`

inside the labeled widget shell. `ORGANIZATION_ID` comes from `src/config.ts` (`VITE_ORGANIZATION_ID` or `''`). Theme and consent are adjacent host concerns; they do not change the router prop.

SDK contract (`qrati-connect-ts`, used as the published widget contract):

- `QratiConnectProps.router` is `'memory' | 'hash'`; `defaultProps.router` is `'memory'`.
- `QratiConnect` passes `router` into `AppRoutes`.
- `AppRoutes` maps `router.toLowerCase() === 'hash'` to `<Router mode="hash">`; any other value is memory mode.
- Hash-mode tests in the SDK assert that `#/event/hello` is the initial location and that navigation writes `window.location.hash`.

Host page: no other `location.hash` consumers, fragment IDs, or in-page hash links. Worker (`src/worker.ts`) rewrites only the `/connect/preact-example` pathname prefix before `ASSETS.fetch`; URL fragments are not sent to the worker. `wrangler.jsonc` `not_found_handling: single-page-application` applies to path 404s, not hash changes.

Compared with SDK default (`memory`), the explicit `hash` prop is the correct public-demo choice so gallery routes can be copied from the address bar. Empty `organizationId` still mounts the widget (`enabled: !!organizationId` skips session init in `SessionProvider`); that configuration path was previously audited and is not a hash-router failure.

No reachable host invariant was violated: the prop is the supported literal, it is not overwritten, and server rewrite does not strip hashes.

## Falsification

- Unrecognized router values would silently fall back to memory in the SDK; this host passes `"hash"` exactly.
- Hash/share UX inside the widget is SDK-owned; this example does not reimplement history.
- Production session/org injection is outside this workflow.
- First-paint theme tokens and Google Fonts loading were observed while mapping the page; they are not hash-router failures and were not treated as findings here.

## Verification

- Isolated worktree from preflight remote SHA `e0fed6ec32beb8992d57671960ea2ac91b3d61cc`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`.
- CodeGraph unindexed for this worktree; focused file reads/searches used.
- No source or test changes. No tests authored.
- Tests/build/lint/type-check/install: **NOT RUN BY BUGHUNTER**.
- `git diff --check` run on the docs-only patch.
- Open PRs at preflight: none (`OPEN_PR_COUNT=0`); no overlap skip.

## Timing (measured wall-clock)

Timing table inserted from the ledger after `finish`.
