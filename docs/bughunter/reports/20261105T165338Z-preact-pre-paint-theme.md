# BugHunter audit: Preact pre-paint theme bootstrap

- Run: `20261105T165338Z-5137ebac5c7d4ed7a5844944811a1aaf`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `f9efe11b0d75f8371914d5e4822de968b4ea21d8`
- Workflow: document-level theme application before first CSS paint (`index.html` head → `qc-theme` / `prefers-color-scheme` → `data-theme` / `html.dark`), then `initTheme` in `src/app.tsx`
- Disposition: P3 confirmed; narrow HTML bootstrap + regression test
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/43
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented.

## Finding

**[P3] Host theme is not applied before first CSS paint** — **Evidence:** `index.html` had no blocking theme script; `src/index.css` tokens apply only under `[data-theme='light'|'dark']`; `initTheme()` in `src/app.tsx` is the first writer and runs after the Vite module graph. Vite extracts imported CSS into a `<link rel="stylesheet">` in `<head>` (vitejs/vite#3246) while `/src/main.tsx` stays at the end of `<body>`. **Failure:** a visitor with `localStorage['qc-theme']='dark'` or `prefers-color-scheme: dark` can get an unthemed first styled paint, then a jump when Preact mounts. Persistence (`src/theme.js`) is therefore not honored for the first frame. **Fix:** blocking head script using the same validation/storage-guard contract as `readSavedTheme` / `getInitialTheme` / `initTheme`. **Test:** `tests/pre-paint-theme.test.cjs` — `node --test tests/pre-paint-theme.test.cjs` (**NOT RUN BY BUGHUNTER**).

Sibling Connect hosts (React, Vue, Solid, Qwik, Svelte, Next, Angular) already ship this bootstrap. Lit/Vanilla/Ember/Marko also omit it; that does not make the flash intentional on this Vite Preact host, whose CSS is attribute-gated.

## Trace

1. Entry: `index.html` `<head>` (consent-default script, then this bootstrap) → body `#app` + module `/src/main.tsx`.
2. Inputs: `localStorage['qc-theme']` (only `'light'|'dark'`), else `matchMedia('(prefers-color-scheme: dark)')`.
3. Authz/validation: invalid stored values ignored; storage and `matchMedia` errors swallowed (issue #3 contract).
4. Persistence: `persistTheme` still writes `qc-theme` from the toggle; this script only reads.
5. Output: `document.documentElement` `data-theme` and class `dark` before extracted CSS can paint.
6. After mount: `initTheme` re-applies the same values and drives `<QratiConnect theme={theme} />` (out of scope beyond not conflicting).

## Falsification

- Theme-toggle audit (20261105T124438Z) treated empty `#app` before modules as not a token failure for the click path. This workflow is the production CSS-in-head path, not the toggle handler.
- Dev-mode CSS-in-JS can hide the flash; the deployed Worker serves a Vite production build.
- An inline script without validation would reintroduce issue #16; the bootstrap only accepts `'light'|'dark'`.
- Cookie consent / GTM / org-id / hash-router are adjacent and unchanged.

## Verification

- Isolated worktree from preflight remote SHA `f9efe11`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`.
- CodeGraph unindexed for this worktree; focused file reads/searches used.
- Open PRs at preflight: none (`OPEN_PR_COUNT=0`); no overlap skip.
- Tests/build/lint/type-check/install: **NOT RUN BY BUGHUNTER**.
- `git diff --check` run on the patch (clean).
- Issue #43 created and read back OPEN; no mapped owner to assign.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

TIMING_TABLE_PLACEHOLDER
