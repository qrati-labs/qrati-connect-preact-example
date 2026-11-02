# BugHunter reports

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
