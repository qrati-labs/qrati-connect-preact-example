# BugHunter audit: Preact FAQ structured data

- Run: `20261105T231438Z-192d111d00d44d29bfa3580b61f22018`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `a8e9e1b773eabeea2a3faa7a60294a195c308815` (`a8e9e1b docs(bughunter): audit Preact cookie-consent vs theme-toggle stacking (#63)`)
- Workflow: visible host FAQ disclosures vs static `index.html` JSON-LD (SoftwareApplication only; no FAQPage)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host FAQ is a client-rendered `<details>` list in `src/app.tsx` (`aria-labelledby="faq-heading"`, five questions with non-empty answers; first item `open`). Static `index.html` already publishes title, description, canonical, Open Graph, and a `SoftwareApplication` JSON-LD block for the example URL. It does not emit `FAQPage` `mainEntity` markup. That is a completeness gap versus the Qwik example’s extra FAQPage graph, not a broken disclosure or a violated contract in this repository.

Google’s FAQ rich results from FAQPage structured data are limited to well-known government and health sites ([August 2023 Search Central change](https://developers.google.com/search/blog/2023/08/howto-faq-changes)). This demo is neither; missing FAQPage cannot be shown to have a user-facing search failure.

## Trace

1. Entry: `index.html` loads `/src/main.tsx`; `src/main.tsx` renders `App` into `#app`.
2. Inputs: none; FAQ copy is static in `src/app.tsx`. No user-controlled HTML.
3. Authz: none; public example.
4. Visible FAQ: section `aria-labelledby="faq-heading"`; native `<details>`/`<summary>` (keyboard/AT handled by the element). Answers match the documented Preact React-component embed, optional uploads, host `theme` prop, dark mode, and contests.
5. Static crawler surface: `index.html` JSON-LD `@type` `SoftwareApplication` with `url` `https://qrati.com/connect/preact-example`; robots/sitemap/canonical already audited (2026-10-18 crawler discovery; 2026-11-05 OG/JSON-LD).
6. Output: users can expand FAQ in the page; crawlers that execute JS see the same text; crawlers that only read `index.html` still get SoftwareApplication + meta, not FAQPage.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing FAQPage vs Qwik sibling:** completeness, same class as missing `twitter:card` in the Open Graph audit (`20261105T130638Z-preact-og-jsonld.md`). This repo does not claim FAQ rich results.
- **FAQ only after JS:** Vite SPA shell; title/description/canonical/JSON-LD remain in static HTML. Not a broken robots/sitemap path.
- **Empty or contradictory answers:** each of the five items has a non-empty `<p>` consistent with README (`React component` via `preact/compat`, `theme` prop, contests). Feature-card “Native Web Component” labeling was already rejected as a mount defect in the compat-embed audit.
- **Interactive FAQ broken:** native `<details>` disclosure was audited separately (`20261105T191138Z-preact-faq-disclosures.md`); this run is structured-data/crawler mapping only.
- Adjacent, out of scope: cookie consent, theme toggle, GTM, worker prefix, org id, favicon.

## Scope and non-goals

Preact example host FAQ copy vs static JSON-LD only. Not adding FAQPage markup. Not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Changes to HowTo and FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

## Limitations

No live `qrati.com` request, no Google rich-results test, no crawler fetch of the deployed HTML.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-05T23:14:38Z | 2026-11-05T23:15:00Z | 00:00:22 (0.4 min) |
| `audit` | 2026-11-05T23:15:15Z | 2026-11-05T23:18:45Z | 00:03:31 (3.5 min) |
| `delivery` | 2026-11-05T23:18:45Z | 2026-11-05T23:19:27Z | 00:00:41 (0.7 min) |
| **Total run (preflight start to finish)** | 2026-11-05T23:14:38Z | 2026-11-05T23:19:27Z | **00:04:49 (4.8 min)** |
| Unclassified interval between marked phases | — | — | 00:00:15 (0.2 min) |

- Preflight: 04:44:38–04:45:00 IST (6 Nov)
- Audit: 04:45:15–04:48:45 IST (6 Nov)
- Delivery: 04:48:45–04:49:27 IST (6 Nov)
- Total: 04:44:38–04:49:27 IST (6 Nov)

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
