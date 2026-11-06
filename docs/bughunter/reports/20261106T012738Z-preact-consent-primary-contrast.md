# BugHunter audit: Preact cookie-consent primary button contrast

- Run: `20261106T012738Z-c8e27731e9bb44ffb38be7be3c476c97`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `a598ea22bec70d069329abd1703c1559b60503cb` (`a598ea2 fix(a11y): use a WCAG-passing fill for the primary CTA (#70)`)
- Workflow: host-controlled vanilla-cookieconsent primary actions (`Accept all` / `Save preferences`) white-on-fill contrast in light and dark themes
- Disposition: P3 confirmed; darken `--cc-btn-primary-bg` / dark hover; issue #71
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/71
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Cookie-consent primary buttons fail WCAG contrast in both themes** — **Evidence:** `src/index.css` `#cc-main` and `html.dark #cc-main, [data-theme='dark'] #cc-main` set `--cc-btn-primary-bg: #ff4800` and `--cc-btn-primary-color: #ffffff`. WCAG sRGB relative luminance → **3.40:1**. Dark hover `--cc-btn-primary-hover-bg: #ff6b35` → **2.84:1**. vanilla-cookieconsent v3.1.0 `.cm__btn` / `.pm__btn` use those variables at `font-size: .82em` of `#cc-main { font-size: 16px }` (**13.12px**, `font-weight: 600`). **Failure:** WCAG 2.2 SC 1.4.3 requires 4.5:1 for normal text; 13.12px/600 is not large text (18pt/24px or 14pt/~18.7px bold). Reachable via geo-required `autoShow` modal and footer Cookie Preferences. **Fix:** `--cc-btn-primary-bg: #cc3d00` (~4.96:1) in both themes; dark hover `#ff6b35` → `#d93d00` (~4.55:1), matching light hover. **Test:** `tests/consent-primary-contrast.test.cjs` — `node --test tests/consent-primary-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` calls `initCookieConsent()`; `src/lib/cookieConsent.ts` `CookieConsent.run` with `acceptAllBtn: 'Accept all'` and preferences `savePreferencesBtn: 'Save preferences'`. Footer `showCookiePreferences()` reopens the preferences modal.
2. Inputs: host theme (`data-theme` / `html.dark` / `cc--darkmode` on `documentElement`); geo `required: true` shows the consent modal.
3. Authz: none; public example.
4. Pre-fix CSS: light and dark `--cc-btn-primary-bg: #ff4800`; dark hover `#ff6b35`. Library default primary is `#30363c` on `#fff`; this repo overrides it.
5. Library paint: `#cc-main { font-size: 16px }`; `.cm__btn` and `.pm__btn` `{ font-size: .82em; font-weight: 600; color: var(--cc-btn-primary-color); background: var(--cc-btn-primary-bg) }`.
6. Post-fix: `--cc-btn-primary-bg: #cc3d00`; both-theme hover `#d93d00`. `--cc-toggle-on-bg` and secondary buttons unchanged.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Brand orange is intentional:** readable primary consent labels are still required. 3.40:1 / 2.84:1 on Accept all is not a style preference.
- **Large-text exception (3:1):** buttons are 13.12px / weight 600. Large text is 18pt (24px) or 14pt bold (~18.7px). SC 1.4.3 normal-text threshold applies. Dark hover 2.84:1 also fails 3:1.
- **Library chrome / out of scope of #69:** #69 covered `.btn-cta-primary` and named `--cc-btn-primary-*` as adjacent. This host **overrides** library tokens; that is this workflow.
- **Secondary buttons:** light `#1a1a2e` on `#fff0e9` (~15.3:1) and dark `#f0f0f5` on `#2a2020` (~13.9:1) already pass.
- **Computed contrast rounding:** W3C says not to round; 3.40 and 2.84 are both under 4.5 without rounding.

## Scope and non-goals

Host Preact example cookie-consent primary button text contrast only. Not toggle/switch non-text contrast (1.4.11), not other example repos, no production fetch.

## Tests and verification

- Authored: `tests/consent-primary-contrast.test.cjs`
- Command: `node --test tests/consent-primary-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum); vanilla-cookieconsent v3.1.0 `dist/cookieconsent.css` `.cm__btn` / `.pm__btn`

## Limitations

No browser computed-style capture or axe run. Ratios are from source hex tokens and the WCAG sRGB relative-luminance formula. Button metrics are from the pinned library CSS, not a live layout.

## Timing (measured wall-clock)

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PENDING
