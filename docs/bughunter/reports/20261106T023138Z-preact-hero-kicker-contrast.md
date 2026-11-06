# BugHunter audit: Preact host dark-theme hero-kicker contrast

- Run: `20261106T023138Z-10f1c26ee3fd4d56b118d335c14077a5`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `e791349a4cdfb1a1e52aee778a7aeb708771a78a` (`e791349 fix(a11y): raise light-theme brand-accent text contrast (#74)`)
- Workflow: host `.hero-kicker` (“Qrati Connect Demo”) text vs chip background in light and dark themes
- Disposition: P3 confirmed; opaque dark-theme chip + regression test
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/75
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Dark-theme hero kicker fails WCAG contrast on translucent chip** — **Evidence:** `src/app.tsx` always renders `<p class="hero-kicker">Qrati Connect Demo</p>`. `src/index.css` set a theme-agnostic chip `background: rgba(255, 255, 255, 0.78)` and `color: #cc3d00` at `font-size: 0.68rem` / `font-weight: 800`. Dark theme is applied before paint from `qc-theme` or `prefers-color-scheme: dark`. Compositing 78% white over dark `--page-bg` `#0f0f14` (and the hero-area gradient start `#111111`) yields ~`#cacbcc`; `#cc3d00` vs that chip is **~3.03–3.06:1**. WCAG 2.2 [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) requires **4.5:1** for normal text (large-scale exception is 18pt or 14pt bold; 0.68rem is neither). **Failure:** dark-theme visitors cannot reliably read the demo kicker. Existing `tests/brand-accent-contrast.test.cjs` only compared kicker color to **opaque white**, so it missed this path. **Fix:** `[data-theme='dark'] .hero-kicker { background: #ffffff; }` so the chip is opaque and `#cc3d00` on white is ~4.96:1. Light theme is unchanged (~4.9:1 on the light page). **Test:** `tests/hero-kicker-contrast.test.cjs` — `node --test tests/hero-kicker-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `index.html` blocking theme script + `src/app.tsx` `initTheme()` set `data-theme` / `.dark` before the hero paints.
2. Inputs: `localStorage['qc-theme']` or `prefers-color-scheme: dark`; kicker is static host copy.
3. Authz: none; public example.
4. Validation: none; colors are hardcoded, not theme tokens.
5. Output: dark-theme kicker sat on a grey-tinted chip; post-fix the dark chip is solid white and meets 4.5:1.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Brand-accent audit (#73):** covered `--brand-accent` / kicker color against opaque white, not the translucent chip composite in dark theme.
- **CTA / consent primary contrast (#69, #71):** different elements and tokens.
- **Large-text 3:1 exception:** 0.68rem bold is below 14pt (~18.67px); 1.4.3 normal-text 4.5:1 applies. ~3.05:1 also fails a large-text 3:1 check only by a hair on some composites, but the size exception does not apply.
- **Incidental text:** the kicker is visible page chrome, not hidden/disabled/decorative-only.
- **Light theme already failing:** 78% white over `#fff7f1` still ~4.56–4.89:1; out of scope.

## Scope and non-goals

Host hero-kicker contrast only. Not cookie-consent buttons, CTA, `--brand-accent` links, SDK widget chrome, or other example repos. No production fetch.

## Tests and verification

- Authored: `tests/hero-kicker-contrast.test.cjs`
- Command: `node --test tests/hero-kicker-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [WCAG 2.2 Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) (retrieved 2026-11-06): normal text ≥ 4.5:1; large-scale ≥ 3:1

## Limitations

No browser screenshot of the dark kicker. Contrast is computed from source CSS (sRGB relative luminance) including rgba compositing over `--page-bg`; `backdrop-filter: blur(10px)` is not simulated. No live `qrati.com` request.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER
