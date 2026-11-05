# BugHunter audit: Preact Open Graph / JSON-LD social preview

- Run: `20261105T130638Z-a667e8c813634944b48df5c7258ffb28`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `0d496f0a3adb2c1cc1ca933f9931d045303bdf25`
- Workflow: social-crawler preview of the example landing page: HTML meta (`og:*`, canonical, description), JSON-LD `SoftwareApplication`, and `public/qrati-connect-og.png` delivery through the Vite `base` + worker prefix rewrite
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented.

## Trace and evidence

Entry for crawlers: `index.html` `<head>` (static HTML; not rendered by Preact).

Required Open Graph properties (https://ogp.me/ four required properties) are all present:

- `og:title` — `Embed an Event Gallery in Preact | Qrati Connect` (matches `<title>`)
- `og:type` — `website`
- `og:url` — `https://qrati.com/connect/preact-example` (matches `<link rel="canonical">`)
- `og:image` — `https://qrati.com/connect/preact-example/qrati-connect-og.png`

Also present: `og:description`, `meta name="description"`, `html lang="en"`.

JSON-LD (`application/ld+json`) parses as a single `SoftwareApplication` object with `@context` schema.org, `url` equal to canonical, and `publisher` Organization `Qrati Labs` at `https://qrati.com/`. Python `json.loads` of the script body succeeded.

Image asset:

- File: `public/qrati-connect-og.png` (117921 bytes). PNG IHDR 1200×630 (OG large-image size).
- Vite `base` is `/connect/preact-example/` (`vite.config.ts`), so the built public file is served at `/connect/preact-example/qrati-connect-og.png`.
- Worker (`src/worker.ts`) strips prefix `/connect/preact-example` and fetches ASSETS. Non-HTML (`content-type` not `text/html`) is returned unchanged, so the PNG is not rewritten.

Worker HTML path (crawler GET of the landing page): prefix `/connect/preact-example` and `/connect/preact-example/` both map to `/`. HTML bodies are re-emitted only to substitute/remove GTM placeholders. Current `index.html` has no GTM comment blocks and no `__GTM_ID__`, so the GTM branch is a no-op on this document. Header reuse after body rewrite remains an unknown on the edge runtime (prior worker-HTML audit); this run did not newly prove a crawler parse failure.

## Falsification

- Missing `twitter:card` / `og:image:width|height|alt` vs React/Vue/Solid/Qwik/Angular examples is a completeness gap, not a violated Preact-host invariant. OG required tags are present; X/Twitter commonly falls back to OG. No source contract in this repo requires Twitter Card tags.
- JSON-LD is valid JSON (the `https://***@type` appearance in some tool output is redaction of `schema.org`, not a truncated document).
- Empty `VITE_ORGANIZATION_ID` and theme/consent/hash-router behavior are adjacent and previously audited; they do not change static `<head>` tags or the OG PNG.
- Production HTTP status of the live image URL was not requested (no unapproved external test). Source path + worker rewrite are consistent.

No reachable invariant was violated for this workflow.

## Verification

- Isolated worktree from preflight remote SHA `0d496f0` (`docs(bughunter): audit Preact host-controlled theme toggle (#32)`); `rev-parse --show-toplevel` matched `WORKTREE_PATH`.
- CodeGraph unindexed for this worktree; focused file reads used.
- Open PRs at preflight: none (`OPEN_PR_COUNT=0`); no overlap skip.
- No source or test changes. No tests authored.
- Tests/build/lint/type-check/install: **NOT RUN BY BUGHUNTER**.
- `git diff --check` run on the docs-only patch.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T13:06:38Z | 2026-11-05T13:07:00Z | 00:00:22 (0.4 min) | 18:36:38–18:37:00 |
| `audit` | 2026-11-05T13:07:13Z | 2026-11-05T13:09:04Z | 00:01:51 (1.9 min) | 18:37:13–18:39:04 |
| `delivery` | 2026-11-05T13:09:04Z | 2026-11-05T13:10:00Z | 00:00:56 (0.9 min) | 18:39:04–18:40:00 |
| **Total run (preflight start to finish)** | 2026-11-05T13:06:38Z | 2026-11-05T13:10:00Z | **00:03:22 (3.4 min)** | **18:36:38–18:40:00** |
| Unclassified interval between marked phases | — | — | 00:00:13 (0.2 min) | — |

Timing-table insertion occurred after this measurement snapshot.

## Sources

- `index.html`, `public/qrati-connect-og.png`, `vite.config.ts`, `src/worker.ts`, `wrangler.jsonc`
- Open Graph protocol required properties: https://ogp.me/
- Ownership map: `qrati-labs/qrati-operations` `web/ownership.html`
