# BugHunter audit: Preact host keyboard navigation

- Run: `20261105T235638Z-ce5e27ede53b48a2916163d201b4e5ee`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `c0f69614d971cf1f9c051f7a08f2244d310c97da` (`c0f6961 docs(bughunter): audit Preact host prefers-reduced-motion (#65)`)
- Workflow: host keyboard path — DOM order, landmarks / bypass blocks, and focus-visible on host controls (theme toggle, hero/CTA/footer links, FAQ disclosures, cookie preferences)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host document exposes `<header class="hero">`, `<main class="content-shell">`, and `<footer class="footer">` plus a footer `<nav aria-label="Footer navigation">`. That is an accepted WCAG 2.4.1 bypass-blocks technique (HTML5 landmarks / ARIA11); a skip link is not required when a `main` landmark exists. Host interactive controls are in DOM order that matches reading order (fixed theme toggle first, then hero, gallery, SEO/FAQ/CTA, footer). The stylesheet never sets `outline: none` / `outline: 0`. Custom `:focus-visible` rings exist on `.theme-toggle` and `.footer-cookie-btn`; remaining host links, FAQ `<summary>`, and the CTA rely on the user-agent focus indicator. Connect widget tab stops are SDK-owned.

## Trace

1. Entry: `src/main.tsx` renders `<App />` into `#app`. `src/app.tsx` emits the theme button, then `.page-shell` → `header.hero` → `main.content-shell` (gallery, FAQ, CTA) → `footer.footer`.
2. Inputs: keyboard Tab / Shift+Tab; no skip-link target. Theme toggle has no `type` attribute (HTML default `submit`) but is not inside a form.
3. Authz: none; public example.
4. Landmarks: `header`, `main`, `footer`, footer `nav`. Action pills use `aria-label="Example links"` on a `<div>`, not a second `nav`. FAQ uses native `<details>`/`<summary>` (keyboard-activatable). Cookie control is `<button type="button">`.
5. Focus CSS (`src/index.css`): `.theme-toggle:focus-visible` and `.footer-cookie-btn:focus-visible` use a 2px brand outline. No global outline reset. `.btn-cta-primary` sets color/`text-decoration` only.
6. Output: keyboard users can move through host chrome with visible focus (UA or custom). The gallery block is inside `main`, so AT/browser landmark navigation can skip it. Cookie-consent `#cc-main` and Connect internals are library-owned.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing skip link:** not a 2.4.1 failure here. `main` is present. WCAG 2.4.1 is satisfied by a skip link **or** another bypass mechanism; landmarks are documented as sufficient when supported (ARIA11 / HTML5 sections).
- **Theme toggle lacks `type="button"`:** not reachable as a submit; there is no enclosing `<form>`.
- **CTA / action pills lack host `:focus-visible`:** completeness vs the two custom rings, not a 2.4.7 failure while UA outlines remain (no `outline: none`).
- **Large Connect tab sequence inside `main`:** SDK widget, not a host landmark failure. Out of this workflow.
- **Action pills `div` vs `nav`:** extra navigation landmark is optional; footer already has a named `nav`.
- Adjacent, out of scope: reduced-motion, consent stacking, theme-toggle Label in Name (#61), PhotoSwipe stacking (#58), FAQ disclosures.

## Scope and non-goals

Preact example host keyboard order, landmarks, and focus-visible only. Not adding a skip link or restyling every `:focus-visible`. Not SDK/PhotoSwipe/cookie-consent focus traps. Not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean (docs only)
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [WCAG 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html), [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [ARIA11 Using ARIA landmarks](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11)

## Limitations

No browser Tab session or AT landmark announcement in this run.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed |
|---|---|---|---|
| `preflight` | 2026-11-05T23:56:38Z | 2026-11-05T23:56:59Z | 00:00:21 (0.3 min) |
| `audit` | 2026-11-05T23:57:12Z | 2026-11-06T00:03:10Z | 00:05:58 (6.0 min) |
| `delivery` | 2026-11-06T00:03:10Z | 2026-11-06T00:03:41Z | 00:00:31 (0.5 min) |
| **Total run (preflight start to finish)** | 2026-11-05T23:56:38Z | 2026-11-06T00:03:41Z | **00:07:03 (7.0 min)** |
| Unclassified interval between marked phases | — | — | 00:00:13 (0.2 min) |

- Preflight: 05:26:38–05:26:59 IST (6 Nov)
- Audit: 05:27:12–05:33:10 IST (6 Nov)
- Delivery: 05:33:10–05:33:41 IST (6 Nov)
- Total: 05:26:38–05:33:41 IST (6 Nov)

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
