# BugHunter audit: Preact cookie-consent persistence

- Run: `20261105T205938Z-0070942c13924bea9d794955b3ce83b2`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `647a48960416b8eddd0e5b59443f63363e1e7c90` (`647a489 docs(bughunter): audit Preact browser chrome theme-color (#55)`)
- Workflow: vanilla-cookieconsent cookie write/read across reload (`CookieConsent.run` → `cc_cookie` → `validConsent` / `autoShow`)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. After the user accepts or rejects analytics, vanilla-cookieconsent v3.1.0 persists consent in a first-party cookie using library defaults (`name: cc_cookie`, `path: /`, `expiresAfterDays: 182`, `sameSite: Lax`, `secure: true`, `domain: location.hostname`). This host does not override `cookie`. On the next page load, `CookieConsent.run` reads that cookie; `autoShow` is `required` (geo opt-in only) and the library shows the consent modal only when consent is invalid. A valid stored consent therefore does not re-prompt. `syncGtm` runs from `onConsent` / post-`run`, so Consent Mode is updated from the restored categories without requiring another click.

## Trace

1. Entry: `src/main.tsx` `void initCookieConsent()` → `src/lib/cookieConsent.ts` `CookieConsent.run`. Footer Cookie Preferences (`src/app.tsx`) awaits the same init.
2. Inputs: geo `{ required }` selects `opt-in` vs `opt-out` and `autoShow: required`. User Accept all / Reject analytics / Save preferences.
3. Authz: none; public example.
4. Persistence (vanilla-cookieconsent v3.1.0 `src/core/global.js` defaults + `src/core/config-init.js` `cookie.domain = location.hostname`): JSON cookie `cc_cookie` on the current hostname, path `/`, 182 days, Secure, SameSite=Lax.
5. Reload: `run()` parses `cc_cookie`; `validConsent()` is true when a consent id is present (no `revision` on this host). `api.js` shows the consent modal only if `_config.autoShow && !consentIsValid`.
6. Side effects: `onConsent` / post-`run` `syncGtm()` apply stored `acceptedCategory('analytics')` to gtag Consent Mode and inject `gtm.js` only when analytics is accepted, `VITE_GTM_ID` is set, and `#gtm-script` is absent (issues #29/#34/#47).
7. Output: returning visitor keeps prior analytics choice; banner stays down when the cookie is valid.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing explicit `cookie: { name: 'qrati_consent', domain: '.qrati.com', ... }` vs React/Qwik hosts:** sibling pattern, not a contract in this repository. Library defaults still persist and restore consent on `qrati.com`. Isolation from the main-site `qrati_consent` cookie is a product choice, not a failed reload.
- **`domain: location.hostname` not `.qrati.com`:** the example is served on `qrati.com` (zone route `*qrati.com/connect/preact-example*`), not a sibling subdomain that would need a parent-domain cookie.
- **`autoShow: required` hides the banner in opt-out regions even without a cookie:** intended. Opt-out does not require a prompt; `analytics.enabled: !required` plus `onConsent`/`syncGtm` still apply defaults.
- **Session-only geo cache (`qrati_geo_consent_required`):** independent of consent persistence. A new tab in the same session reuses geo mode; a new browser session re-fetches geo. Fail-closed geo was previously fixed. Not this workflow.
- **Secure cookie on `http://localhost`:** library default `secure: true` can omit the cookie on plaintext HTTP. Vite `pnpm dev` is typically `http://localhost`; that is a local-dev limitation, not a broken production `https://qrati.com` path. Not filed.
- Adjacent, out of scope: ads vs analytics Consent Mode mapping, GTM bootstrap (#34), preferences sections (#40), footer re-entry (#45), opt-in default (#47), dark mode (#50), geo lookup, worker SPA routing.

## Scope and non-goals

Host Preact example consent cookie persistence across reload only. Not a legal opinion. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused file reads used
- Library: vanilla-cookieconsent v3.1.0 `COOKIE_NAME`, `global.js` cookie defaults, `config-init.js` domain assignment, `api.js` `validConsent` / `autoShow`

## Limitations

No browser cookie jar inspection, no live `qrati.com` request, no Tag Assistant session. Library defaults taken from the v3.1.0 tagged source on GitHub.

## Timing (measured wall-clock)

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER

Timing-table insertion occurred after this measurement snapshot.
