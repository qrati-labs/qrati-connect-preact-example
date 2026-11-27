# BugHunter audit: Preact host SEO feature-card headings

- Run: `20261107T025438Z-fd3e265eeb18491d8d3f1db33d0983f0`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `cc39327ea4c3087c2d91ab2b94696a197dfe3a17` (`cc39327 docs(bughunter): audit Preact live gallery embed mount (#81)`)
- Workflow: host `.seo-features-grid` / `.seo-feature-card` headings — emoji in the accessible name vs feature-map `aria-hidden` icons, heading rank, card contrast
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The “Why Developers Choose Qrati Connect” section renders four `<article class="seo-feature-card">` items whose `<h3>` text starts with a Unicode emoji (🖼️ 📸 ⭐ ⚡) plus a descriptive English title. Adjacent feature-map cards hide decorative glyphs with `aria-hidden="true"` and keep the `<h3>` text-only. Emoji in a text node are characters, not `<img>` / non-text content, so [WCAG 2.2 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) does not require a separate text alternative. Visible heading text after each emoji satisfies [2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html). Light `--page-heading` `#213547` / `--page-muted` `#4a5568` on the card composite over `#fff7f1` measure **12.43:1** / **7.42:1**; dark `--page-text` 0.87 / `--page-muted` 0.6 on card 0.04 over `#0f0f14` measure **13.41:1** / **6.96:1** (WCAG 2.2 [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) 4.5:1). Rank is page `h1` → section `h2#features-heading` → card `h3`.

## Trace

1. Entry: `src/main.tsx` renders `<App />`; `src/app.tsx` emits `<section class="seo-section" aria-labelledby="features-heading">`.
2. Inputs: static host copy. Theme from the blocking `index.html` script and `initTheme()` (`data-theme`, `html.dark`).
3. Authz: none; public example.
4. Markup (four articles): `h3` is emoji + title (`Live Event Photo Wall`, `Guest Media Uploads`, `Reactions & Contests`, `Native Web Component`); body `p` uses `--page-muted`. No `aria-hidden` on the emoji; no separate icon span (unlike `.feature-map-icon`).
5. CSS (`src/index.css`): `.seo-feature-card` shares padding/border/`--card-bg` with FAQ details; `.seo-feature-card p` is `--page-muted`. No extra kicker/background wash on these cards (unlike `.answer-section`).
6. Output: sighted users see emoji + title; AT may speak the emoji name plus the heading. Section remains labeled by `features-heading`.

Open PR at selection: [#80](https://github.com/qrati-labs/qrati-connect-preact-example/pull/80) `fix(a11y): raise light-theme cookie-consent off-toggle contrast` — `src/index.css` `--cc-toggle-off-bg`, consent contrast test, docs. Paths/behavior do not overlap this host SEO-card heading workflow.

## Falsification

- **Emoji as 1.1.1 non-text:** rejected. 1.1.1 applies to non-text content (`img`, icon fonts used as images, etc.). These are UTF-8 characters inside the heading text node.
- **2.4.6 missing/ambiguous heading:** rejected. Each `h3` has a unique English phrase after the emoji; the section `h2` names the group.
- **Feature-map `aria-hidden` inconsistency:** completeness, not a broken name or missing heading. Hiding the emoji would be polish, not a required repair of a failed control.
- **Contrast failure on card wash:** rejected. These cards use opaque-enough `--card-bg` over page tokens already raised in issues #69/#73/#77; computed ratios are above 4.5:1. Not the consent toggle in PR #80.
- **Skipped heading rank:** rejected. Gallery uses `h2.sr-only`, then answer/feature-map/features/FAQ/CTA `h2`s, then card `h3`s.
- Adjacent, out of scope: cookie-consent toggle contrast (open #80 / #79), gallery embed, keyboard landmarks, Google Fonts.

## Scope and non-goals

Preact example SEO feature-card headings only. Not adding `aria-hidden` on emoji, not cookie-consent CSS, not SDK widget internals, not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean (docs only)
- CodeGraph: unindexed for this worktree; focused reads of `src/app.tsx`, `src/index.css`, `src/main.tsx`
- Primary docs: [WCAG 2.2 Understanding 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html), [2.4.6](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html), [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

## Limitations

No browser computed-style capture, no screen-reader session, no axe run. Contrast ratios use source tokens, simple sRGB alpha compositing, and the WCAG relative-luminance formula.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-07T02:54:38Z | 2026-11-07T02:54:59Z | 00:00:21 (0.3 min) | 08:24:38–08:24:59 |
| `audit` | 2026-11-07T02:55:18Z | 2026-11-07T03:00:15Z | 00:04:57 (5.0 min) | 08:25:18–08:30:15 |
| `delivery` | 2026-11-07T03:00:15Z | 2026-11-07T03:01:40Z | 00:01:24 (1.4 min) | 08:30:15–08:31:40 |
| **Total run (preflight start to finish)** | 2026-11-07T02:54:38Z | 2026-11-07T03:01:40Z | **00:07:02 (7.0 min)** | **08:24:38–08:31:40** |
| Unclassified interval between marked phases | — | — | 00:00:19 (0.3 min) | — |

- Preflight: 08:24:38–08:24:59 IST (7 Nov)
- Audit: 08:25:18–08:30:15 IST (7 Nov)
- Delivery: 08:30:15–08:31:40 IST (7 Nov)
- Total: 08:24:38–08:31:40 IST (7 Nov)

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
