# BugHunter audit: Preact Google Fonts load vs cookie-consent gate

- Run: `20261105T145938Z-2b543ab961374df281940d6fde8c01d0`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `ad342cd6d8efdc1e60a5c60ae12b046b288d8222` (`ad342cd docs(bughunter): audit Worker prefix routing and SPA HTML delivery (#36)`)
- Workflow: host CSS `@import` of Google Fonts versus page-load cookie consent / Google consent mode
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. `src/main.tsx` imports `./index.css` before `initCookieConsent()`. That stylesheet `@import`s `https://fonts.googleapis.com/css2?family=Inter:…&family=Sora:…&display=swap`, so the browser requests Google Fonts CSS (and then font files) as soon as the host CSS is applied. Cookie consent only configures the `analytics` category and loads `gtm.js` after analytics is accepted (`src/lib/cookieConsent.ts` `syncGtm`). The banner copy talks about essential vs analytics cookies; it does not claim that all third-party network requests wait for a choice. `index.html` denied consent-mode defaults apply to gtag storage flags, not to CSS `@import`. Sibling Connect examples use the same Google Fonts CSS import pattern. `system-ui` remains in the font stack if the request fails. This is branding/progressive enhancement, not a broken consent-mode contract.

## Trace

1. Entry: Vite SPA boot, `src/main.tsx`.
2. Inputs: module evaluation order; no user input. `initCookieConsent` is fire-and-forget (`void`).
3. Authz: none; public example.
4. CSS side effect (`src/index.css:1-2`): bundled `vanilla-cookieconsent` CSS, then Google Fonts CSS2 URL for Inter and Sora with `display=swap`.
5. Consent path (`src/lib/cookieConsent.ts`): geo check → `CookieConsent.run` (`analytics` enabled in config) → `syncGtm` updates consent mode and injects GTM only when analytics is accepted and `VITE_GTM_ID` is set.
6. Output: page paint using Inter/Sora when the Google CSS succeeds; system fonts otherwise. GTM remains consent-gated.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Reachable Google request before the banner:** true, and expected for CSS `@import`. Not the same as loading a marketing tag.
- **Violates issue #1 denied defaults:** no. `#1` required `gtag('consent','default',…)` before page tags. That snippet is still first in `index.html`. Fonts are not gtag/GTM.
- **vanilla-cookieconsent should block CSS:** no evidence in this repo. Categories cover `necessary` and `analytics` only.
- **Broken layout if fonts.googleapis.com is blocked:** `font-family: Inter, system-ui, …` on `:root` still renders.
- **Unique to Preact:** false. Angular, Vanilla, React, Vue, Solid, Qwik, Svelte, Lit, Astro, Ember, Marko, and Next examples also `@import` Google Fonts.
- Adjacent, out of scope: empty `VITE_ORGANIZATION_ID`, worker GTM HTML rewrite, favicon, hash router (already audited).

## Scope and non-goals

Host Google Fonts CSS import vs cookie-consent/GTM gating only. Not a legal opinion on IP transfer. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: Google Fonts CSS `@import` usage (Getting Started); vanilla-cookieconsent category/callback model as implemented in `src/lib/cookieConsent.ts`

## Limitations

No live `qrati.com` request, no browser network log, no cookie set by fonts.gstatic.com observed. Consent-library behavior beyond this repo’s `CookieConsent.run` options was not executed.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

Timing table will be inserted after `finish`.
