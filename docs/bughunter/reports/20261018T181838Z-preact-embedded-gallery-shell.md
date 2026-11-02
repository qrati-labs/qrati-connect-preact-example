# BugHunter audit: Preact embedded gallery shell

- **Workflow boundary:** Public landing page render of the embedded Qrati Connect gallery, including host configuration, theme prop wiring, and the immediate shell layout around the widget.
- **Repository/base:** `qrati-labs/qrati-connect-preact-example`, `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`.
- **Branch:** `bughunter/20261018T181838Z-3e424092-preact-embed-layout`.
- **Disposition:** Report-only; no confirmed defect, issue, or regression test.

## Trace and evidence

- `index.html:18-20` supplies `#app` and loads `/src/main.tsx`.
- `src/main.tsx:1-8` imports the app/styles, starts cookie-consent initialization, and renders the app into `#app`.
- `src/app.tsx:18-27` initializes host theme, updates document theme state and persists explicit toggles; `src/app.tsx:61-65` renders the gallery with `organizationId={ORGANIZATION_ID}`, the current `theme`, and `router="hash"` inside the labeled widget shell.
- `src/config.ts:1-2` reads the organization ID from `VITE_ORGANIZATION_ID`, falling back to an empty string. The upstream widget's empty-ID behavior is outside this repository and is not inferred here.
- `src/index.css:217-226` defines the immediate embed boundary; responsive padding changes at 640px (`261-266`). The page applies a light/dark theme through CSS variables (`50-108`).
- The shell and page keep the embed as a single normal-flow section; no competing local navigation or form submission changes the widget configuration in this path.

## Finding assessment

The checked-in host wiring passes a stable configured ID (or the documented empty fallback) and current theme to the component, and the local layout provides a responsive wrapper. No user-impacting failure was established from repository evidence. The external component's behavior with an unset organization ID and runtime rendering under actual small-screen/browser conditions remain unverified; these are limitations, not confirmed defects.

## Verification

- No source or test changes; no tests authored.
- No tests, builds, lint, type checks, package installs, or live/external tests run, per BugHunter boundary.
- PR #15 read back: open, mergeable, base `main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`, head `cc3c9e8cb3422ca0c7775bf9da406f3d71ac56ff`; expected report and index files only; no linked issues. Cloudflare Workers Builds was in progress at readback.
- `git diff --check`: clean; worktree clean after push.

## Timing (measured)

- Start: `2026-10-18T18:18:39Z` / `2026-10-18 23:48:39 IST`.
- PR readback/end: `2026-10-18T18:20:28Z` / `2026-10-18 23:50:28 IST`.
- Total elapsed: 109 seconds (1m 49s).
- Phase breakdown: preflight 23 seconds (script-provided); post-preflight audit and delivery 86 seconds (calculated from the measured total minus preflight). The script did not expose finer post-preflight phase timestamps, so no finer breakdown is asserted.
