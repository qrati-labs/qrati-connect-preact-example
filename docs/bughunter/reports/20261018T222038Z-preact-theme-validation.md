# Preact theme preference validation audit

- **Run:** `20261018T222038Z-a0471301cd614075abaa27a3476f8f94`
- **Scope:** Public Preact landing-page theme initialization from browser storage through host DOM theme state and widget theme prop.
- **Base:** `origin/main` `002faea7e6dd8505cdf5b570229c4e3407f0fabf`.
- **Finding:** [P2] Validate persisted theme values during initialization. **Evidence:** `src/app.tsx:9-18`; page load with non-empty unsupported `qc-theme` such as `system`. **Failure:** the previous type assertion did not validate runtime storage, so the unsupported value could reach `data-theme`, the initial state, and the embedded widget. **Impact:** invalid host styling and potentially inconsistent first toggle. Confidence: confirmed by source trace; no browser reproduction run.
- **Root cause:** trusting a TypeScript assertion at an untrusted persistence boundary.
- **Issue:** [#16](https://github.com/qrati-labs/qrati-connect-preact-example/issues/16), created and read back. The initial source edit preceded that readback; it was not pushed before the issue sequence.
- **Fix:** `src/app.tsx` now accepts only `light`/`dark`; missing or unsupported values fall back to system preference.
- **Tests:** No automated regression test authored. Repository has no test script or test framework in `package.json`; adding one was outside this narrow patch. Tests/build/lint/type-check/install are **NOT RUN BY BUGHUNTER**. Intended test to add in a future test-infrastructure change: verify persisted valid values and unsupported value under light/dark system preferences. No exact runnable test command exists in the current repo configuration.
- **Verification:** `git diff --check` run; source review confirms all initializer paths return only the two supported literals. No runtime/browser verification.
- **Limitations:** CodeGraph unavailable (repository unindexed); focused reads/searches used. PR overlap check showed existing Preact PRs #15 and #14 affect docs only; adjacent earlier theme-storage PR #4 does not modify this theme-value validation behavior.
- **Timing (UTC):** preflight start `2026-10-18T22:20:39Z` (23s supplied); post-preflight phase `22:21:02Z–22:22:16Z` (74s); total `97s` (1m37s), `22:20:39Z–22:22:16Z`. **IST:** `03:50:39–03:52:16` on 2026-10-19; phases 23s and 74s.
- **PR state:** recorded after PR readback.
