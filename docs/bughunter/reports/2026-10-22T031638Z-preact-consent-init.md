# Preact cookie-consent initialization audit

- Scope: Preact example consent initialization, fetched base `main` at `002faea`.
- Workflow: `src/main.tsx` calls `initCookieConsent()`; `src/lib/cookieConsent.ts` resolves geo mode, initializes CookieConsent, and synchronizes GTM consent.
- Finding: No confirmed defect in the bounded workflow.
- Evidence: `src/main.tsx:6-8` starts consent setup before rendering the app. `src/lib/cookieConsent.ts:32-46` caches geo result in session storage and fails closed (`required=true`) on fetch/parse/storage exceptions; lines 53-68 initialize once and synchronize consent on initial and subsequent callbacks. `index.html:16` contains the Iconify loader, but it is outside the consent/GTM path and this audit makes no claim about its privacy behavior.
- Falsification: A delayed geo lookup means consent initialization completes asynchronously, but the only GTM insertion path is `syncGtm` after CookieConsent initialization and only when analytics is accepted (`:24-29, 54-68`). The preexisting consent-default PR #2 is merged/base behavior and denied defaults precede tags; current open PR #25 touches documentation only and does not overlap implementation. No reproducible violated invariant was established.
- Disposition: Report-only; no issue or code/test changes.
- Limitations: No runtime/browser validation performed per BugHunter execution boundary; no test commands run.
- Base: `002faea`.
- Open PRs checked for overlap: #25, documentation-only.
- Review time (measured wall-clock):

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-10-22T03:16:39Z | 2026-10-22T03:17:04Z | 00:00:26 (0.4 min) |
| `audit` | 2026-10-22T03:17:13Z | 2026-10-22T03:17:51Z | 00:00:37 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-10-22T03:16:39Z | 2026-10-22T03:17:51Z | **00:01:12 (1.2 min)** |
| Unclassified interval between marked phases | — | — | 00:00:09 (0.1 min) |

Timing-table insertion occurs after the measurement snapshot.
