# BugHunter audit: Preact cookie-consent hideFromBots / crawler

- Run: `20261106T004038Z-5d1d57b1985d4cd9956a75c4f21294da`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `b652c63` (`b652c63 docs(bughunter): audit Preact host live prefers-color-scheme (#67)`)
- Workflow: cookie-consent GUI vs crawlers — whether vanilla-cookieconsent `hideFromBots` (library default) plus this host’s `CookieConsent.run` / post-`run` `syncGtm()` overlay or starve indexing of the public Preact example
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. This host never sets `hideFromBots`. vanilla-cookieconsent v3.1.0 defaults it to `true` and, when the UA matches `/bot|crawl|spider|slurp|teoma/i` or `navigator.webdriver` is set, `run()` returns after `setConfig` without generating the consent/preferences HTML or calling `onConsent`. Page copy, gallery markup, FAQ, and JSON-LD live in `src/app.tsx` / `index.html`, not inside `#cc-main`. Crawlers that execute JS still receive that DOM. The host then calls `syncGtm()`; without retrieved consent, `acceptedCategory('analytics')` is false, Consent Mode stays denied, and `gtm.js` is not injected. That matches the fail-closed GTM contract (issues #29/#34/#47). Overlaying humans in opt-in regions is intended (`autoShow: required`).

## Trace

1. Entry: `src/main.tsx` `void initCookieConsent()` → `src/lib/cookieConsent.ts` `CookieConsent.run({ mode, autoShow, categories, onFirstConsent/onConsent/onChange: syncGtm, language })`. No `hideFromBots`, `disablePageInteraction`, or `guiOptions`.
2. Inputs: geo `/api/cookie-consent-geo` (or `https://qrati.com/api/cookie-consent-geo`) selects opt-in vs opt-out; UA / `navigator.webdriver` for bot detection (library).
3. Authz: none; public example.
4. Library (v3.1.0 `src/core/global.js` `hideFromBots: true`; `config-init.js` only flips it off when the user passes `false`; `api.js` `run`: `if (_state._botAgentDetected) return;` before `retrieveState` / `generateHtml` / `show`).
5. Side effects for bots: no `#cc-main`; host `syncGtm()` still runs and keeps analytics/ad storage denied unless a category was already accepted (state was not retrieved).
6. Output: humans in geo-required regions get the modal (`autoShow: true`); Googlebot-like UAs skip the GUI; document content is unchanged.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing explicit `hideFromBots: true`:** not a failure. v3.1.0 default is `true`; the host would have to pass `false` to show the modal to bots.
- **Modal would hide page text from Google:** rejected. `generateHtml` is skipped for detected bots; even for humans the modal is an overlay (`#cc-main`) and does not unmount `App`. Static `index.html` title/description/canonical/OG/JSON-LD do not depend on consent JS.
- **`Google-InspectionTool` and similar UAs omitted from `/bot|crawl|spider|slurp|teoma/i`:** library limitation (orestbida/cookieconsent#687), not a broken host invariant. This example does not reimplement bot detection.
- **`navigator.webdriver` hides the banner in Selenium/Playwright:** library default; not a visitor-facing defect.
- **Bot path skips `onConsent` so GTM never loads:** intended. Consent Mode defaults in `index.html` are denied; `syncGtm` does not inject `gtm.js` without analytics acceptance and `VITE_GTM_ID`.
- Adjacent, out of scope: geo fail-closed, cookie persistence (`cc_cookie` path `/`), GTM bootstrap, footer preferences re-entry, live `prefers-color-scheme`.

## Scope and non-goals

Preact example host consent GUI vs crawler/bot detection only. Not a legal opinion. Not changing library defaults. Not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean (docs only)
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: vanilla-cookieconsent v3.1.0 `src/core/global.js`, `src/core/config-init.js`, `src/core/api.js` `run` (tagged source on GitHub)

## Limitations

No Googlebot/InspectionTool session, no live `qrati.com` HTML capture, no Tag Assistant. Bot regex taken from v3.1.0 tagged source.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-06T00:40:38Z | 2026-11-06T00:41:00Z | 00:00:22 (0.4 min) |
| `audit` | 2026-11-06T00:41:12Z | 2026-11-06T00:46:16Z | 00:05:04 (5.1 min) |
| `delivery` | 2026-11-06T00:46:16Z | 2026-11-06T00:47:06Z | 00:00:50 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-06T00:40:38Z | 2026-11-06T00:47:06Z | **00:06:28 (6.5 min)** |
| Unclassified interval between marked phases | — | — | 00:00:12 (0.2 min) |

- Preflight: 06:10:38–06:11:00 IST (6 Nov)
- Audit: 06:11:12–06:16:16 IST (6 Nov)
- Delivery: 06:16:16–06:17:06 IST (6 Nov)
- Total: 06:10:38–06:17:06 IST (6 Nov)

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
