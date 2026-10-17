# Preact application bootstrap and consent initialization audit

- Run: `20261017T085639Z-be740a759bf94a8f83de1dd375d137b3`
- Scope: Browser document bootstrap from `index.html` through `src/main.tsx` and cookie-consent initialization; excluded widget internals, already-covered theme/config/worker/consent flows.
- Base: `origin/main` / `002faea7e6dd8505cdf5b570229c4e3407f0fabf`.
- Existing PR overlap: #2 touches `index.html` and consent-default test; #4 touches `src/app.tsx`/theme; #5 touches config; #7 consent geo; #8 worker. Those overlap portions of bootstrap/consent, but none modifies `src/main.tsx`. Audit was bounded to the entrypoint contract and startup order.
- Trace/evidence: `index.html` defines `#app` and loads `/src/main.tsx` as a module. `src/main.tsx` imports styles, `App`, and `initCookieConsent`, invokes consent initialization, then renders `App` into that element. The non-null assertion on `getElementById('app')` is supported by the static document element; module execution is deferred until document parsing completes. The consent call is intentionally fire-and-forget, while its implementation/geo behavior is covered by PR #7 and PR #2; no independent bootstrap failure established from this entrypoint.
- Finding: No confirmed defect in the bounded application bootstrap workflow. No issue or source/test change warranted.
- Tests authored: none. Tests/build/lint/type-check not run under BugHunter boundary. `git diff --check` is the only permitted patch verification.
- Limitations: no browser/E2E execution or production request. Assessment limited to static HTML/module startup and entrypoint; does not establish runtime behavior of the embedded third-party component.
- Timing (UTC): preflight start `2026-10-17T08:56:39Z`; audit started `2026-10-17T08:57:09Z`; completion timestamp and elapsed phases recorded in final delivery using observed clock. IST = UTC+05:30.
