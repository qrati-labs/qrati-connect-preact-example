# BugHunter audit: Preact browser chrome theme-color

- Run: `20261105T201738Z-ef0bec5547d845b887da681b219b2d19`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `9c9c2142c86469b5e421764850e152d03f78bd5c` (`9c9c214 docs(bughunter): audit Preact iOS Web Clip icon (#54)`)
- Workflow: browser UI chrome color for the example mounted at `/connect/preact-example` (`index.html` metadata → CSS `color-scheme` on `[data-theme]` → pre-paint theme script)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host document does not declare `<meta name="theme-color">` (or media-specific pairs). MDN/HTML describe `theme-color` as a **suggested** UA chrome color (“indicates a suggested color that user agents should use”), not Baseline, and not required for document correctness. Page theming is already applied by the blocking pre-paint script in `index.html` (sets `data-theme`, `dark`, and `cc--darkmode`) plus CSS `color-scheme: light|dark` on `[data-theme='light']` / `[data-theme='dark']`, which is the HTML/CSS contract for form controls, scrollbars, and built-in UA widgets.

This repository does not document PWA install, Android Chrome toolbar branding, or a web app manifest. Missing `theme-color` is the same class of optional chrome polish as missing `apple-touch-icon` (prior report-only `20261105T195538Z-preact-apple-touch-icon.md`) and missing `twitter:card` (Open Graph audit). Adding a static meta (or `media="(prefers-color-scheme: …)"` pair) would not track the host toggle’s `data-theme` without extra script, so a naive tag could even disagree with the in-page theme.

## Trace

1. Entry: browser GET of `https://qrati.com/connect/preact-example` (canonical; no trailing slash). HTML is static `index.html`.
2. Inputs: `<meta name="viewport">`, title, description, canonical, Open Graph, JSON-LD. Zero `theme-color` / `color-scheme` meta names. No `manifest` link.
3. Authz: none; public example.
4. Transform: inline script reads `localStorage['qc-theme']` (guarded) or `prefers-color-scheme`, then sets `document.documentElement` `data-theme` and classes before first CSS paint. `src/index.css` binds `color-scheme` and page tokens to `[data-theme]`. `src/app.tsx` `initTheme` / `toggleTheme` keep the same attributes and persist via `src/theme.js`.
5. Persistence/side effects: theme preference in `qc-theme`; no `theme-color` mutation.
6. Output: in-page light/dark theme applies. Browser toolbar/status-bar tint uses the UA default unless a manifest or meta suggests otherwise. This run did not fetch production `qrati.com` (no unapproved external test).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Reachable missing tag:** yes, `index.html` has no `theme-color`. Not sufficient: HTML treats it as optional suggested chrome metadata; Can I Use / MDN mark limited, non-Baseline support.
- **CSS `color-scheme` already present:** yes, on both theme selectors. That is the supported document-level light/dark compatibility signal for UA-controlled widgets. A duplicate `<meta name="color-scheme">` is not required when CSS already sets it after the pre-paint attribute is applied.
- **Host toggle would desync a static meta:** `toggleTheme` does not update any `theme-color` tag. Filing “add theme-color” without a live updater would not restore a broken gallery/consent path.
- **Sibling apple-touch-icon / twitter:card gaps:** already classified as non-defects. Same optional-chrome category.
- Adjacent, out of scope: favicon `%BASE_URL%` (#27, closed), iOS Web Clip, Worker GTM HTML no-op, cookie consent, OG/JSON-LD.

## Scope and non-goals

Browser chrome `theme-color` / `color-scheme` metadata for this example host only. Not adding a web app manifest, `apple-mobile-web-app-*`, or Twitter Card tags. Not other example repos. Not production HTTP.

## Tests and verification

- Authored: none (report-only)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused file reads used
- Isolated worktree: `rev-parse --show-toplevel` equaled `WORKTREE_PATH`
- Research: MDN `meta name=theme-color` (suggested color; optional `media`); HTML meta names list

## Limitations

No Android Chrome / Safari toolbar session and no live `qrati.com` GET in this run. Confidence is high against the HTML/MDN optional-suggestion contract and this repository’s source.

## Timing (measured wall-clock)

Timing table inserted after `finish`.
