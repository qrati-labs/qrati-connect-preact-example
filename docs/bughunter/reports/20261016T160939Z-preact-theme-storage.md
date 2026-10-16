# BugHunter report: Preact theme storage failures

- **Run:** `20261016T160939Z-432aa5ff20c44a438738b178b9c524b5`
- **Repository:** `qrati-labs/qrati-connect-preact-example`
- **Workflow boundary:** Preact host theme initialization and theme toggle persistence (`src/app.tsx` → theme storage helpers). Open PR #2 changes `index.html`, consent test/docs only; no path or behavior overlap.
- **Base:** `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`
- **Finding:** **[medium] Theme storage exceptions can prevent demo initialization or escape from the theme toggle.** `initTheme` reads `localStorage` directly and `toggleTheme` writes directly. In a browser context where storage getter/read/write raises `SecurityError`, initialization cannot resolve its theme, or a click throws despite theme changes being usable in memory.
- **Evidence / falsification:** Reachable direct browser storage operations in `src/app.tsx`; theme and widget state are independently applied to document attributes and Preact state, so persistence is not required for live theme operation. PR #2 changed only `index.html`, docs and consent coverage. Issue search returned no match before filing.
- **Severity/confidence:** Medium / high. The affected workflow is the demo's visible theme control; unavailable storage is a browser privacy condition, not merely malformed stored data.
- **Root cause:** Unprotected access to browser persistence and an unchecked cast that also admits invalid saved strings.
- **Fix:** Added guarded read/write helpers; read accepts only `light`/`dark` and otherwise uses system preference, while failed writes do not block in-memory theme application.
- **Issue:** https://github.com/qrati-labs/qrati-connect-preact-example/issues/3
- **Tests authored:** `tests/theme-storage.test.cjs` covers throwing storage getter/read, invalid value fallback, throwing write, and valid stored theme. Intended command: `node --test tests/theme-storage.test.cjs` (**NOT RUN BY BUGHUNTER**).
- **Verification:** `git diff --check` completed with no output. No tests, builds, lint, type checks, installs, or package managers run, per execution boundary.
- **Limitations:** CI not yet observed for this PR. CodeGraph had no index; source was traced directly. No independent reviewer available in this run.
- **Timing (UTC):** Start `2026-10-16T16:09:39Z` (injected run start); completion timestamp will be recorded by GitHub after delivery. Preflight `00:00:24` supplied by the run script. Later phase boundaries were not instrumented, so phase durations beyond that preflight are **not measured**; no durations are estimated or backfilled. Start IST: `2026-10-16 21:39:39 IST`.
- **PR/check state:** To be populated after PR creation and read-back.
