# BugHunter reports

| Date (UTC) | Workflow | Result | Report |
|---|---|---|---|
| 2026-11-05 | Preact cookie-consent opt-out analytics | P2 confirmed; `analytics.enabled: true`; issue #29 | [20261105T120039Z-preact-consent-opt-out.md](reports/20261105T120039Z-preact-consent-opt-out.md) |
| 2026-11-05 | Preact favicon delivery | P3 confirmed; `%BASE_URL%` icon href; issue #27 | [20261105T111638Z-preact-favicon.md](reports/20261105T111638Z-preact-favicon.md) |
| 2026-10-18 | Preact theme preference validation | P2 confirmed; narrow source fix | [Audit report](reports/20261018T222038Z-preact-theme-validation.md) |
# BugHunter audits

# BugHunter reports

- [2026-10-19 — Preact theme preference storage](reports/2026-10-19T1800Z-preact-theme-storage.md) — report-only audit; no confirmed defect. [PR #23](https://github.com/qrati-labs/qrati-connect-preact-example/pull/23).

Timing for this run was measured only through the audit/ledger snapshot; report and PR delivery occurred afterward and is not included in the measured elapsed time.
# BugHunter audits

| Date (UTC) | Workflow | Result | Report |
|---|---|---|---|
| 2026-10-19 | Preact feature-map icon delivery | P3 confirmed; local fallback fix; tests authored, NOT RUN BY BUGHUNTER; total 00:02:27 (15:08:38–15:11:06 IST) | [Report](reports/2026-10-19T09-38Z-preact-feature-map-icons.md) |
Bounded workflow audits and findings. Each report records scope, evidence, disposition, timing, and verification boundaries.

| Date (UTC) | Workflow | Result | Report |
|---|---|---|---|
| 2026-10-21 | Preact cookie-consent initialization | Report-only; no confirmed defect; measured total 00:01:04 (12:52:39–12:53:42 UTC; 18:22:39–18:23:42 IST), excludes report/PR delivery | [Report](reports/2026-10-21T12-52Z-preact-cookie-consent.md) |
| 2026-10-20 | Preact widget organization configuration | Report-only; no confirmed defect; total 00:02:04 (13:22:39–13:24:43 UTC; 18:52:39–18:54:43 IST) | [Report](reports/2026-10-20T13-22Z-preact-widget-config.md) |
| 2026-10-19 | Preact mounted-path static asset routing | Report-only; preflight 00:00:24 (05:16:42–05:17:07 UTC); audit/total timing incomplete | [Report](reports/2026-10-19T05-17Z-preact-static-assets.md) |
# BugHunter audit index

| UTC | Workflow | Repository / base SHA | Outcome / severity | Tests and coverage | Research sources | PR / blocker |
|---|---|---|---|---|---|---|
| 2026-10-19 04:31 | Preact outbound navigation (hero, CTA, footer) | `qrati-connect-preact-example` / `002faea7e6dd8505cdf5b570229c4e3407f0fabf` | Report-only; no confirmed defect | No tests authored; tests/build/lint/type-check not run per BugHunter policy | Source files and open PR diffs | [PR #19](https://github.com/qrati-labs/qrati-connect-preact-example/pull/19) (open, mergeable; GitGuardian passed; no other checks reported); report: [2026-10-19T04-31Z-preact-outbound-links.md](reports/2026-10-19T04-31Z-preact-outbound-links.md) |
# BugHunter reports

- [Preact footer brand image delivery audit](reports/2026-10-19T01-42Z-preact-footer-brand-image.md) — 2026-10-19; no confirmed defect, report-only.
| Date (UTC) | Workflow | Result | Report |
|---|---|---|---|
| 2026-10-18 | Preact embedded gallery shell | Report-only; no confirmed defect | [Audit report](reports/20261018T181838Z-preact-embedded-gallery-shell.md) |
| Date (UTC) | Scope | Result | Report |
|---|---|---|---|
| 2026-10-18 | Preact footer navigation and conversion links | Report-only; no confirmed defect | [20261018T175439Z-preact-footer-links.md](reports/20261018T175439Z-preact-footer-links.md) |
- [20261018T121638Z — Preact FAQ disclosure workflow](reports/20261018T121638Z-preact-faq-disclosures.md) — report-only; no confirmed defect.
- [20261018T041138Z — Preact crawler discovery](reports/20261018T041138Z-preact-crawler-discovery.md) — report-only; no confirmed defect.
# BugHunter audit index

| Date (UTC) | Workflow | Disposition | Report |
|---|---|---|---|
| 2026-10-18 | Preact cookie-consent initialization | Report-only; no additional confirmed defect | [20261018T011539Z-preact-consent-initialization.md](reports/20261018T011539Z-preact-consent-initialization.md) |
# BugHunter reports

- [2026-10-17 — Preact decorative feature icons](reports/20261017T193638Z-preact-feature-icons.md) — report-only; no confirmed defect.
- [2026-10-17 — Preact application bootstrap and consent initialization](reports/20261017T085639Z-preact-bootstrap.md) — no confirmed defect; report-only.
# BugHunter Reports

- [Preact worker HTML transformation audit](reports/20261016T184138Z-preact-worker-html.md) — report-only review of asset routing and HTML response transformation.
# BugHunter reports

- [2026-10-16 — Preact consent geo response validation](reports/20261016T172638Z-preact-geo-response.md) — invalid HTTP/JSON geo responses now fail closed before consent mode selection.
- [Preact organization configuration workflow](reports/20261016T164839Z-preact-org-config.md) — report-only audit; no confirmed defect.
# BugHunter audit tracker

| Date (UTC) | Workflow | Reviewed base SHA | Finding / disposition | Issue | Report | PR | Measured wall time |
|---|---|---|---|---|---|---|---|
| 2026-10-16 | Preact page-load cookie consent / Google consent mode | `002faea7e6dd8505cdf5b570229c4e3407f0fabf` | High: missing synchronous denied defaults before early tags; fixed | [#1](https://github.com/qrati-labs/qrati-connect-preact-example/issues/1) | [Report](reports/20261016-preact-google-consent-default.md) | [PR #2](https://github.com/qrati-labs/qrati-connect-preact-example/pull/2) OPEN, mergeable, checks pending | 00:04:11 elapsed, 10:18:38Z–10:22:50Z; phases overlap (source review/research), unclassified 00:00:00 |
# BugHunter reports

- [2026-10-16 — Preact theme storage failures](reports/20261016T160939Z-preact-theme-storage.md) — guard theme preference reads/writes when browser storage is unavailable; [issue #3](https://github.com/qrati-labs/qrati-connect-preact-example/issues/3).
- [2026-10-22 — Preact cookie-consent initialization](reports/2026-10-22T031638Z-preact-consent-init.md) — completed report-only review; no confirmed defect. Base `002faea`. Measured total 00:01:12 (1.2 min).
