# BugHunter audit: Preact theme-toggle vs Connect PhotoSwipe stacking

- Run: `20261105T214238Z-b9afcc340a524e5eb809d2d1643a9083`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `1795da1a462fc26046aacd1db25538812aa1ff32` (`1795da1 docs(bughunter): audit Preact Consent Mode wait_for_update (#57)`)
- Workflow: host theme toggle stacking vs embedded Connect PhotoSwipe overlay/close control
- Disposition: P3 confirmed; remove `.page-shell` `isolation: isolate` + regression test
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/58
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Host theme toggle stacks above Connect PhotoSwipe close control** — **Evidence:** `src/app.tsx` renders `.theme-toggle` (`position: fixed; top: 1rem; right: 1rem; z-index: 100`) as a previous sibling of `.page-shell`. `.page-shell` used `isolation: isolate`, which creates a stacking context. `@qratilabs/qrati-connect` PhotoSwipe is `position: fixed` with `--pswp-root-z-index: 100000` and `appendToEl: portalContainer ?? document.body`; the portal is `#qrati-connect-container` inside the embed (`qrati-connect-ts` `SessionContext` / `MediaGallery`). Close sits in `.pswp__top-bar` (`justify-content: flex-end`, 60px). **Failure:** overlay z-index cannot escape the isolated shell, so the toggle paints on top of the lightbox and occupies the same top-right corner as close. **Fix:** drop `isolation: isolate` on `.page-shell` so PhotoSwipe `z-index: 100000` competes at the root with the toggle (`z-index: 100`). Toggle still sits above in-flow page chrome. **Test:** `tests/theme-toggle-stacking.test.cjs` — `node --test tests/theme-toggle-stacking.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` renders `App`; live gallery is `<QratiConnect organizationId={ORGANIZATION_ID} theme={theme} router="hash" />` in `.widget-frame`.
2. Inputs: user opens a gallery image (PhotoSwipe).
3. Authz: none; public example.
4. Host stacking (pre-fix): `.theme-toggle` sibling of isolated `.page-shell`.
5. SDK: React wrapper mounts `<qrati-connect>`; PhotoSwipe appends inside `#qrati-connect-container`.
6. Output (post-fix): `.page-shell` keeps `position: relative; overflow: hidden` without `isolation`. Overlay can stack above the toggle. Cookie-consent `#cc-main` remains on `document.body`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- Theme-toggle audit (20261105T124438Z) covered `theme` prop/persistence, not overlay stacking.
- Embedded gallery shell audit (20261018) covered layout padding, not `isolation` vs PhotoSwipe.
- `overflow: hidden` on `.page-shell` / `.widget-frame` does not create a `position: fixed` containing block (no transform/filter/perspective). Isolation was the stacking trap.
- Cookie-consent z-index is out of scope (`#cc-main` is not inside `.page-shell`).
- `isolation: isolate` came from the original astro-style UI port (`b446bcc`), not a later functional fix.

## Scope and non-goals

Preact example host stacking vs Connect PhotoSwipe only. Not SDK portal changes, not other examples, no production fetch.

## Tests and verification

- Authored: `tests/theme-toggle-stacking.test.cjs`
- Command: `node --test tests/theme-toggle-stacking.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- SDK: `qrati-connect-ts` `SessionContext` portal container; `photoswipe.css` `.pswp` / `.pswp__button--close`

## Limitations

No browser screenshot of PhotoSwipe vs the toggle. No live `qrati.com` request. Pixel overlap inferred from CSS positions and stacking rules.

## Timing

TIMING_TABLE_PLACEHOLDER
