# BugHunter audit: Preact host live prefers-color-scheme updates

- Run: `20261106T001938Z-d376bdf2faec4755bcd909a51c34af8f`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `58bab81` (`58bab81 docs(bughunter): audit Preact host keyboard navigation (#66)`)
- Workflow: OS/UA `prefers-color-scheme` after first paint — whether a later system light/dark change updates host `data-theme` / `html.dark` / `cc--darkmode` and the `QratiConnect` `theme` prop when `qc-theme` is unset
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host reads `prefers-color-scheme` once (blocking head script, then `initTheme`) as the fallback when `localStorage['qc-theme']` is missing or invalid. Page tokens and the Connect widget follow host `data-theme` / the `theme` prop, not a live CSS `@media (prefers-color-scheme)` rule. There is no `MediaQueryList` `change` listener. README and hero copy describe a **host-controlled** light/dark theme (the toggle). After the user toggles, `persistTheme` writes `qc-theme`, so subsequent OS changes must not override that choice. A mid-session OS switch with no saved preference stays stale until reload; that is an unclaimed live-sync enhancement, not a broken invariant.

## Trace

1. Entry: `index.html` blocking theme script; `src/main.tsx` renders `<App />`; `src/app.tsx` `useState(initTheme)`.
2. Inputs: `localStorage['qc-theme']` (`'light'|'dark'` only via `readSavedTheme`), else `window.matchMedia('(prefers-color-scheme: dark)').matches`. No `addEventListener('change')` in `index.html`, `src/app.tsx`, `src/theme.js`, or `src/main.tsx`.
3. Authz: none; public example.
4. Transform: pre-paint script and `initTheme` set `data-theme`, `html.dark`, and `html.cc--darkmode`. `src/index.css` binds `color-scheme` and tokens to `[data-theme='light'|'dark']`, not to `@media (prefers-color-scheme)`.
5. Persistence: `toggleTheme` always `persistTheme(next)`. Reload with a saved value ignores OS. Reload with no saved value re-reads `matchMedia` at startup.
6. Output: Connect receives `theme={theme}` (`'light'|'dark'`). Widget updates are SDK-owned once the host prop changes.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `matchMedia('…').addEventListener('change', …)`:** MDN documents `MediaQueryList` `change` as the API for detecting later query status changes. Absence is only a defect if this host promised continuous system-theme tracking. It does not. README: “host-controlled light/dark theme.”
- **CSS would restyle on OS change anyway:** rejected. Tokens require `[data-theme=…]`. Without a JS writer, an OS flip does not restyle the page or the widget prop.
- **Stale theme after OS change with no `qc-theme`:** reachable until reload. Reload re-runs the head script. Not a failed first paint (pre-paint theme already fixed, #43) and not a failed toggle (theme-toggle audit 20261105T124438Z already noted no change listener because a saved preference is sticky).
- **First toggle “locks” the user off system theme:** intended. There is no `system` value in `Theme` (`src/theme.d.ts`).
- **`cc--darkmode` / PhotoSwipe stacking / reduced-motion:** adjacent, previously audited; they do not add a live OS listener.
- Adjacent, out of scope: cookie consent, GTM, hash router, worker SPA routing, keyboard nav.

## Scope and non-goals

Preact example host response to a later `prefers-color-scheme` change only. Not adding a system-theme option or a `change` listener. Not SDK widget internals. Not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean (docs only)
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [MDN `MediaQueryList` `change` event](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event), [MDN `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme)

## Limitations

No OS theme-toggle session in a browser, no live `qrati.com` request, no computed-style capture after a `matchMedia` change.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-06T00:19:38Z | 2026-11-06T00:20:01Z | 00:00:23 (0.4 min) |
| `audit` | 2026-11-06T00:20:23Z | 2026-11-06T00:23:11Z | 00:02:48 (2.8 min) |
| `delivery` | 2026-11-06T00:23:11Z | 2026-11-06T00:24:07Z | 00:00:56 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-06T00:19:38Z | 2026-11-06T00:24:07Z | **00:04:29 (4.5 min)** |
| Unclassified interval between marked phases | — | — | 00:00:22 (0.4 min) |

- Preflight: 05:49:38–05:50:01 IST (6 Nov)
- Audit: 05:50:23–05:53:11 IST (6 Nov)
- Delivery: 05:53:11–05:54:07 IST (6 Nov)
- Total: 05:49:38–05:54:07 IST (6 Nov)

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
