# BugHunter audit: Preact host canonical vs trailing-slash mount

- Run: `20261110T070738Z-b600bea4bd394976bca7e43119b1c38d`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `253ecf98bcb8d48af8fff33b53be5d8e87660c80` (`253ecf9 docs(bughunter): audit Preact host theme prop sync to Connect widget (#84)`)
- Workflow: document URL identity for `/connect/preact-example` vs `/connect/preact-example/` — `rel=canonical`, `og:url`, sitemap `loc`, Vite `base`, Worker prefix rewrite, Cloudflare Assets `html_handling`
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host picks one canonical document URL without a trailing slash and repeats it in Open Graph and the sitemap. Vite `base: '/connect/preact-example/'` is the asset prefix, not a second document identity. Cloudflare Assets default `html_handling: auto-trailing-slash` only redirects paths that match HTML files/folders inside `dist`; this mount is a prefixed SPA fallback, not `dist/connect/preact-example/index.html`. Google Search consolidates slash variants when `rel=canonical` is consistent. A 301 between the two mount URLs is optional hardening, not a broken gallery, consent, or indexing contract on this host.

## Trace

1. Entry: crawler or browser GET of `https://qrati.com/connect/preact-example` or `https://qrati.com/connect/preact-example/`.
2. Inputs: static `index.html` `<link rel="canonical">` and `og:url` (both `https://qrati.com/connect/preact-example`); `public/sitemap.xml` `<loc>` same URL; `vite.config.ts` `base: '/connect/preact-example/'`; `wrangler.jsonc` route `*qrati.com/connect/preact-example*`, `assets.not_found_handling: "single-page-application"`, no `html_handling` override, no `assets.base_path`.
3. Authz: none; public example.
4. Worker (`src/worker.ts`): `/connect/preact-example` and `/connect/preact-example/` both rewrite to `/` before `env.ASSETS.fetch`. Compatibility date `2026-07-06` plus SPA `not_found_handling` means browser **navigation** requests can skip the User Worker and receive `dist/index.html` (prior worker SPA audit).
5. Cloudflare HTML handling (docs, `auto-trailing-slash` default): 307s apply to assets such as `/file.html` vs `/folder/index.html` in `dist`. Dist root is `index.html`, not a `/connect/preact-example/` folder, so slash policy for the public mount is SPA fallback, not those 307 rules.
6. Output: both mount URLs can serve the same HTML shell; that shell declares a single canonical without a slash. Script/style URLs use the Vite base **with** slash (`/connect/preact-example/…`).

Open PR at selection: [#80](https://github.com/qrati-labs/qrati-connect-preact-example/pull/80) light-theme cookie-consent off-toggle contrast (`src/index.css` `--cc-toggle-off-bg`, consent contrast test, docs). Paths/behavior do not overlap this canonical/slash workflow.

## Falsification

- **Slash and no-slash both 200:** possible for SPA fallback. Not sufficient for a defect: Google’s duplicate-URL guidance treats `rel=canonical` as the consolidator; this host’s canonical, `og:url`, and sitemap `loc` agree.
- **Vite `base` trailing slash contradicts canonical:** false. `base` prefixes built asset URLs; it does not require the document URL to end in `/`.
- **Missing 301 is duplicate content:** not established. Canonical is present and consistent. Redirects are stronger but not required by this repo’s SEO contract (same class as missing `twitter:card` / `theme-color`).
- **`html_handling` 307 fights the canonical:** not evidenced. There is no `dist/connect/preact-example/index.html` for auto-trailing-slash to canonicalize as a folder.
- **Worker should emit 301:** navigations often never hit `src/worker.ts`. Adding redirects would be a new routing feature, not a fix for a missing tag.
- Adjacent, out of scope: cookie-consent toggle contrast (open #80 / #79), host theme prop sync (today #84), gallery embed, GTM, robots.txt at a subdirectory.

## Scope and non-goals

Host document identity (`canonical` / `og:url` / sitemap) vs trailing-slash mount and Vite asset base only. Not live HTTP to `qrati.com`, not Search Console, not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads of `index.html`, `vite.config.ts`, `wrangler.jsonc`, `src/worker.ts`, `public/sitemap.xml`, `public/robots.txt`
- Isolated worktree from preflight remote SHA `253ecf9`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`
- Primary docs: Cloudflare Workers static assets HTML handling (`auto-trailing-slash` default); Google Search “Consolidate duplicate URLs”

## Limitations

No live fetch of `qrati.com/connect/preact-example` vs the slash variant. SPA navigation vs User Worker split is from Cloudflare docs plus prior worker audit, not an edge response captured in this run.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

<!-- TIMING_TABLE -->
