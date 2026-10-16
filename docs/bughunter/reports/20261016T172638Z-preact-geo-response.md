# BugHunter — Preact consent geo response validation

- Run ID: `20261016T172638Z-11054822216c48218be16368f9ea44de`
- Scope: cookie-consent geo decision only; repository `qrati-labs/qrati-connect-preact-example`.
- Base: `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`.
- Boundary: `src/lib/cookieConsent.ts:32-46` determines whether the app initializes opt-in or opt-out cookie consent; `src/main.tsx:6` invokes the flow during startup.
- Open-PR check: PR #5 changes only BugHunter docs and does not overlap this workflow; PR #4 is browser theme-storage behavior, PR #2 GTM denied defaults. Their changed paths do not modify the geo-response decision. PR #5 checks observed once: GitGuardian and Workers Builds passed. No unrelated PR checks were inspected.

## Finding

**[P2] Invalid geo responses can disable required cookie consent.** A reachable fetch to the consent geo endpoint may return a non-OK response with valid JSON or a successful body lacking a boolean `required`. The previous code cached the field without checking HTTP status or schema. `{}` yields `undefined`, which the downstream `required ? 'opt-in' : 'opt-out'` path interprets as opt-out; consent is not auto-shown. This violates the fail-closed behavior already intended by the catch path, and can allow optional tracking to load before consent where consent is required. Confidence: high; trigger and interpretation are directly evidenced in the source.

- Root cause: unchecked `response.ok` and unchecked JSON payload schema in `checkConsentRequired`.
- Fix: reject non-OK responses and non-boolean `required`, returning `true` without caching; persist only validated booleans.
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/6 (created and read back OPEN).

## Regression tests

Added `tests/cookie-consent-geo.test.ts`: tests a non-OK JSON response and an OK response with non-boolean `required`; each asserts opt-in/auto-show and no invalid session cache.

Intended command: `pnpm exec vitest run tests/cookie-consent-geo.test.ts` — **NOT RUN BY BUGHUNTER**. Repository currently has no test script or Vitest dependency declared; command is specified for CI/developer execution if test infrastructure is added. No tests, build, lint, typecheck, installs, or package managers were run.

## Review / limitations

- `git diff --check` passed.
- Reviewed the final narrow source diff against the issue and base; no unrelated files changed apart from the regression test and this report/index.
- No production changes, deployment, or merge performed.
- CI state for this new PR is not yet observed; no PR was opened yet at report drafting.

## Timing (measured)

- Start: 2026-10-16 17:26:39 UTC / 22:56:39 IST
- End: 2026-10-16 17:28:34 UTC / 22:58:34 IST
- Total elapsed: 115 seconds (1m55s). Phase-level timers were not captured; no phase durations are claimed.
