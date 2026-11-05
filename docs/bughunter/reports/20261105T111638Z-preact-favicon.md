# BugHunter audit: Preact favicon delivery

- Run: `20261105T111638Z-cef41aa58f9449d399b54b730c17e499`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `95cc3a8d37778622a99f6a9c5b17447d5e04cb08` (`95cc3a8 fix(theme): validate stored preference (#17)`)
- Workflow: document favicon request for the example mounted at `/connect/preact-example`
- Disposition: P3 confirmed; narrow source fix
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/27
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

`[P3] Favicon resolves outside the mounted example path on the canonical URL` — **Evidence:** `index.html` canonical `https://qrati.com/connect/preact-example` (no trailing slash) plus `href="./qrati-logo-square.svg"`; `urllib.parse.urljoin` / WHATWG `URL` resolve that pair to `https://qrati.com/connect/qrati-logo-square.svg`. `src/worker.ts` rewrites only `/connect/preact-example`. **Failure:** the tab icon is requested from `/connect/` instead of the copied `public/qrati-logo-square.svg` under the Worker mount. **Fix:** `href="%BASE_URL%qrati-logo-square.svg"` so Vite substitutes `base: '/connect/preact-example/'`, yielding an absolute path that still resolves correctly against the no-slash canonical URL. **Test:** `node --test tests/favicon-href.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: browser loads the example HTML (`index.html`) at the canonical/document URL.
2. Inputs: `<link rel="icon">` href; document base URL is the document URL (no `<base>` tag).
3. Transform: relative `./` drops the final `preact-example` segment (RFC 3986 / WHATWG).
4. Persistence/side effects: GET for the icon. Worker prefix rewrite does not apply to `/connect/qrati-logo-square.svg`.
5. Output: missing or wrong icon on the advertised URL. Trailing-slash document URLs happened to work.

Vite public-dir contract (https://vite.dev/guide/assets): public files are copied as-is and should be referenced with a root-absolute path, not a relative path beside `index.html`. Nested `base` is applied via `%BASE_URL%` in HTML.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

Sibling icon links in this repository: only this one `rel="icon"` href.

## Scope and non-goals

Favicon delivery only. Not robots/sitemap/Open Graph, not JS/CSS bundle routing, not other example repositories.

## Tests and verification

- Authored: `tests/favicon-href.test.cjs`
- Command: `node --test tests/favicon-href.test.cjs` — **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- Build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**

## Limitations

No live HTTP request to qrati.com, no `vite build` inspection of `dist/index.html`, and no browser rendering. Confidence is high for source-level URL resolution and Worker prefix mismatch; production HTML is the Vite-transformed `index.html`.

## Timing

Timing table is inserted from the ledger after `finish` (see update before merge).
