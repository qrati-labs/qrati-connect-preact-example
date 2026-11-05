# BugHunter audit: Preact live gallery organizationId fallback

- Run: `20261105T152038Z-c9e8cdf4c0ec46fea1e9eabe76190a3e`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `997959884d51a900222dfe9262b55fc9509b43b0` (`9979598 docs(bughunter): audit Preact Google Fonts vs consent gate (#37)`)
- Workflow: documented local/run-path organization ID into the embedded `QratiConnect` live gallery
- Disposition: P2 confirmed; narrow host fallback to the public demo org
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/38
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

`[P2] Empty organizationId disables the live gallery on the documented run path` — **Evidence:** `src/config.ts` used `import.meta.env.VITE_ORGANIZATION_ID || ''`; `.env.example` left the variable blank; `README.md` marks `.env` optional with “sensible defaults”; `src/app.tsx` always mounts `<QratiConnect organizationId={ORGANIZATION_ID} />` with no `onError`. SDK (`qrati-connect-ts`) types `organizationId` as required, `QratiConnect` emits `organizationId is required` when falsy, and `SessionProvider` sets `enabled: !!organizationId`. **Failure:** clone → `pnpm dev` never initializes session; demo gallery stays empty. **Fix:** fall back to public demo org `69ad9c7876d8bf6f864b3a65` (same id as Angular `DEFAULT_EXAMPLE_ORG_ID`, Connect `EXAMPLE_ORG_ID`, and `qrati-web` marketing embed). **Test:** `tests/organization-id-fallback.test.cjs` (`node --test tests/organization-id-fallback.test.cjs`, **NOT RUN BY BUGHUNTER**).

Prior org-config audits (2026-10-16, 2026-10-20) were report-only because the SDK contract was not inspected. This run used the same published widget source the theme-toggle audit used.

## Trace

1. Entry: `index.html` → `src/main.tsx` → `render(<App />)`.
2. Inputs: Vite `VITE_ORGANIZATION_ID` (unset on the documented optional-env path).
3. Authz: none; public example.
4. Host config: `ORGANIZATION_ID` now `env || DEFAULT_EXAMPLE_ORG_ID`.
5. Embed: `src/app.tsx` passes `organizationId={ORGANIZATION_ID}` with `theme` and `router="hash"` (hash/theme out of scope).
6. SDK: required id; session query disabled on empty string.
7. Output: demo org id reaches the widget when env is missing/empty; explicit env still overrides.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Intentional empty id so integrators must supply their own:** incompatible with README “sensible defaults are baked in” and with sibling Angular/Ember/Marko/Astro demo-org values.
- **Production Cloudflare build injects the env:** possible, not evidenced in `wrangler.jsonc` or this repo. The git-tracked run path still violates the SDK required-id contract.
- **SDK silently substitutes a demo org:** false. `enabled: !!organizationId` skips init; `useEffect` throws when falsy.
- **Host `onError` already surfaces the failure:** false; no `onError` and no `qrati-error` listener.

## Scope and non-goals

Host organization-id fallback only. Not consent, fonts, worker GTM, hash router, or SDK session implementation.

## Tests and verification

- Authored: `tests/organization-id-fallback.test.cjs`
- Command: `node --test tests/organization-id-fallback.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: passed on the source patch
- CodeGraph: unindexed for this worktree; focused reads used

## Limitations

No live `qrati.com` fetch, no wrangler build-env inspection, no execution of the SDK in this worktree.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-05T15:20:38Z | 2026-11-05T15:21:01Z | 00:00:23 (0.4 min) |
| `audit` | 2026-11-05T15:21:21Z | 2026-11-05T15:26:06Z | 00:04:45 (4.8 min) |
| `delivery` | 2026-11-05T15:26:06Z | 2026-11-05T15:26:50Z | 00:00:44 (0.7 min) |
| **Total run (preflight start to finish)** | 2026-11-05T15:20:38Z | 2026-11-05T15:26:50Z | **00:06:12 (6.2 min)** |
| Unclassified interval between marked phases | — | — | 00:00:19 (0.3 min) |

- Preflight: 20:50:38–20:51:01 IST
- Audit: 20:51:21–20:56:06 IST
- Delivery: 20:56:06–20:56:50 IST
- Total: 20:50:38–20:56:50 IST

Timing-table insertion itself occurs after this measurement snapshot.
