# BugHunter audit: Preact cookie-consent off-toggle non-text contrast

- Run: `20261106T032138Z-30af3ed6b3d343bd9df4f3192a0a49cc`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `3f2e621` (`3f2e621 fix(a11y): raise light-theme answer-section kicker contrast (#78)`)
- Workflow: host-controlled vanilla-cookieconsent analytics category toggle **off** state vs adjacent preferences chrome in light theme (WCAG 1.4.11)
- Disposition: P3 confirmed; restore library-default light `--cc-toggle-off-bg`; issue #79
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/79
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Light-theme cookie-consent off toggle fails WCAG 1.4.11** — **Evidence:** `src/app.tsx` footer **Cookie Preferences** calls `showCookiePreferences()`. `src/lib/cookieConsent.ts` registers an analytics category (`linkedCategory: 'analytics'`) with `enabled: !required`, so the switch starts **off** in opt-in / geo-required mode. `src/index.css` `#cc-main` overrode `--cc-toggle-off-bg: #9ca3af` on `--cc-cookie-category-block-bg: #fff7f1` / `--cc-bg: #ffffff`. vanilla-cookieconsent **v3.1.0** `dist/cookieconsent.css` paints `.toggle__icon { background: var(--cc-toggle-off-bg); box-shadow: 0 0 0 1px var(--cc-toggle-off-bg); }` on `.pm__section--toggle { background: var(--cc-cookie-category-block-bg); }`; knob default is white. WCAG sRGB → off-track vs category block **~2.40:1**, vs modal white **~2.54:1**, white knob vs track **~2.54:1**. **Failure:** WCAG 2.2 [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) requires **3:1** for visual information that identifies a UI component and its thumb. Necessary is `readOnly` (inactive exception); analytics is active. **Fix:** light `--cc-toggle-off-bg: #667481` (library light default) → **~4.53:1** vs `#fff7f1`, **~4.79:1** vs white / knob. Dark `--cc-toggle-off-bg: #6b7280` already **~3.5–3.7:1**; unchanged. **Test:** `tests/consent-toggle-off-contrast.test.cjs` — `node --test tests/consent-toggle-off-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` `initCookieConsent()`; footer `onClick={() => void showCookiePreferences()}`; geo-required consent modal `showPreferencesBtn: 'Manage preferences'`.
2. Inputs: default/OS light theme (`data-theme='light'`); opt-in analytics off; public example, no authz.
3. Library: v3.1.0 toggle track uses `--cc-toggle-off-bg` for fill and 1px ring; adjacent category row uses `--cc-cookie-category-block-bg`.
4. Pre-fix: host light override `#9ca3af` (gray-400) lighter than library `#667481`.
5. Output: off analytics switch is identifiable against cream/white; dark tokens untouched.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **#71 primary button text:** 1.4.3 on `--cc-btn-primary-*`; that report explicitly excluded toggle 1.4.11.
- **Inactive exception:** necessary toggle is `readOnly`; analytics is not.
- **1.4.1 Use of Color:** thumb position also signals state; 1.4.11 still requires the track/thumb to be identifiable against adjacent colors.
- **Dark theme already failing:** `#6b7280` vs `#211a18` / `#161622` is ≥ 3:1; left unchanged.
- **Library default already failing:** library light off-track `#667481` passes 3:1; this host’s override caused the miss.
- **Style preference:** 2.40:1 is below the 3:1 threshold (W3C: do not round; 2.999 would still fail).

## Scope and non-goals

Host Preact example light-theme cookie-consent **off-toggle** non-text contrast only. Not primary/secondary button text, not GTM/geo, not SDK widget, not other example repos. No production fetch.

## Tests and verification

- Authored: `tests/consent-toggle-off-contrast.test.cjs`
- Command: `node --test tests/consent-toggle-off-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html); vanilla-cookieconsent v3.1.0 `dist/cookieconsent.css` `.toggle__icon` / `.pm__section--toggle`

## Limitations

No browser computed-style capture or axe run. Ratios are from source hex tokens, library CSS (retrieved v3.1.0), and the WCAG sRGB relative-luminance formula. Knob assumed library default white (`--cc-toggle-off-knob-bg` → `--cc-toggle-on-knob-bg: #fff`); this host does not override knob tokens.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PENDING
