# BugHunter audit: Preact React-component embed via preact/compat

- Run: `20261105T160538Z-14f7a3e810d14e9dbb507c3b02ecbedd`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `ed4e0d7f5a9b63b39e8da78c209db99a7cd253ca`
- Workflow: documented React-component integration — host import of `@qratilabs/qrati-connect`, Preact `react`/`react-dom` aliases to `preact/compat`, and mount of `<QratiConnect organizationId theme router="hash" />`
- Disposition: report-only; no confirmed defect
- Issue: none; no defect established
- Ownership: `qrati-connect-preact-example` is not in `qrati-operations` `web/ownership.html` (example repo). No primary assignee invented.

## Trace and evidence

Entry: `index.html` mounts `#app` and loads `/src/main.tsx`. `src/main.tsx` starts cookie-consent initialization (out of scope) and `render(<App />, document.getElementById('app')!)`.

Host embed (`src/app.tsx`):

```tsx
import QratiConnect from '@qratilabs/qrati-connect';
<QratiConnect organizationId={ORGANIZATION_ID} theme={theme} router="hash" />
```

This matches `README.md` (“React component” through `preact/compat`) and the hero copy. `ORGANIZATION_ID` is `VITE_ORGANIZATION_ID || DEFAULT_EXAMPLE_ORG_ID` (`src/config.ts`); empty-env fallback was fixed in #38/#39 and is not this workflow.

Compat wiring:

- `vite.config.ts` uses `plugins: [preact()]` with no `reactAliasesEnabled: false`. `@preact/preset-vite` defaults `reactAliasesEnabled` to true and aliases `react` → `preact/compat`, `react-dom` → `preact/compat`, `react/jsx-runtime` → `preact/jsx-runtime` ([preset-vite `preact:config`](https://github.com/preactjs/preset-vite)).
- `tsconfig.app.json` maps `react` and `react-dom` to `./node_modules/preact/compat/`, `jsx: react-jsx`, `jsxImportSource: preact`. Host JSX therefore uses Preact; the SDK wrapper’s `import { createElement } from 'react'` resolves through the Vite alias at bundle time.
- `package.json` depends on `preact` `10.28.4` and `@qratilabs/qrati-connect` `^2.23.7`. It does not declare `react`/`react-dom`. That matches the SDK contract: those peers are optional (`qrati-connect-ts` `package.json`), and the published React build marks `react` / `react-dom` / `react/jsx-runtime` external so the host alias supplies `preact/compat`.

SDK contract (`qrati-connect-ts`, published as `@qratilabs/qrati-connect`):

- Default and named export of `QratiConnect`.
- Wrapper (`src/exports/react.tsx`) calls `createElement('qrati-connect', { ref, router, 'organization-id', uid, fname, lname, theme })` and lazy-loads `../element/web.es.js`. Element registration and the relative dynamic import are SDK-owned; this host does not reimplement them or mark the package external.
- Props used by the host (`organizationId`, `theme` `'light'|'dark'`, `router` `'hash'`) are the documented `QratiConnectProps` literals. Hash routing was audited separately.

No host `onError` handler; SDK logs element-load failures and optionally forwards `qrati-error`. The example does not claim custom error UI.

## Falsification

- Missing Vite alias: disproved; preset default is on, and the example does not disable it.
- TypeScript paths without `react/jsx-runtime` or `react-dom/client`: host JSX uses `jsxImportSource: preact`; the published wrapper imports `createElement` from `react` only. Not a reachable host type/runtime failure from this tree.
- Feature card “Native Web Component”: marketing copy on the same page also describes the React component and product-wide Web Component support (feature-map “Embed cleanly”). It is inconsistent labeling, not a broken mount path or a violated README contract. Not filed as a defect.
- SDK `import('../element/web.es.js')` after the host bundles the wrapper: same published package and Vite default as the React/Next examples; failure would be an SDK/bundler contract issue, not a Preact-host miswire. Not proven from this repository.
- Cookie consent, GTM, theme toggle, org-id fallback, favicon, and worker prefix rewrites are adjacent and previously audited; they do not change the compat alias or the `QratiConnect` import.

No reachable host invariant was violated for this workflow.

## Verification

- Isolated worktree from preflight remote SHA `ed4e0d7` (`fix(consent): populate cookie preferences modal sections (#41)`); `rev-parse --show-toplevel` matched `WORKTREE_PATH`.
- CodeGraph unindexed for this worktree; focused file reads/searches used.
- Open PRs at preflight: none (`OPEN_PR_COUNT=0`); no overlap skip.
- No source or test changes. No tests authored.
- Tests/build/lint/type-check/install: **NOT RUN BY BUGHUNTER**.
- `git diff --check` run on the docs-only patch.

## Timing (measured wall-clock)

Copied from the timer ledger (`finish`). IST is UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Elapsed | IST |
|---|---|---|---|---|
| `preflight` | 2026-11-05T16:05:38Z | 2026-11-05T16:06:01Z | 00:00:24 (0.4 min) | 21:35:38–21:36:01 |
| `audit` | 2026-11-05T16:06:18Z | 2026-11-05T16:10:38Z | 00:04:20 (4.3 min) | 21:36:18–21:40:38 |
| `delivery` | 2026-11-05T16:10:38Z | 2026-11-05T16:11:34Z | 00:00:57 (0.9 min) | 21:40:38–21:41:34 |
| **Total run (preflight start to finish)** | 2026-11-05T16:05:38Z | 2026-11-05T16:11:34Z | **00:05:57 (6.0 min)** | **21:35:38–21:41:34** |
| Unclassified interval between marked phases | — | — | 00:00:16 (0.3 min) | — |

Timing-table insertion occurred after this measurement snapshot.

## Sources

- `src/app.tsx`, `src/main.tsx`, `src/config.ts`, `vite.config.ts`, `tsconfig.app.json`, `package.json`, `README.md`
- `qrati-labs/qrati-connect-ts` `src/exports/react.tsx`, `src/types.ts`, `vite.config.react.ts`, `package.json` peerDependencies
- `@preact/preset-vite` `reactAliasesEnabled` default and `preact:config` aliases: https://github.com/preactjs/preset-vite
- Ownership map: `qrati-labs/qrati-operations` `web/ownership.html`
