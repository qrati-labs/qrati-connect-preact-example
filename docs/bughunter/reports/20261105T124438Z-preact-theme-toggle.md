# BugHunter audit: Preact host-controlled theme toggle

- Run: `20261105T124438Z-38bc712283d64d128ab802e896079908`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `c7f0d01310addb2977ff90007da4422a61d648d4`
- Workflow: host theme toggle from the landing-page button through DOM tokens, persistence, and the `QratiConnect` `theme` prop
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented.

## Trace and evidence

Entry: `index.html` mounts `#app` and loads `src/main.tsx`. `src/main.tsx` starts cookie-consent initialization (out of scope) and `render(<App />, ...)`.

Host theme path (`src/app.tsx`):

1. `useState(initTheme)` lazily calls `initTheme` once.
2. `initTheme` reads `readSavedTheme()` (`src/theme.js`, key `qc-theme`, only `'light'|'dark'`), then `window.matchMedia('(prefers-color-scheme: dark)').matches`, then `getInitialTheme`.
3. It writes `document.documentElement` `data-theme` and toggles class `dark`.
4. The same value is the React/Preact state passed as `<QratiConnect … theme={theme} />`.
5. Click handler `toggleTheme` flips `light`/`dark`, updates the same DOM attributes, `setTheme`, and `persistTheme`.

CSS (`src/index.css`) keys page tokens on `[data-theme='light'|'dark']`. Cookie-consent tokens also accept `html.dark`. The toggle is a non-submit `button` with `aria-label="Toggle theme"` and `:focus-visible` outline.

Persistence already validates at the storage boundary (`readSavedTheme` / `persistTheme` try/catch). Prior issues #3 and #16 covered storage failure and invalid saved values; this run did not re-open those paths.

SDK contract (`qrati-connect-ts`, published as `@qratilabs/qrati-connect`): the React wrapper sets a `theme` attribute on `<qrati-connect>`. The custom element observes `theme`, re-renders without remounting on theme-only changes, and reads `this.getAttribute('theme')` (`'light'|'dark'`, else `'light'`). The host passes the same literals the element accepts.

No other `qc-theme` writers, no in-page `matchMedia` change listener (saved preference is sticky by design), and no host `onError` path in this workflow.

## Falsification

- First paint of `#app` is empty until modules load; `initTheme` runs in the same turn as the first App commit, so the themed shell is not committed with a missing `data-theme`. Blank SPA boot is not a theme-token failure.
- Google Fonts `@import` is a separate resource load, not this toggle path.
- Empty `organizationId` and hash-router behavior are adjacent host props and were previously audited; they do not change theme writes.
- Custom-element theme updates depend on the `theme` **attribute**. The element does not define a `theme` property, so Preact/compat should set the attribute. That interop is SDK-owned; this host passes the supported prop.

No reachable host invariant was violated: toggle output is only `light`/`dark`, DOM and widget props stay aligned, and persistence failures do not escape.

## Verification

- Isolated worktree from preflight remote SHA `c7f0d01310addb2977ff90007da4422a61d648d4`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`.
- CodeGraph unindexed for this worktree; focused file reads/searches used.
- No source or test changes. No tests authored.
- Tests/build/lint/type-check/install: **NOT RUN BY BUGHUNTER**.
- `git diff --check` run on the docs-only patch.
- Open PRs at preflight: none (`OPEN_PR_COUNT=0`); no overlap skip.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T12:44:38Z | 2026-11-05T12:45:00Z | 00:00:22 (0.4 min) | 18:14:38–18:15:00 |
| `audit` | 2026-11-05T12:45:18Z | 2026-11-05T12:50:05Z | 00:04:46 (4.8 min) | 18:15:18–18:20:05 |
| `delivery` | 2026-11-05T12:50:05Z | 2026-11-05T12:50:35Z | 00:00:31 (0.5 min) | 18:20:05–18:20:35 |
| **Total run (preflight start to finish)** | 2026-11-05T12:44:38Z | 2026-11-05T12:50:35Z | **00:05:57 (6.0 min)** | **18:14:38–18:20:35** |
| Unclassified interval between marked phases | — | — | 00:00:18 (0.3 min) | — |

Timing-table insertion occurred after this measurement snapshot.
