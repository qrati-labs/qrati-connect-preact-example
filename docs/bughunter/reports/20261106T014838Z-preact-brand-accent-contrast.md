# BugHunter audit: Preact host light-theme brand-accent text contrast

- Run: `20261106T014838Z-43823e363b614bcc8a8fffb45968452b`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `74c058ab32d90646a2ffe03e7cb770f7fabf5581` (`74c058a fix(a11y): raise cookie-consent primary button contrast (#72)`)
- Workflow: light-theme host brand-accent copy (hero intro links, SEO kickers, footer wordmark, hero kicker, pill/footer hover)
- Disposition: P3 confirmed; darken light `--brand-accent` / kicker hex; issue #73
- Issue: https://github.com/qrati-labs/qrati-connect-preact-example/issues/73
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

**[P3] Light-theme brand-accent text fails WCAG contrast** — **Evidence:** `src/index.css` `[data-theme='light']` `--brand-accent: #e14f00` (pre-fix) and `.hero-kicker { color: #e14f00 }`. WCAG sRGB relative luminance vs `#ffffff` → **3.95:1** (vs `#fff7f1` → **3.73:1**). Used as normal-size text: `.hero-copy a` (1rem/400), `.seo-kicker` (16px/800), `.footer-title span` (0.95rem/700), `.hero-kicker` (0.68rem/800), light `--pill-text-hover` / `--footer-link-hover`. **Failure:** WCAG 2.2 SC 1.4.3 requires 4.5:1 for normal text; these sizes are not large text (18pt/24px or 14pt/~18.7px bold). Reachable on first paint of the public example in light theme. **Fix:** light `--brand-accent: #cc3d00` (**4.96:1** on white); point light `--pill-text-hover` / `--footer-link-hover` at that token; `.hero-kicker` color `#cc3d00` (kept as hex so dark theme does not paint `#ff6b35` on the kicker’s light pill). Dark `--brand-accent: #ff6b35` on `--page-bg: #0f0f14` is **6.74:1** and unchanged. **Test:** `tests/brand-accent-contrast.test.cjs` — `node --test tests/brand-accent-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `src/main.tsx` renders `App`; `src/theme.js` / inline `index.html` script set `data-theme` to `light` when no saved preference and OS is light.
2. Inputs: `--brand-accent` on hero/SEO/footer copy; hardcoded `.hero-kicker` color on `rgba(255,255,255,0.78)`.
3. Authz: none; public example.
4. Pre-fix: light `#e14f00` at 3.95:1 vs white. Distinct from #69 (`--cta-bg` button fill) and #71 (cookie-consent primary buttons).
5. Sibling call sites: light `--pill-text-hover` and `--footer-link-hover` used the same failing hex; updated to `var(--brand-accent)`. Dark hover tokens already use `#ff6b35`.
6. Post-fix: light accent `#cc3d00`; kicker `#cc3d00`; dark accent unchanged.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Hero h1 “Qrati” is large text:** `clamp(2.25rem, 3vw, 3.6rem)` meets the 3:1 large-text floor at 3.95:1. The intro link, kickers, and footer wordmark do not.
- **Brand orange is intentional:** same as #69/#71; 3.95:1 on 16px body links is not a style preference.
- **Duplicate of #69:** #69 split `--cta-bg` and left this text token. #71 is cookie-consent chrome.
- **Dark theme also fails:** measured 6.74:1 on `--page-bg`. Not changed.
- **Pointing `.hero-kicker` at `var(--brand-accent)`:** would use dark `#ff6b35` on the kicker’s light `rgba(255,255,255,0.78)` pill (**2.84:1**). Hex `#cc3d00` is the narrow safe fix.

## Scope and non-goals

Host Preact example light-theme brand-accent *text* contrast only. Not cookie-consent toggles (1.4.11), not other example repos, no production fetch.

## Tests and verification

- Authored: `tests/brand-accent-contrast.test.cjs`
- Command: `node --test tests/brand-accent-contrast.test.cjs` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)

## Limitations

No browser computed-style capture or axe run. Ratios are from source hex tokens and the WCAG sRGB relative-luminance formula.

## Timing (measured wall-clock)

Timing table is inserted after `finish` from the ledger. Do not treat this placeholder as measured duration.
