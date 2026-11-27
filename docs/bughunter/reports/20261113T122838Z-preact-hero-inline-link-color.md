# BugHunter audit: Preact host hero inline-link use of color

- Run: `20261113T122838Z-1d561d3d703f44c7b2e96fa4dc3b394d`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `be1f4b24d3d07272f3ec78857d1ac313cf7c54ee` (`be1f4b2 docs(bughunter): audit Preact host viewport pinch-zoom (#86)`)
- Workflow: in-sentence hero links (“Qrati” in `.hero h1` and `.hero-copy`) vs surrounding text — WCAG 2.2 1.4.1 Use of Color
- Disposition: P3 confirmed; underline in-sentence hero links; issue #87
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/87
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Hero inline links are distinguished only by color below 3:1** — **Evidence:** `src/app.tsx` puts `<a href="https://qrati.com">Qrati</a>` inside `<h1>` and `.hero-copy` amid static text. `src/index.css` sets those anchors to `--brand-accent` and `.hero a { text-decoration: none }`. Link vs surrounding-text contrast (WCAG relative luminance): light copy `#cc3d00` / `#4a5568` **1.52:1**; dark copy `#ff6b35` / `rgba(255,255,255,0.6)` over `#0f0f14` **1.07:1**; dark heading `#ff6b35` / `#f0f0f5` **2.50:1**. Light heading `#cc3d00` / `#1a1a2e` is 3.44:1. **Failure:** WCAG 2.2 [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (Level A) allows hue plus lightness only when that lightness contrast is **≥ 3:1**; otherwise a non-color cue is required. Same-styled links (no color difference) are explicitly out of 1.4.1; these links *are* color-coded. **Fix:** underline `.hero h1 a` and `.hero-copy a` only. **Test:** `node --test tests/hero-inline-link-use-of-color.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` renders `App`; `src/app.tsx` hero header is static host chrome.
2. Inputs: default/OS or saved theme (`data-theme`); no user-controlled href.
3. Authz: none; public example.
4. Style: shared `.hero a, .footer a { text-decoration: none }` also covers in-sentence hero links (action pills stay un-underlined via higher-specificity pill layout, not this new rule).
5. Output: “Qrati” in the heading and body copy is a new-tab link (`rel="noopener noreferrer"`) that previously looked like tinted text.

Open PR at selection: [#80](https://github.com/qrati-labs/qrati-connect-preact-example/pull/80) light-theme cookie-consent off-toggle contrast (`--cc-toggle-off-bg`, consent test, docs). Same file `src/index.css`, different rule; behavior does not overlap this workflow.

## Falsification

- **1.4.1 does not require underlines:** rejected when color *is* the distinguisher and link-vs-text luminance is below 3:1 (Understanding SC 1.4.1 lightness note).
- **Same-color links are a 1.4.1 fail:** rejected; W3C says unstyled-same-as-text links do **not** fail 1.4.1. These are accent-colored.
- **Light h1 already 3.44:1:** true for that pair only; dark h1 and both copy pairs fail. One underline rule covers all.
- **Footer / pills / CTA:** footer is a link-only nav; pills are chrome buttons; CTA is inverted fill. Not in-sentence color-only links.
- **Brand-accent 1.4.3 audits (#73):** text-vs-background, not link-vs-surrounding-text.
- Adjacent, out of scope: cookie-consent toggle (open #80 / #79).

## Scope and non-goals

Preact example in-sentence hero link affordance only. Not cookie-consent CSS, not footer nav underlines, not SDK widget, not other example repos. No production fetch.

## Tests and verification

- Authored: `tests/hero-inline-link-use-of-color.test.cjs`
- Command: `node --test tests/hero-inline-link-use-of-color.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads of `src/app.tsx`, `src/index.css`, `src/main.tsx`
- Isolated worktree from preflight remote SHA `be1f4b2`; `rev-parse --show-toplevel` matched `WORKTREE_PATH`
- Primary docs: [Understanding 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (retrieved 2026-11-13)

## Limitations

No browser computed-style or axe run. Ratios are from source tokens and the WCAG sRGB relative-luminance formula. No live page fetch.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-13T12:28:38Z | 2026-11-13T12:29:00Z | 00:00:22 (0.4 min) | 17:58:38–17:59:00 |
| `audit` | 2026-11-13T12:29:16Z | 2026-11-13T12:35:35Z | 00:06:19 (6.3 min) | 17:59:16–18:05:35 |
| `delivery` | 2026-11-13T12:35:35Z | 2026-11-13T12:36:31Z | 00:00:57 (0.9 min) | 18:05:35–18:06:31 |
| **Total run (preflight start to finish)** | 2026-11-13T12:28:38Z | 2026-11-13T12:36:31Z | **00:07:53 (7.9 min)** | **17:58:38–18:06:31** |
| Unclassified interval between marked phases | — | — | 00:00:16 (0.3 min) | — |

- Preflight: 17:58:38–17:59:00 IST (13 Nov)
- Audit: 17:59:16–18:05:35 IST (13 Nov)
- Delivery: 18:05:35–18:06:31 IST (13 Nov)
- Total: 17:58:38–18:06:31 IST (13 Nov)

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
