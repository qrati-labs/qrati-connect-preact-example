# Preact footer brand image delivery audit

- **Run:** `20261019T014238Z-5d1b669531f545d8ab4bf2d1328f5580`
- **Repository:** `qrati-labs/qrati-connect-preact-example`
- **Scope:** Footer brand logo image request and rendered fallback in the public Preact example. Excludes footer navigation (audited in PR #14), gallery behavior, host theme, and general page shell.
- **Base:** `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`
- **Finding:** No confirmed defect (report-only).

## Trace and evidence

1. `src/app.tsx:102-109` renders the footer brand area. Its image has descriptive alt text, loads from `https://assets.qrati.com/images/qrati-connect-logo-square.png`, and sets `referrerpolicy="no-referrer"`. The adjacent brand name/tagline remain ordinary text, so a failed image request does not remove the brand identity.
2. The source tree includes a local `public/qrati-connect-logo-square.png`, but the footer deliberately references the asset host instead. `wrangler.jsonc:7-8` serves the built `dist` assets from the example route; the worker in `src/worker.ts:8-36` rewrites that route and modifies HTML only. It does not proxy or rewrite the footer image URL.
3. The actual user-visible path is therefore a browser request to the configured asset host, with text alternative on failure. Static evidence establishes graceful content fallback and no referrer disclosure; it does not establish availability or correctness of the live remote image.

## Assessment

A remote asset-host failure could omit the logo, but the brand text and accessible alternative remain, and the code explicitly chooses the asset host. Without a demonstrated host failure or a requirement that this image be served locally, changing the URL would be speculative. No issue or source/test change is warranted. Confidence: moderate for the code path, limited for live asset availability and browser rendering.

Open PR #14 changes only the audit report/tracker for footer navigation; its stated scope is navigation and the conversion CTA, not the footer brand image request. The image-delivery workflow is distinct and does not overlap that audit.

## Tests and limits

- No regression test authored; no confirmed defect.
- No tests/build/lint/type-check/coverage/install/package-manager commands run, per BugHunter boundary.
- Live asset request, browser rendering, network-failure behavior, and accessibility-tree output were not exercised. Exact test command: **not applicable**.

## Timing (UTC; IST = UTC+05:30)

- Run/preflight start: `2026-10-19T01:42:39Z` (`2026-10-19 07:12:39 IST`). Preflight was supplied by the scheduler; its measured duration was 23 seconds.
- Candidate selection and fresh repository/PR verification: began `2026-10-19T01:43:13Z`; selection completed before source mapping at `2026-10-19T01:43:13Z` (duration below one minute; exact sub-phase timing unavailable).
- Source mapping and workflow trace: `2026-10-19T01:43:13Z`–`2026-10-19T01:44:08Z` (55 seconds; 07:13:13–07:14:08 IST).
- Report/tracker, PR, and remote readback timing: to be recorded after completion from live timestamps; no duration estimated.

## Delivery

- Issue: none (report-only).
- PR: pending.
- Checks: not yet observed.
