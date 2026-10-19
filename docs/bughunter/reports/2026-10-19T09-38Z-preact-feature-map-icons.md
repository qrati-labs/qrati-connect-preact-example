# BugHunter audit: Preact feature-map icon delivery

- Run: `20261019T093838Z-ef5ac58cf96649ad9f26f61a90a6094e`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `002faea`
- Scope: eight feature-map icons in `src/app.tsx`, runtime dependency in `index.html`, and the rendered static feature map only.
- Finding: [P3] Feature map icon rendering depended on external Iconify API availability. Confidence: confirmed by source and pinned runtime trace.
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/21 (created and read back before edits).

## Evidence and workflow trace

The HTML loaded Iconify runtime version 3.1.1 from `code.iconify.design`. The feature-map cards used eight `data-icon="material-symbols:..."` spans. Inspected the exact pinned runtime over HTTPS: it scans the data attributes and, when icon data is not cached, issues fetch requests to `api.iconify.design`, with mirror endpoints configured. Thus browsers with the runtime CDN available but API requests blocked/unavailable would show no feature-map icons, while headings and descriptions continued to work. Impact is limited to presentation; no core interaction or user content is lost.

The failure is specifically the remote service dependency for rendering presentational decorations. This is distinct from issue/PR #10, which audited earlier feature icons in a separate SEO feature-card section; current open PR #10 changes only report/tracker files. All open PR diffs listed by the fresh query were checked; none overlaps `index.html` runtime inclusion or the current feature-map markup. PR #17 overlaps theme validation (`src/app.tsx`) but does not touch feature-map code or HTML runtime; concern is independent.

## Fix and regression coverage

Removed the Iconify runtime script and replaced the eight runtime-resolved names with accessible-hidden text-symbol decorations, keeping existing styling/feature content. Added `tests/feature-icons.test.cjs` to assert all eight feature-map icons remain present and neither Iconify markup/runtime inclusion returns.

- Intended command: `node --test tests/feature-icons.test.cjs` — **NOT RUN BY BUGHUNTER**.
- No test, build, lint, type-check, coverage, install, or package-manager command was run.
- `git diff --check` passed.

## Limitations and review

No browser/network failure simulation was performed; API reliance was verified from the exact runtime implementation and source paths. Visual aesthetics of text-symbol substitutes were not browser-verified. No production/deployment access or mutation. Changes limited to `src/app.tsx`, `index.html`, and the focused regression test.

## Timing

Timer ledger recorded audit start at `2026-10-19T09:39:12Z` (14:39:12 IST). This report was prepared before audit end/finish; phase table and total will be populated only from the timer ledger after final PR verification. No duration is estimated.

## Delivery

Issue #21 is open; PR will include `Fixes #21`. No merge or deployment performed.
