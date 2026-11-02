# BugHunter audit: Preact cookie-consent initialization

- Run: `20261021T125238Z-e4a7c51115154fbea2c53d4c8e77c930`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`
- Scope: geo-based consent requirement lookup, consent initialization and GTM synchronization (`src/lib/cookieConsent.ts`), plus direct bootstrap (`src/main.tsx`).
- Disposition: report-only; no confirmed defect.
- Issue: none; no confirmed defect established.

## Workflow trace and assessment

`src/main.tsx` calls `initCookieConsent()` before rendering the app. The initializer memoizes a promise, runs `checkConsentRequired()`, then configures `vanilla-cookieconsent` in opt-in mode with an automatic prompt when consent is required, otherwise opt-out mode. The lookup first uses session storage; on cache miss it fetches the geo endpoint with `cache: 'no-store'`, stores the returned `required` value, and returns `true` on caught errors. Consent callbacks invoke `syncGtm()`, which derives all four Google consent signals from the analytics category and loads GTM only when analytics is accepted and a configured ID exists.

The fallback-to-required behavior on lookup/storage/JSON errors is fail-closed. The existing `initPromise` prevents duplicate initialization from repeated calls in this page lifetime. GTM insertion is guarded by consent, configured ID, and an existing script element. No concrete reachable path was established that violates the intended consent invariant. Possible provider/runtime behaviors (including malformed successful geo payloads and CookieConsent library behavior) were not independently established from primary documentation/runtime execution, so they are limitations rather than findings.

No issue or source/test changes are warranted on this evidence. No tests were authored.

## Open PR overlap and scope

Queried all 19 open PRs in the repository and inspected relevant/current diffs. Consent-related PR #7 changes geo-response validation; PR #11 concerns earlier consent initialization and its report; PR #17 validates theme preference; the remaining inspected recent changes include unrelated docs, icons and theme storage. The audited current lookup path and consent/GTM synchronization are not modified in the open PR diffs reviewed. The selected consent workflow is therefore not excluded by overlap. No second workflow was audited.

## Verification and limitations

- Fresh isolated worktree from the fetched remote base; status clean at setup.
- `git diff --check` is permitted but no source edits were made; no tests, builds, lint, type-check, coverage, installs, or package-manager commands were run.
- No browser session, deployed configuration, live service, or external mutation was exercised.
- CodeGraph reported the checkout unindexed; focused file/source reads were used instead.
- Bounded source audit only; library-specific runtime semantics and deployed GTM configuration remain unverified.

## Timing (measured wall-clock)

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-10-21T12:52:39Z | 2026-10-21T12:53:06Z | 00:00:27 (0.5 min) |
| `audit` | 2026-10-21T12:53:16Z | 2026-10-21T12:53:42Z | 00:00:27 (0.5 min) |
| **Total run (preflight start to finish)** | 2026-10-21T12:52:39Z | 2026-10-21T12:53:42Z | **00:01:04 (1.1 min)** |
| Unclassified interval between marked phases | — | — | 00:00:10 (0.2 min) |

Copied from the timer ledger; the measured interval ends at the audit/finish snapshot and does not include artifact authoring or PR delivery.
