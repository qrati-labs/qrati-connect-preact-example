# BugHunter audit: Preact widget organization configuration

- Run: `20261020T132239Z-5ff7948ca735492e9628c3638796d58e`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`
- Workflow: build-time organization ID configuration through rendering the embedded `QratiConnect` component.
- Disposition: report-only; no confirmed defect.
- Issue: none; no defect established.
- PR: https://github.com/qrati-labs/qrati-connect-preact-example/pull/24

## Trace and evidence

`src/config.ts:1-2` reads `VITE_ORGANIZATION_ID` or substitutes the empty string. `src/app.tsx:64` passes that value directly to `QratiConnect` as `organizationId`. `.env.example:1` leaves the variable blank. `README.md:22-28` describes `.env` as optional and says sensible defaults are baked in, which does not identify an organization ID value. `wrangler.jsonc` does not define this build-time variable. `src/main.tsx` mounts the app from the `#app` element.

This establishes the local code/config path and a documentation ambiguity, but not a product defect: the repository does not establish whether the deployed build injects a valid organization ID, nor the SDK's observable behavior for an empty ID. Deployment configuration and package runtime behavior were not available in this bounded source review. Therefore no reachable production failure or violated product contract is confirmed. No issue or source/test changes are warranted on this evidence.

## Open-PR overlap and scope

Queried the full open PR list (18 PRs). The inspected diffs/files concern reports/tracker, icons, theme persistence/validation, consent, worker/static assets, footer/navigation, FAQ, crawler metadata, and embedded gallery shell. None changes `src/config.ts`, `.env.example`, `wrangler.jsonc`, or organization ID injection. The selected configuration workflow is not covered by those changes. No second workflow was audited.

## Verification and limitations

- Fresh isolated worktree from the preflight remote SHA; status was clean at setup.
- `git diff --check` passed.
- No tests were authored. No tests, builds, lint, type-check, coverage, installs, or package-manager commands were run by BugHunter.
- No deployment configuration, live site, or SDK internals were inspected; empty-ID runtime behavior and deployed build-time values remain unknown.
- This is a narrow source-level audit, not a repository-wide review.

## Timing (measured wall-clock)

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-10-20T13:22:39Z | 2026-10-20T13:23:07Z | 00:00:28 (0.5 min) |
| `audit` | 2026-10-20T13:23:16Z | 2026-10-20T13:24:43Z | 00:01:26 (1.4 min) |
| **Total run (preflight start to finish)** | 2026-10-20T13:22:39Z | 2026-10-20T13:24:43Z | **00:02:04 (2.1 min)** |
| Unclassified interval between marked phases | — | — | 00:00:10 (0.2 min) |

The timing table is copied from the timer ledger; timing-table insertion itself occurs after the measurement snapshot.
