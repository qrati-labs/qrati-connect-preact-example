# BugHunter audit: Preact opt-in analytics preference default

- Run: `20261105T173938Z-340b29441fb643218cd7cb7836946897`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `2d84c6daac457d062bd35b3bc36f74ab6de992bc` (`2d84c6d fix(consent): add footer control to reopen cookie preferences (#46)`)
- Workflow: geo opt-in cookie preferences default for the analytics category (`src/lib/cookieConsent.ts` `CookieConsent.run` categories → preferences toggle → Save preferences → `syncGtm`)
- Disposition: P3 confirmed; narrow `enabled: !required` + regression tests
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/47
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

`[P3] Opt-in cookie preferences pre-enable analytics` — **Evidence:** `src/lib/cookieConsent.ts` `initCookieConsent`; trigger is geo `{ required: true }` (or fail-closed). After issue #29, `analytics: { enabled: true }` is unconditional. vanilla-cookieconsent v3.1.0 auto-accepts `enabled` categories only in `opt-out` (`retrieveState`); in `opt-in` it still checks the preferences toggle (`createToggleLabel`: `readOnly || enabled` → `checked = true`). **Failure:** **Manage preferences** then **Save preferences** grants analytics without the user turning the category on. **Fix:** `analytics: { enabled: !required }` (sibling React/Qwik/qrati-web pattern). Opt-out (`required === false`) still defaults analytics on. **Test:** `node --test tests/consent-opt-in-analytics-default.test.cjs tests/consent-opt-out-analytics.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` `initCookieConsent()`; footer `showCookiePreferences()` after #45.
2. Inputs: geo `/api/cookie-consent-geo` or `https://qrati.com/api/cookie-consent-geo`; session cache `qrati_geo_consent_required`.
3. Authz: none; public example.
4. Mode: `required ? 'opt-in' : 'opt-out'`. Categories: necessary readonly-on; analytics `enabled: !required`.
5. Side effects: `syncGtm` on first consent / consent / change (unchanged). GTM still requires `VITE_GTM_ID`.
6. Output: opt-in preferences toggle starts off; Save without enabling analytics does not grant it. Opt-out still enables analytics by default.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Reachable:** yes. Opt-in banner includes **Manage preferences**; footer Cookie Preferences awaits init. Library sets `toggle.checked = true` when `category.enabled` and no prior consent.
- **Intentional #29 behavior:** rejected. #29 required opt-out default-on. Types document `enabled` as opt-out auto-enable (`@default false`). Unconditional `true` also pre-checks opt-in.
- **Empty `VITE_GTM_ID` means no impact:** Consent Mode flags still update on Save; GTM can be set at build time. UI still claims analytics is optional.
- **Accept all / Reject analytics:** unchanged. Defect is the pre-checked Save path.
- Adjacent, out of scope: autoClear `_ga`, `qrati_consent` cookie name, ads vs analytics split, geo fail-closed (#6), GTM bootstrap (#34), sections (#40), footer re-entry (#45).

## Scope and non-goals

Host Preact example analytics `enabled` gating only. Not a legal opinion. No production fetch. No other example repos.

## Tests and verification

- Authored: `tests/consent-opt-in-analytics-default.test.cjs`; updated `tests/consent-opt-out-analytics.test.cjs`
- Command: `node --test tests/consent-opt-in-analytics-default.test.cjs tests/consent-opt-out-analytics.test.cjs` — **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; clean at delivery
- Build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- CodeGraph: unindexed for this worktree; focused file reads used
- Issue #47 created and read back OPEN; no mapped owner to assign
- Library: vanilla-cookieconsent v3.1.0 `src/core/api.js` `retrieveState` / `src/utils/scripts.js` `retrieveEnabledCategoriesAndServices` / `src/core/modals/preferencesModal.js` `createToggleLabel`

## Limitations

No browser click of the live preferences modal in this run. Confidence is high against library toggle/`enabled` wiring and sibling `enabled: !required` hosts.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER
