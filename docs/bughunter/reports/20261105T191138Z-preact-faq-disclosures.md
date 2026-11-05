# BugHunter audit: Preact FAQ disclosure workflow

- Run: `20261105T191138Z-7795ceaca6b042f2a1d89b8c7b437640`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `cae0233155713e5a99acb2e9df044beecdd3378c` (`cae0233 fix(consent): sync cookie-consent dark mode with host theme (#51)`)
- Workflow: Frequently Asked Questions disclosures on the public Preact example (`<details>` / `<summary>` in `src/app.tsx`, presentation in `src/index.css`)
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Finding

No confirmed defect. The FAQ block is five independent native HTML disclosure widgets. Each has a `<summary>` label and an answer `<p>`. The first item is initially open via the boolean `open` attribute; the rest start closed. There is no application JavaScript, custom toggle state, network call, or `toggle` listener on these elements. CSS sets cursor, weight, spacing, and card chrome and does not set `display` on `summary` in a way that removes the disclosure marker, nor `outline: none`. MDN documents that omitting `name` leaves widgets independent (exclusive accordion requires a shared `name`). That matches a “common questions” list where several answers may be visible at once. Keyboard activation (click / focused summary + space) is platform-provided.

## Trace

1. Entry: `src/app.tsx` `App` render, section `aria-labelledby="faq-heading"` with `h2#faq-heading`.
2. Inputs: pointer or keyboard on each `<summary>`; no URL, auth, or form values.
3. Authz: none; public example.
4. State: native `HTMLDetailsElement.open`. First node has `open`. No `name` grouping.
5. Side effects: none in host code. No persistence.
6. Presentation: `src/index.css` `.faq-list`, `.faq-list details`, `.faq-list summary`, shared `.seo-feature-card, .faq-list details` card styles.
7. Output: expanded answer paragraph under the chosen question.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR. Prior FAQ audit (2026-10-18, base `002faea`) was report-only; current markup is the same native pattern at `src/app.tsx` (FAQ section) after later consent/theme edits.

## Falsification

- **Missing exclusive accordion (`name`):** not a failure. MDN `name` is optional and forces one-open groups. Independent details match the copy (“Common Questions” / “Frequently Asked Questions”).
- **First item `open`:** documented boolean attribute; `open="false"` would still show. Source uses the presence of `open` only on the first `<details>`.
- **No FAQPage JSON-LD:** `index.html` publishes `SoftwareApplication` JSON-LD and a visible FAQ. Absence of FAQ rich-result schema is not a broken disclosure control.
- **CSS disabling native behavior:** rules do not remove `summary` interactivity or `::-webkit-details-marker`. `cursor: pointer` only.
- **Focus not visible:** no `outline: none` on `summary`; UA outline remains. Theme toggle / cookie button have extra `focus-visible` styles; that is enhancement, not a failed FAQ control.
- Adjacent, out of scope: cookie consent, theme toggle, hash-router gallery, worker SPA routing, Google Fonts, org id, favicon.

## Scope and non-goals

FAQ disclosure open/close on this Preact host only. Not assistive-technology certification. No production fetch. No source or test changes.

## Tests and verification

- Authored: none (report-only).
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: permitted; run at delivery
- CodeGraph: unindexed for this worktree; focused reads used
- Primary docs: [HTML `<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details); [HTML `<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary)

## Limitations

No browser/E2E run, no screen-reader session, no live `qrati.com` paint of the FAQ section.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T19:11:38Z | 2026-11-05T19:12:01Z | 00:00:23 (0.4 min) | 00:41:38–00:42:01 |
| `audit` | 2026-11-05T19:12:15Z | 2026-11-05T19:16:11Z | 00:03:56 (3.9 min) | 00:42:15–00:46:11 |
| `delivery` | 2026-11-05T19:16:11Z | 2026-11-05T19:17:06Z | 00:00:55 (0.9 min) | 00:46:11–00:47:06 |
| **Total run (preflight start to finish)** | 2026-11-05T19:11:38Z | 2026-11-05T19:17:06Z | **00:05:28 (5.5 min)** | **00:41:38–00:47:06** |
| Unclassified interval between marked phases | — | — | 00:00:14 (0.2 min) | — |

- Preflight: 00:41:38–00:42:01 IST (6 Nov)
- Audit: 00:42:15–00:46:11 IST (6 Nov)
- Delivery: 00:46:11–00:47:06 IST (6 Nov)
- Total: 00:41:38–00:47:06 IST (6 Nov)

Timing-table insertion occurred after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
