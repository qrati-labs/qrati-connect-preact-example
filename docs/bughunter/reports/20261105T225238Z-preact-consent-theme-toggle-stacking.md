# BugHunter audit: Preact cookie-consent vs theme-toggle stacking

- Run: `20261105T225238Z-fae2be3668c249839f57c894fa151d4f`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `d28fdd49e50fb178acdb08aa8b2262a73dafbdcf` (`d28fdd4 fix(a11y): keep theme toggle Light/Dark text in the accessible name (#62)`)
- Workflow: host theme-toggle stacking and geometry vs vanilla-cookieconsent consent banner and preferences modal
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The fixed theme toggle (`position: fixed; top: 1rem; right: 1rem; z-index: 100`) is a previous sibling of `.page-shell` inside `#app`. vanilla-cookieconsent v3.1.0 mounts `#cc-main` on `document.body` as `position: fixed; z-index: var(--cc-z-index)` with library default `--cc-z-index: 2147483647`. This host’s `#cc-main` rules set color tokens only and do not lower that z-index. Default `guiOptions.consentModal` is `layout: 'box'`, `position: 'bottom right'`, so the first-run banner does not occupy the toggle’s top-right corner. The preferences modal and its overlay live inside the same `#cc-main` stacking context, so they also paint above the toggle.

## Trace

1. Entry: `src/main.tsx` `void initCookieConsent()` then `render(<App />)`. `src/app.tsx` renders `.theme-toggle` then `.page-shell`. Footer Cookie Preferences calls `showCookiePreferences()`.
2. Inputs: geo `{ required }` selects `opt-in` vs `opt-out` and `autoShow: required`. First visit in an opt-in region shows the consent box; returning visitors with valid `cc_cookie` do not. Preferences are always reachable from the footer.
3. Authz: none; public example.
4. Host stacking: `.theme-toggle` is `position: fixed; z-index: 100` (not inside `.page-shell`). `.page-shell` is `position: relative; overflow: hidden` without `isolation` (issue #58 / PR #59).
5. CMP (vanilla-cookieconsent v3.1.0): `#cc-main` is `position: fixed; z-index: var(--cc-z-index)`; compiled CSS sets `--cc-z-index: 2147483647`. Default consent box is bottom-right. `disablePageInteraction` default is `false` (documented); this host does not override `guiOptions` or `disablePageInteraction`.
6. Output: banner/preferences remain above the toggle; toggle remains usable while the banner is up (no page-interaction lock). Dark-mode class `cc--darkmode` is toggled on `document.documentElement` independently of CMP z-index.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Toggle covers Accept/Reject:** rejected. Banner default is bottom-right; toggle is top-right. No host CSS moves the consent box.
- **Toggle stacks above `#cc-main`:** rejected. Host does not set `--cc-z-index` or `#cc-main { z-index }`. Library z-index is `2147483647` vs toggle `100`. `#cc-main` is a stacking context; inner overlay `z-index: 1` still wins over the toggle.
- **Same class as PhotoSwipe stacking (#58):** different portal. PhotoSwipe appends inside `#qrati-connect-container` under `.page-shell`. Cookie consent appends to `document.body`, outside `#app`.
- **`disablePageInteraction: false` lets users hit the toggle/gallery during the banner:** library default, not a broken stacking path. Banner copy does not claim a blocking overlay. `autoShow` is already limited to geo-required opt-in.
- **Host `#cc-main` color overrides:** token-only; they do not change `position` or `z-index`.
- Adjacent, out of scope: Consent Mode ads mapping, cookie persistence, PhotoSwipe stacking (#58), theme-toggle Label in Name (#61), GTM bootstrap.

## Scope and non-goals

Preact example host theme-toggle vs cookie-consent banner/preferences stacking only. Not a legal opinion. Not SDK PhotoSwipe. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused file reads used
- Primary docs: [vanilla-cookieconsent configuration reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html) (`guiOptions.consentModal` defaults, `disablePageInteraction` default `false`); v3.1.0 `cookieconsent.css` `--cc-z-index: 2147483647` and `#cc-main { position: fixed; z-index: var(--cc-z-index) }`

## Limitations

No browser screenshot of the banner vs the toggle. No live `qrati.com` request. Geometry inferred from host CSS and library defaults.

## Timing (measured wall-clock)

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T22:52:38Z | 2026-11-05T22:53:00Z | 00:00:22 (0.4 min) | 04:22:38–04:23:00 |
| `audit` | 2026-11-05T22:53:28Z | 2026-11-05T22:57:40Z | 00:04:12 (4.2 min) | 04:23:28–04:27:40 |
| `delivery` | 2026-11-05T22:57:40Z | 2026-11-05T22:58:35Z | 00:00:54 (0.9 min) | 04:27:40–04:28:35 |
| **Total run (preflight start to finish)** | 2026-11-05T22:52:38Z | 2026-11-05T22:58:35Z | **00:05:57 (6.0 min)** | **04:22:38–04:28:35** |
| Unclassified interval between marked phases | — | — | 00:00:28 (0.5 min) | — |

- Preflight: 04:22:38–04:23:00 IST (6 Nov)
- Audit: 04:23:28–04:27:40 IST (6 Nov)
- Delivery: 04:27:40–04:28:35 IST (6 Nov)
- Total: 04:22:38–04:28:35 IST (6 Nov)

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
