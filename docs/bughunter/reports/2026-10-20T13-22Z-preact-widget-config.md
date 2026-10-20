# BugHunter audit: Preact widget organization configuration

- Run: `20261020T132239Z-5ff7948ca735492e9628c3638796d58e`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`
- Workflow: build-time organization ID configuration through rendering the embedded `QratiConnect` component.
- Disposition: report-only; no confirmed defect.
- Issue: none; no defect established.

## Trace and evidence

`src/config.ts:1-2` reads `VITE_ORGANIZATION_ID` or substitutes the empty string. `src/app.tsx:64` passes that value directly to `QratiConnect` as `organizationId`. `.env.example:1` leaves the variable blank. `README.md:22-28` describes `.env` as optional and says sensible defaults are baked in, which does not identify an organization ID value. `wrangler.jsonc` does not define this build-time variable. `src/main.tsx` mounts the app from the `#app` element.

This establishes the local code/config path and a documentation ambiguity, but not a product defect: the repository does not establish whether the deployed build injects a valid organization ID, nor the SDK's observable behavior for an empty ID. Deployment configuration and package runtime behavior were not available in this bounded source review. Therefore no reachable production failure or violated product contract is confirmed. No issue or source/test changes are warranted on this evidence.

## Open-PR overlap and scope

Queried the full open PR list (18 PRs). The inspected diffs/files concern reports/tracker, icons, theme persistence/validation, consent, worker/static assets, footer/navigation, FAQ, crawler metadata, and embedded gallery shell. None changes `src/config.ts`, `.env.example`, `wrangler.jsonc`, or organization ID injection. The selected configuration workflow is not covered by those changes. No second workflow was audited.

## Verification and limitations

- Fresh isolated worktree from the preflight remote SHA; status was clean at setup.
- `git diff --check` is permitted; no tests were authored and no tests/build/lint/type-check/coverage/install/package-manager commands were run.
- No deployment configuration, live site, or SDK internals were inspected; empty-ID runtime behavior and deployed build-time values remain unknown.
- This is a narrow source-level audit, not a repository-wide review.

## Timing

Timing table pending completion of this run's audit ledger.
