# Workflow audit: Preact outbound navigation

- Run: `20261019T043138Z-14010bc736f54bb1bbc531f9ca72a74d`
- Reviewed base: `origin/main` / `002faea7e6dd8505cdf5b570229c4e3407f0fabf`
- Scope: user-facing outbound navigation in `src/app.tsx`: hero links, example links, primary conversion CTA, and footer navigation. Includes rendered destinations, new-tab attributes, and labels. Excludes consent, theme, widget internals, and external-site behavior.
- Candidate selection: clean Preact checkout. Consent initialization excluded because existing open PRs #2 and #11 directly overlap. The route inventory showed separate outbound links/CTA; open PR diffs were inspected and do not overlap `src/app.tsx` links. Source branch and worktree are isolated from user checkouts.
- CodeGraph: repository had no `.codegraph` index; used focused file reads and searches instead.

## Findings

No confirmed defect in the reviewed workflow. Every visible external anchor in `src/app.tsx` has a concrete HTTPS destination; links opening a new tab include `rel="noopener noreferrer"`. The hero example links are constructed from fixed repository constants, and the footer GitHub link uses the same organization constant. The CTA and footer destinations are explicit. No client navigation state or input-derived URL is involved.

The audit did not check whether the external destinations currently resolve, whether the conversion CTA produces business outcomes, or whether all external landing pages are correct/available. Those require external-state verification and are outside this source-only trace. No regression test was authored because no defect was confirmed.

## Verification

- Preflight: injected inventory reported 36 repositories and zero fetch errors; no repeat fetch/timer performed.
- Current Preact remote base verified at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`.
- Open PRs #2, #4-#18 were read back for actual changed files. #2 overlaps consent bootstrap (`index.html` and test/report); #11 overlaps consent report; neither overlaps this link workflow. Other observed open PR changes do not cover `src/app.tsx` outbound-link behavior. (PR #3 is not listed in preflight; no assumption about it is made.)
- Source traced in `src/app.tsx` lines 5-6, 40-58, 99, 111-116 and `src/config.ts` lines 4-5.
- `git diff --check` — passed on the committed patch before push.
- Tests/build/lint/type-check/coverage/install — not run by BugHunter.

## Timing

- Run start: `2026-10-19T04:31:39Z` (IST 10:01:39).
- Artifact and PR readback completed: `2026-10-19T04:35:45Z` (IST 10:05:45).
- Total measured wall time: `00:04:06` (IST duration same). Phase breakdown is not available from the injected timer; no phase values are estimated.

## Disposition

Report-only; no source change, issue, deployment, or production access. PR #19 is open; GitGuardian Security Checks are pending for the final docs commit, and no other checks are reported.

## Sources

- Source: `src/app.tsx`, `src/config.ts` at reviewed base SHA above.
- Open PR file inventories read via GitHub CLI for `qrati-labs/qrati-connect-preact-example`.
