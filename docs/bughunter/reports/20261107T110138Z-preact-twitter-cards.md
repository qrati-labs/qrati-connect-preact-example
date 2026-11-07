# BugHunter audit: Preact host Twitter Card social preview

- Run: `20261107T110138Z-44ee50a515784eb896210dc4797cd988`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `e6731e1` (`e6731e1 docs(bughunter): audit Preact SEO feature-card headings (#82)`)
- Workflow: X/Twitter link-preview of the example landing page — `twitter:*` meta vs Open Graph fallback (`og:title` / `og:description` / `og:image`) in static `index.html`
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented.

## Finding

No confirmed defect. The host document has **zero** `twitter:` / `name="twitter:*"` tags. It does ship the Open Graph required set plus `og:description` in static `index.html` (not Preact-rendered):

- `og:title` — `Embed an Event Gallery in Preact | Qrati Connect` (matches `<title>`)
- `og:type` — `website`
- `og:url` — `https://qrati.com/connect/preact-example` (matches canonical)
- `og:image` — `https://qrati.com/connect/preact-example/qrati-connect-og.png`
- `og:description` — present

X/Twitter Card crawlers read `twitter:*` first and fall back to `og:title`, `og:description`, and `og:image` when those twitter tags are absent. This repository does not document an X large-image card, `@site` handle, or a distinct twitter image. Missing `twitter:card` is the same class of optional social chrome as the prior Open Graph audit (`20261105T130638Z-preact-og-jsonld.md`), missing `apple-touch-icon`, and missing `theme-color`.

`twitter:card` has no Open Graph equivalent; some secondary write-ups say X may default to a small `summary` layout without it. That is a completeness gap versus Qwik/React siblings that set `summary_large_image`, not a broken gallery, consent, or OG contract on this host. This run did not fetch production `qrati.com` or exercise the X composer (no unapproved external test).

## Trace

1. Entry: crawler GET of `https://qrati.com/connect/preact-example`. HTML is static `index.html`.
2. Inputs: `<head>` meta. No `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, or `twitter:site`.
3. Authz: none; public example.
4. Transform: Vite `base: '/connect/preact-example/'`; worker (`src/worker.ts`) rewrites the mount prefix and only mutates HTML for GTM placeholders that are **not** in current `index.html`. OG image file is `public/qrati-connect-og.png` (1200×630 PNG).
5. Output: Facebook/LinkedIn-style OG preview tags are present. X can fill title/description/image from OG. Card *layout* without `twitter:card` is unspecified by this repo.

Open PR at selection: [#80](https://github.com/qrati-labs/qrati-connect-preact-example/pull/80) `fix(a11y): raise light-theme cookie-consent off-toggle contrast` — `src/index.css` `--cc-toggle-off-bg`, consent contrast test, docs. Paths/behavior do not overlap this static social-preview workflow.

## Falsification

- **Reachable missing `twitter:*` tags:** yes. Not sufficient: this host already satisfies ogp.me’s four required properties; X documents OG fallback for title/description/image.
- **Missing `twitter:card` is a broken unfurl:** not established. No repo contract requires `summary_large_image`. A smaller default summary card would still show OG title/image.
- **Sibling examples include Twitter tags:** completeness, already classified as non-defect in the 2026-11-05 OG/JSON-LD audit.
- **OG image URL wrong under Vite base:** `og:image` is an absolute URL on the mounted path; `public/qrati-connect-og.png` is copied to dist root; worker returns non-HTML unchanged. Unchanged since the OG audit.
- Adjacent, out of scope: cookie-consent toggle contrast (open #80 / #79), gallery embed, JSON-LD `SoftwareApplication`, worker GTM rewrite.

## Scope and non-goals

Preact example X/Twitter Card meta vs OG fallback only. Not adding `twitter:card`, `og:image:alt`, or `og:locale`. Not cookie-consent CSS. Not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean (docs only)
- CodeGraph: unindexed for this worktree; focused reads of `index.html`, `vite.config.ts`, `src/worker.ts`, `public/qrati-connect-og.png`
- Isolated worktree from preflight remote SHA `e6731e1`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`
- Primary docs: [Open Graph protocol](https://ogp.me/) required properties; X Card crawlers fall back to `og:title` / `og:description` / `og:image` when `twitter:*` is absent (no live X markup page retrieved this run; developer.x.com returned a shell document)

## Limitations

No X composer unfurl, no production GET, no Card Validator (retired). Card-layout default without `twitter:card` remains an unknown, not a finding.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

TIMING_TABLE_PLACEHOLDER
