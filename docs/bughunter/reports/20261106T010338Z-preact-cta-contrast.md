# BugHunter audit: Preact host primary CTA contrast

- Run: `20261106T010338Z-8343f7bf786f43d898e90e8b135e3d35`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `8705c72` (`8705c72 docs(bughunter): audit Preact consent hideFromBots (#68)`)
- Workflow: host primary conversion control (`.btn-cta-primary`) white-on-accent contrast in light and dark `data-theme`
- Disposition: P3 confirmed; split `--cta-bg` from `--brand-accent`; issue #69
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/69
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Primary CTA white-on-accent text fails WCAG contrast in both themes** — **Evidence:** `src/app.tsx` `.btn-cta-primary` (“Host Your Event on Qrati →”); `src/index.css` `background: var(--brand-accent); color: #fff`. Light `--brand-accent: #e14f00` → **3.95:1** vs white; dark `--brand-accent: #ff6b35` → **2.84:1**. Rule has no `font-size`/`font-weight` (16px regular = WCAG normal text). **Failure:** WCAG 2.2 SC 1.4.3 Contrast (Minimum) requires 4.5:1 for normal text; dark 2.84:1 is also below the 3:1 large-text floor. Dark theme lightens `--brand-accent` so it still works as *page text*, which makes the inverted button worse. **Fix:** `--cta-bg: #cc3d00` in both themes; CTA uses that token (~4.96:1 with white). **Test:** `tests/cta-contrast.test.cjs` — `node --test tests/cta-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` renders `App`; SEO CTA section in `src/app.tsx` emits `<a class="btn-cta-primary" href="https://qrati.com" …>`.
2. Inputs: host theme from blocking `index.html` script / `initTheme` / `.theme-toggle` (`data-theme='light'|'dark'` on `documentElement`).
3. Authz: none; public example.
4. Pre-fix CSS: `[data-theme='light'] --brand-accent: #e14f00`; `[data-theme='dark'] --brand-accent: #ff6b35`; `.btn-cta-primary { background: var(--brand-accent); color: #fff !important; }`. Contrast via WCAG relative luminance (sRGB).
5. Sibling uses of `--brand-accent` (hero links, kickers, `.cta-highlight`) are text-on-page, not this inverted control. Cookie-consent `--cc-btn-primary-*` is library chrome and out of scope.
6. Post-fix: `--cta-bg: #cc3d00` in both themes; `.btn-cta-primary` background uses `--cta-bg`. `--brand-accent` unchanged.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Brand orange is intentional:** readable CTA label is still required. 2.84:1 on the only host conversion button is not a style preference.
- **Large-text exception (3:1):** CTA is default 16px / weight 400. Large text is 18pt (24px) or 14pt bold (~18.7px). SC 1.4.3 normal-text threshold applies. Dark 2.84:1 also fails 3:1.
- **Computed contrast rounding:** W3C says not to round; 3.95 and 2.84 are both under 4.5 without rounding.
- **Keyboard-nav audit:** covered focus-visible/landmarks, not 1.4.3.
- Adjacent, out of scope: cookie-consent button colors, SEO kicker/hero accent-as-text, SDK chrome, Google Fonts, hash router.

## Scope and non-goals

Host Preact example primary CTA contrast only. Not a full WCAG audit. Not other example repos. No production fetch.

## Tests and verification

- Authored: `tests/cta-contrast.test.cjs`
- Command: `node --test tests/cta-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)

## Limitations

No browser computed-style capture or axe run. Ratios are from source hex tokens and the WCAG sRGB relative-luminance formula.

## Timing (measured wall-clock)

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-06T01:03:38Z | 2026-11-06T01:04:00Z | 00:00:22 (0.4 min) |
| `audit` | 2026-11-06T01:04:19Z | 2026-11-06T01:11:11Z | 00:06:53 (6.9 min) |
| **Total run (preflight start to finish)** | 2026-11-06T01:03:38Z | 2026-11-06T01:11:11Z | **00:07:33 (7.5 min)** |
| Unclassified interval between marked phases | — | — | 00:00:18 (0.3 min) |

- Preflight: 06:33:38–06:34:00 IST (6 Nov)
- Audit: 06:34:19–06:41:11 IST (6 Nov)
- Total: 06:33:38–06:41:11 IST (6 Nov)

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
