# BugHunter audit: Preact host viewport pinch-zoom

- Run: `20261110T113938Z-1be4f04f3b7a43518bcfb4e06f6c0e16`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `ba26a2163d03ef86f9a289ff35663d70bcdca265` (`ba26a21 docs(bughunter): audit Preact canonical vs trailing-slash mount (#85)`)
- Workflow: host mobile viewport / pinch-zoom (`index.html` `<meta name="viewport">` vs WCAG 2.2 1.4.4 Resize text / ACT b4f0c3)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host document declares a single viewport tag:

`width=device-width, initial-scale=1.0`

It does **not** set `user-scalable=no` / `user-scalable=0` or `maximum-scale` `< 2`. W3C ACT rule [Meta viewport allows for zoom (b4f0c3)](https://www.w3.org/WAI/standards-guidelines/act/rules/b4f0c3/) applies only when the viewport `content` attribute includes `maximum-scale` or `user-scalable`. With neither key present, the rule is inapplicable (zoom is not author-restricted). Host CSS/JS have zero `touch-action`, `preventDefault` on touch, or other pinch blockers. Cookie-consent and Connect widget zoom behavior are library-owned.

## Trace

1. Entry: static `index.html` `<head>` (not Preact-rendered). Mounted path `/connect/preact-example`.
2. Inputs: viewport meta only. No `maximum-scale`, `minimum-scale`, or `user-scalable`.
3. Authz: none; public example.
4. Transform: Worker (`src/worker.ts`) rewrites the prefix for HTML but does not mutate the viewport tag. Current HTML has no GTM placeholders, so the rewrite is a no-op on this document.
5. Persistence/side effects: none. No JS `matchMedia` or gesture handler related to scale.
6. Output: mobile UAs that honor viewport meta keep default pinch-zoom / text resize. This run did not fetch production `qrati.com` (no unapproved external test).

Open PR `#80` (`src/index.css` `--cc-toggle-off-bg`, consent contrast tests, docs) does not change `index.html` or viewport behavior. No overlap.

## Falsification

- **Missing viewport tag would break mobile layout:** disproved; tag is present with `width=device-width`.
- **`initial-scale=1.0` locks zoom:** false. ACT b4f0c3 failures are `user-scalable` in `(-1, 1)` or `maximum-scale < 2`. `initial-scale` is not a zoom lock.
- **CSS `overflow: hidden` on `.page-shell` / `.widget-frame` prevents zoom:** page zoom is a UA transform, not in-flow overflow. Prior stacking audit already treated that overflow as a PhotoSwipe containing-block question, not zoom.
- **Connect / cookie-consent overlays trap pinch:** out of this host-viewport workflow; not evidenced in this repo.
- Adjacent, out of scope: cookie-consent contrast (#80), canonical slash, theme-widget sync, OG/Twitter tags.

## Scope and non-goals

Preact example host viewport pinch-zoom only. Not adding `maximum-scale=2` (unnecessary). Not SDK/PhotoSwipe. Not other example repos. No production HTTP. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Command: n/a (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [ACT b4f0c3 Meta viewport allows for zoom](https://www.w3.org/WAI/standards-guidelines/act/rules/b4f0c3/); WCAG 2.2 SC 1.4.4 Resize text

## Limitations

No device pinch-zoom session. No live `qrati.com` GET. Edge HTML rewrite assumed identity from current `index.html` (no GTM placeholders).

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-10T11:39:38Z | 2026-11-10T11:40:00Z | 00:00:22 (0.4 min) | 17:09:38–17:10:00 |
| `audit` | 2026-11-10T11:40:24Z | 2026-11-10T11:45:24Z | 00:04:59 (5.0 min) | 17:10:24–17:15:24 |
| `delivery` | 2026-11-10T11:45:24Z | 2026-11-10T11:46:37Z | 00:01:13 (1.2 min) | 17:15:24–17:16:37 |
| **Total run (preflight start to finish)** | 2026-11-10T11:39:38Z | 2026-11-10T11:46:37Z | **00:06:59 (7.0 min)** | **17:09:38–17:16:37** |
| Unclassified interval between marked phases | — | — | 00:00:25 (0.4 min) | — |

- Preflight: 17:09:38–17:10:00 IST
- Audit: 17:10:24–17:15:24 IST
- Delivery: 17:15:24–17:16:37 IST
- Total: 17:09:38–17:16:37 IST

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
