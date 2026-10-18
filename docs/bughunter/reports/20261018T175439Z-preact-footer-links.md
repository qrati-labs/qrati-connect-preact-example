# Preact footer navigation and conversion links — report-only

- **Run:** `20261018T175439Z-552a3b75`
- **Scope:** Footer navigation and the landing-page conversion CTA on the Preact example; outbound links only. Excludes widget behavior, FAQ disclosures, theme switching, crawler discovery, and app bootstrap.
- **Base:** `origin/main` `002faea7e6dd8505cdf5b570229c4e3407f0fabf`.
- **Result:** No confirmed defect.

## Trace and evidence

- `src/app.tsx:99` renders the primary event-hosting CTA to `https://qrati.com` in a new tab with `rel="noopener noreferrer"`.
- `src/app.tsx:111-116` renders footer links for the canonical site, npm package, GitHub organization, and pricing page; new-tab links include `noopener noreferrer`.
- `src/app.tsx:5-6, 49-57` derives repository and VS Code links from `GITHUB_ORG` and `REPO` in `src/config.ts`; they target the example repository and its VS Code web view.
- No destination manipulation or user-provided URL enters these anchors. The template destinations are statically defined or built from fixed constants. This flow has no state or persistence side effects.
- Open PR diffs inspected for this repository change docs only, except existing consent/theme changes; none modify the footer navigation/conversion path. The FAQ PR is excluded from this scope.

## Finding / disposition

No evidence of a reachable failure in the selected footer-link/conversion workflow. This is a static source review; external destinations' live availability and rendered browser behavior were not tested. No issue or source changes are warranted.

## Tests

- No tests authored; no behavior defect was confirmed.
- No tests, builds, lint, type-checks, or external requests run by BugHunter.

## Timing

- Preflight: 17:54:39–17:55:02 UTC (23 s; supplied script measurement).
- Audit and delivery: 17:55:02–17:56:20 UTC (78 s; actual timestamps).
- Total: 17:54:39–17:56:20 UTC (101 s).
- IST (UTC+05:30): 23:24:39–23:26:20; phases 23 s / 78 s.

## Limitations

CodeGraph reported this checkout is not indexed; focused source reads were used. No live link verification or browser execution was performed. PR/check state is recorded in the linked PR readback, not inferred from a scheduler status.
