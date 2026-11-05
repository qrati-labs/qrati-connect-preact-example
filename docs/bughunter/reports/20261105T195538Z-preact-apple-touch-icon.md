# BugHunter audit: Preact iOS Web Clip / apple-touch-icon

- Run: `20261105T195538Z-cb528c99bdd942b1b4d545f3bce00f0d`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `c9b215fda25e11c8cc281a6a0a77aeb366597aa8` (`c9b215f docs(bughunter): audit Preact cookie-consent geo lookup (#53)`)
- Workflow: iOS Home Screen / Web Clip icon for the example mounted at `/connect/preact-example` (`index.html` icon links → `public/` PNG/SVG → Vite `base` + Worker prefix rewrite)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host document advertises a tab favicon via SVG (`index.html` `<link rel="icon" type="image/svg+xml" href="%BASE_URL%qrati-logo-square.svg" />`, issue #27). It does not declare `<link rel="apple-touch-icon">`, and `public/` has no `apple-touch-icon.png`. Apple’s Safari Web Content guide treats a Web Clip icon as an **optional** iOS-only enhancement (“You may want…”, “optional settings that when added to your web content are ignored by other platforms”). Without a page-level `apple-touch-icon` link, Safari searches the **website root** for `apple-touch-icon*.png`, which for this mount is `qrati.com/`, not the example subpath.

A PNG square logo exists at `public/qrati-connect-logo-square.png` (128×128 PNG, 12369 bytes). Sibling Connect examples (Qwik, React) do emit `rel="apple-touch-icon"`. That is a completeness gap versus those hosts, not a violated Preact-example invariant: this repo does not document Home Screen install, PWA, or `apple-mobile-web-app-capable` behavior. Adding an icon link would be product polish, not a bugfix.

## Trace

1. Entry: crawler/browser GET of `https://qrati.com/connect/preact-example` (canonical; no trailing slash). HTML is static `index.html`, not Preact-rendered.
2. Inputs: `<link rel="icon">` only; no `apple-touch-icon`; no `<meta name="apple-mobile-web-app-*">`.
3. Authz: none; public example.
4. Transform: Vite `base: '/connect/preact-example/'` substitutes `%BASE_URL%` on the SVG favicon (issue #27). Worker (`src/worker.ts`) rewrites `/connect/preact-example` → `/` and returns non-HTML assets unchanged.
5. Persistence/side effects: iOS “Add to Home Screen” would look for `apple-touch-icon` on this page, then fall back to root-domain files. No example-local Web Clip PNG is declared.
6. Output: tab icon remains the SVG at the mounted path; Home Screen icon is whatever the site root supplies, or a Safari screenshot if none exists. This run did not fetch production `qrati.com` (no unapproved external test).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Reachable missing tag:** yes, `index.html` has zero `apple-touch-icon` matches. Not sufficient for a defect: Apple documents the feature as optional.
- **SVG favicon cannot be the Web Clip icon:** true (Apple specifies PNG). Does not create a broken embed/gallery/consent path. The example’s user-facing contract is the Qrati Connect widget, not iOS Web Clip chrome.
- **Sibling examples include the tag:** completeness, same class as missing `twitter:card` already recorded as a non-defect in the Open Graph audit (`20261105T130638Z-preact-og-jsonld.md`).
- **128×128 PNG is smaller than Apple’s 180×180 recommendation:** even if a link were added, this file would be a downscale source, not proof of a current failure.
- **Root `apple-touch-icon.png` may already brand Web Clips:** unknown without a production GET; if present, this example would inherit Qrati branding. Unknown ≠ defect.
- Adjacent, out of scope: favicon path (#27), OG/JSON-LD, Worker GTM HTML no-op, cookie consent.

## Scope and non-goals

iOS Web Clip icon declaration for this example host only. Not adding PWA manifest, theme-color, or Twitter Card tags. Not other example repos. Not production HTTP.

## Tests and verification

- Authored: none (report-only)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused file reads used
- Isolated worktree: `rev-parse --show-toplevel` equaled `WORKTREE_PATH`

## Limitations

No Safari/iOS Home Screen session and no live `qrati.com` icon GET in this run. Confidence is high against Apple’s published optional Web Clip contract and this repository’s source.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T19:55:38Z | 2026-11-05T19:56:01Z | 00:00:23 (0.4 min) | 01:25:38–01:26:01 |
| `audit` | 2026-11-05T19:56:19Z | 2026-11-05T20:00:52Z | 00:04:34 (4.6 min) | 01:26:19–01:30:52 |
| `delivery` | 2026-11-05T20:00:52Z | 2026-11-05T20:01:48Z | 00:00:56 (0.9 min) | 01:30:52–01:31:48 |
| **Total run (preflight start to finish)** | 2026-11-05T19:55:38Z | 2026-11-05T20:01:49Z | **00:06:11 (6.2 min)** | **01:25:38–01:31:49** |
| Unclassified interval between marked phases | — | — | 00:00:18 (0.3 min) | — |

Timing-table insertion occurred after this measurement snapshot.
