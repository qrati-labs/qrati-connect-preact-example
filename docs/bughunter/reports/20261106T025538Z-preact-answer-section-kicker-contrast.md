# BugHunter audit: Preact host light-theme answer-section kicker contrast

- Run: `20261106T025538Z-416bd1ab738047748858193d5348149b`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `42c514670ebcbc88247708c640ac43b4c62c97f7` (`42c5146 fix(a11y): raise dark-theme hero-kicker contrast (#76)`)
- Workflow: host `.answer-section .seo-kicker` (“The short answer”) vs the answer-card orange wash in light theme
- Disposition: P3 confirmed; opaque light-theme card gradient; issue #77
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/77
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Light-theme answer-section kicker fails WCAG contrast on orange wash** — **Evidence:** `src/app.tsx` renders `<section class="answer-section">` with `<span class="seo-kicker">The short answer</span>`. `src/index.css` `.seo-kicker { color: var(--brand-accent) }` (light `#cc3d00`) on `.answer-section { background: linear-gradient(135deg, rgba(255,72,0,.1), var(--card-bg)) }` where light `--card-bg` is `rgba(255,255,255,0.7)`. The kicker is in the first grid cell at the 135deg start. Compositing the translucent stops over page `#fff7f1` yields ~**4.15:1** at the orange stop and ~**3.70:1** at mid-gradient peach `rgb(255,214,196)`. `.seo-kicker` is `font-weight: 800` with no `font-size` (~16px): WCAG normal text. **Failure:** WCAG 2.2 [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) requires **4.5:1**. Issue #73 measured `--brand-accent` against opaque page white / `#fff7f1`, not this card wash. **Fix:** `[data-theme='light'] .answer-section { background: linear-gradient(135deg, #fff7f1, #ffffff); }` so `#cc3d00` is **4.68:1** / **4.96:1** on those opaque stops. Dark theme keeps the existing wash (`#ff6b35` ~**6.1:1**). **Test:** `tests/answer-section-kicker-contrast.test.cjs` — `node --test tests/answer-section-kicker-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `index.html` blocking theme script + `src/app.tsx` `initTheme()` set `data-theme` before the answer section paints.
2. Inputs: default/OS light theme (or saved `qc-theme=light`); kicker copy is static host chrome.
3. Authz: none; public example.
4. Pre-fix: theme-agnostic translucent orange→`--card-bg` gradient under `--brand-accent` kicker.
5. Output: light-theme kicker sat on peach; post-fix the light card is an opaque warm-to-white gradient that meets 4.5:1.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Brand-accent audit (#73):** covered `--brand-accent` / other kickers against page white, not the answer-card composite.
- **Hero-kicker chip (#75):** different element and dark-theme translucent white chip.
- **CTA / consent primary (#69, #71):** inverted white-on-fill controls.
- **Large-text 3:1 exception:** 16px / weight 800 is below 14pt (~18.67px) bold; 1.4.3 normal-text 4.5:1 applies. 3.70:1 also fails 3:1.
- **Dark theme also fails:** `#ff6b35` on the wash over `#0f0f14` is ~6.1:1; left unchanged.
- **Incidental text:** “The short answer” is visible section chrome, not decorative-only.

## Scope and non-goals

Host Preact example light-theme answer-section kicker contrast only. Not cookie-consent buttons, CTA fill, hero-kicker chip, SDK widget, or other example repos. No production fetch.

## Tests and verification

- Authored: `tests/answer-section-kicker-contrast.test.cjs`
- Command: `node --test tests/answer-section-kicker-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)

## Limitations

No browser computed-style capture or axe run. Ratios are from source tokens, CSS gradient interpolation (including alpha), compositing over `--page-bg`, and the WCAG sRGB relative-luminance formula.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-06T02:55:38Z | 2026-11-06T02:56:00Z | 00:00:22 (0.4 min) | 08:25:38–08:26:00 |
| `audit` | 2026-11-06T02:56:14Z | 2026-11-06T03:05:42Z | 00:09:28 (9.5 min) | 08:26:14–08:35:42 |
| **Total run (preflight start to finish)** | 2026-11-06T02:55:38Z | 2026-11-06T03:05:42Z | **00:10:04 (10.1 min)** | **08:25:38–08:35:42** |
| Unclassified interval between marked phases | — | — | 00:00:14 (0.2 min) | — |

- Preflight: 08:25:38–08:26:00 IST (6 Nov)
- Audit: 08:26:14–08:35:42 IST (6 Nov)
- Total: 08:25:38–08:35:42 IST (6 Nov)

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
