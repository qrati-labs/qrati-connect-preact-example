# BugHunter audit: Preact cookie-consent preferences sections

- Run: `20261105T154238Z-0c56509c18c5411db8fec32f485357d4`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `fc8cfdf` (`fc8cfdf fix(config): fall back to public demo organization id (#39)`)
- Workflow: cookie-consent banner **Manage preferences** → preferences modal category sections
- Disposition: P3 confirmed; empty `preferencesModal.sections`; issue #40
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/40
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

`[P3] Cookie preferences modal has no category sections` — **Evidence:** `src/lib/cookieConsent.ts` `CookieConsent.run` language config sets `showPreferencesBtn: 'Manage preferences'` and `preferencesModal.sections: []`. vanilla-cookieconsent v3.1.0 `createPreferencesModal` iterates `modalData.sections || []` and creates category toggles only when `section.linkedCategory` names a defined category. Reachable when geo consent is required (`mode: 'opt-in'`, `autoShow: true`). **Failure:** the advertised preferences UI has no necessary/analytics sections, so visitors cannot inspect or toggle optional analytics in that dialog (footer Accept all / Reject analytics still exist). **Fix:** add `linkedCategory: 'necessary'` and `linkedCategory: 'analytics'` sections. **Test:** `tests/consent-preferences-sections.test.cjs` via `node --test tests/consent-preferences-sections.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` `void initCookieConsent()`.
2. Inputs: geo `/api/cookie-consent-geo` or `https://qrati.com/api/cookie-consent-geo`; sessionStorage cache `qrati_geo_consent_required`.
3. Authz: none; public example.
4. Consent run (`src/lib/cookieConsent.ts`): `categories.necessary` (readOnly) and `categories.analytics`; consent modal includes **Manage preferences**.
5. Preferences modal: previously `sections: []` → library renders title/close/footer only. After fix, two sections with `linkedCategory`.
6. Side effects: unchanged `syncGtm` on first consent / consent / change.
7. Output: preferences dialog lists necessary (locked) and analytics (optional).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Reachable:** yes on the geo-required banner path. Opt-out (`autoShow: false`) hides the banner; this issue is the Manage preferences control on the shown modal.
- **Intentional empty demo:** rejected. The same button is present; sibling Connect examples (React, Qwik, Vue, Solid, Svelte, Next, Angular) populate `necessary` + `analytics` sections. Library types require `sections: Section[]` and only empty-array-skip in `createPreferencesModal`.
- **Accept/Reject on the preferences footer make sections unnecessary:** they do not create the category list or toggles the button promises. Save preferences with no toggles cannot change analytics independently of those two buttons.
- **Library crash on `[]`:** no; empty array is handled. The defect is missing preference content, not an exception.
- **Lit example has the same empty `sections`:** out of scope (different repository).
- Adjacent, out of scope: GTM bootstrap (#34), opt-out default (#29), geo fail-closed (#6).

## Scope and non-goals

Host Preact example cookie preferences sections only. Not a legal opinion. No production fetch. No other example repos.

## Tests and verification

- Authored: `tests/consent-preferences-sections.test.cjs`
- Command: `node --test tests/consent-preferences-sections.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean on the source patch
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: vanilla-cookieconsent v3.1.0 `createPreferencesModal` (`sectionsData.forEach`, `linkedCategory` toggle creation); [Configuration reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html)

## Limitations

No browser execution of the consent GUI. Geo API not called. Sibling example contrast is source-only.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER
