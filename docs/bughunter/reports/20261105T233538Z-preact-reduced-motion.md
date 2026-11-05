# BugHunter audit: Preact host prefers-reduced-motion

- Run: `20261105T233538Z-8e35a5f0bdea490596535d69d5c8618a`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `f9789cb` (`f9789cb docs(bughunter): audit Preact FAQ structured data (#64)`)
- Workflow: host CSS motion vs `prefers-reduced-motion` (feature-map hover, action-pill hover, theme-toggle / footer transitions)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The host page has no auto-playing, looping, or >5s motion. `src/index.css` already disables `.feature-map-card` transition and hover `translateY` under `@media (prefers-reduced-motion: reduce)`. Remaining host motion is short hover/color transitions (action pills `translateY(-1px)` at 160ms; theme-toggle and footer color/background transitions). WCAG 2.2.2 Pause, Stop, Hide (A) applies to moving/blinking/scrolling content that **starts automatically**, lasts more than five seconds, and is presented in parallel with other content. WCAG 2.3.3 Animation from Interactions is AAA and is not a contract of this example. Vanilla-cookieconsent and Connect PhotoSwipe motion are library-owned.

## Trace

1. Entry: `src/main.tsx` imports `./index.css`; `App` renders hero pills, feature-map cards, theme toggle, footer.
2. Inputs: OS/UA `prefers-reduced-motion: reduce`. No JS motion API, no `matchMedia` motion listener.
3. Authz: none; public example.
4. Host CSS:
   - `.feature-map-card`: `transition: transform 180ms ease, border-color 180ms ease`; hover `translateY(-3px)`; **gated** by reduced-motion (transition none, hover transform none).
   - `.action-pills a`: `transition` including transform 160ms; hover `translateY(-1px)`; **not** gated.
   - `.theme-toggle`: background/border 160ms; `.footer a` / `.footer-cookie-btn`: color 160ms; no transform.
   - No `@keyframes`, no infinite animation, no autoplay video on the host.
5. Widget: `<QratiConnect …>` owns gallery/lightbox animation; out of this host CSS workflow.
6. Output: users who prefer reduced motion still get a static page plus a 1px hover nudge on GitHub/VS Code pills. Feature-map lift is already off.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Ungated action-pill hover vs gated feature-map:** completeness, not a broken control. 160ms 1px translate is interaction-driven, not auto-playing, not >5s. Does not violate 2.2.2.
- **Sibling React example:** React gates CTA `::before`/`::after` animations that this Preact host does not ship (no `.seo-cta-card` shimmer, no CTA keyframes). Not a missing required equivalent.
- **Theme toggle / consent / PhotoSwipe:** stacking and consent were audited separately; they are not reduced-motion failures.
- **No JS `matchMedia('(prefers-reduced-motion)')`:** unnecessary when remaining host motion is CSS-only and WCAG A does not require it here.
- Adjacent, out of scope: cookie consent, GTM, hash router, worker SPA routing, FAQ JSON-LD, org id.

## Scope and non-goals

Preact example host CSS motion vs `prefers-reduced-motion` only. Not adding a global `* { animation: none }` rule. Not SDK/PhotoSwipe. Not other example repos. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html)

## Limitations

No browser with `prefers-reduced-motion` enabled, no live `qrati.com` request, no computed-style capture.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER
