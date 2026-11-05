# BugHunter audit: Preact theme-toggle Label in Name

- Run: `20261105T223039Z-9f498b44bead4baf898ad73bd0db7135`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `aa143eb` (`aa143eb docs(bughunter): audit Preact Consent Mode ads vs analytics (#60)`)
- Workflow: host theme-toggle accessible name vs visible Light/Dark label (WCAG 2.5.3)
- Disposition: P3 confirmed; drop static `aria-label="Toggle theme"`; issue #61
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/61
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Theme toggle aria-label hides visible Light/Dark text from the accessible name** — **Evidence:** `src/app.tsx` `.theme-toggle` rendered `{theme === 'dark' ? '☀ Light' : '🌙 Dark'}` with `aria-label="Toggle theme"`. Trigger: speech-input or AT user on the host theme control. **Failure:** `aria-label` replaces descendant text in the accessible-name computation, so the name is always “Toggle theme” and does not contain the visible words Light/Dark. This is WCAG 2.2 SC 2.5.3 Label in Name (Level A) failure [F96](https://www.w3.org/WAI/WCAG22/Techniques/failures/F96). Voice users who say “click Light” do not match the control. **Fix:** remove the static `aria-label` so the button’s own text is the name. **Test:** `tests/theme-toggle-label-in-name.test.cjs` — `node --test tests/theme-toggle-label-in-name.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` renders `App`; first focusable host control is `.theme-toggle` (`src/app.tsx`).
2. Inputs: click / keyboard / speech on the button. Visible label is `☀ Light` (when current theme is dark) or `🌙 Dark` (when light).
3. Authz: none; public example.
4. Name computation: HTML-AAM / accname — `aria-label` wins over descendant text. Pre-fix name: `Toggle theme`. Post-fix name: the visible `☀ Light` / `🌙 Dark` string (emoji is symbolic; the human-language words remain).
5. Side effects unchanged: `toggleTheme` still flips Preact state, `data-theme` / `dark` / `cc--darkmode`, `persistTheme`, and the `QratiConnect` `theme` prop.
6. Output: speech/AT name contains Light or Dark, matching the visible label (G208/G211).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- Prior host theme-toggle audit (`20261105T124438Z`) covered persistence and the widget `theme` prop. It noted `aria-label="Toggle theme"` but did not evaluate Label in Name. Stacking vs PhotoSwipe (`#58`) is a different CSS path.
- “aria-label is intentional to hide the emoji”: still requires the visible word Light/Dark inside the name (G208). Static “Toggle theme” does not.
- SC 2.5.3 does not apply when there is no visible text label. This button has visible Light/Dark text, so the SC applies.
- Cookie-consent, GTM, hash router, and org-id fallback are adjacent and previously audited; they do not set this button’s accessible name.

## Scope and non-goals

Host Preact example theme-toggle accessible name only. Not SDK chrome, not other example repos, no production fetch.

## Tests and verification

- Authored: `tests/theme-toggle-label-in-name.test.cjs`
- Command: `node --test tests/theme-toggle-label-in-name.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Understanding 2.5.3](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html), [F96](https://www.w3.org/WAI/WCAG22/Techniques/failures/F96), [G208](https://www.w3.org/WAI/WCAG22/Techniques/general/G208)

## Limitations

No screen-reader or speech-recognition session. Accessible name inferred from markup and the accname / WCAG failure technique.

## Timing (measured wall-clock)

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER
