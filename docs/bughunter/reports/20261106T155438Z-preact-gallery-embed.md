# BugHunter audit: Preact live gallery embed mount

- Run: `20261106T155438Z-05a95db3162f48e09e5675903b336b4d`
- Repository: `qrati-labs/qrati-connect-preact-example`
- Base: fetched `origin/main` at `3f2e6212ec1792f630d4d40df3a368a5bde9f623`
- Workflow: host mount of `<QratiConnect organizationId theme router="hash" />` — org-id source, Preact/compat import, hash router, host theme prop, widget shell
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

Rendered inside `.widget-frame` with `aria-label="Interactive Preact Event Gallery"` and an `sr-only` heading. This matches `README.md` (React component via `preact/compat`) and the hero copy.

`ORGANIZATION_ID` is `import.meta.env.VITE_ORGANIZATION_ID || DEFAULT_EXAMPLE_ORG_ID` (`src/config.ts`); `DEFAULT_EXAMPLE_ORG_ID` is `'69ad9c7876d8bf6f864b3a65'`. Empty-env fallback was fixed in #38/#39 and remains non-empty on this SHA.

Compat wiring:

- `vite.config.ts` uses `plugins: [preact()]` with no `reactAliasesEnabled: false`. `@preact/preset-vite` defaults `reactAliasesEnabled` to true.
- `tsconfig.app.json` maps `react` / `react-dom` to `preact/compat`, `jsx: react-jsx`, `jsxImportSource: preact`.
- `package.json` depends on `preact` `10.28.4` and `@qratilabs/qrati-connect` `^2.23.7`; it does not declare `react`/`react-dom`. SDK peers for those are optional.

SDK contract (`qrati-connect-ts` `src/types.ts` / `src/exports/react.tsx`):

- `organizationId: string` is required; `theme` defaults to `'light'`; `router` defaults to `'memory'`.
- Host passes the documented literals: non-empty org id, `'light'|'dark'` theme from host state, `router="hash"`.
- `AppRoutes` maps `router.toLowerCase() === 'hash'` to hash history. Hash fragments are not sent to `src/worker.ts`, which only rewrites the `/connect/preact-example` pathname prefix.
- Optional `onError` is unused. The example does not claim custom error UI.

`.widget-frame` is `position: relative; overflow: hidden` with no transform/filter/perspective (no extra containing block for `position: fixed` PhotoSwipe). Isolation on `.page-shell` was removed in #58.

Open PR `#80` (`src/index.css` `--cc-toggle-off-bg`, consent tests, docs) does not change the embed import, props, org-id, hash router, or widget shell.

## Falsification

- Empty `organizationId` on the documented run path: disproved on this SHA; default org id is present.
- Missing Vite/TS react aliases: disproved; preset default is on and tsconfig paths exist.
- Unrecognized `router` falling back to memory: host passes `"hash"` exactly.
- Widget clipped by `overflow: hidden`: no transform/filter/perspective on the shell; stacking isolation was a prior, separate defect (#58).
- Missing `onError`: optional SDK prop; README does not promise host error UI.
- Cookie consent, GTM, favicon, and worker GTM HTML rewrite are adjacent and previously audited; they do not change the mount path.

No reachable host invariant was violated for this workflow.

## Verification

- Isolated worktree from preflight remote SHA `3f2e621` (`fix(a11y): raise light-theme answer-section kicker contrast (#78)`); `rev-parse --show-toplevel` matched `WORKTREE_PATH`.
- CodeGraph unindexed for this worktree and for `qrati-connect-ts`; focused file reads/searches used.
- Open PRs at preflight: `#80` cookie-consent off-toggle contrast; no overlap with this embed workflow.
- No source or test changes. No tests authored.
- Tests/build/lint/type-check/install: **NOT RUN BY BUGHUNTER**.
- `git diff --check` run on the docs-only patch.

## Timing (measured wall-clock)

Timing table inserted after `finish`.

## Sources

- `src/app.tsx`, `src/main.tsx`, `src/config.ts`, `src/index.css`, `vite.config.ts`, `tsconfig.app.json`, `package.json`, `README.md`, `index.html`, `src/worker.ts`
- `qrati-labs/qrati-connect-ts` `src/types.ts`, `src/exports/react.tsx`, `src/routes/AppRoutes.tsx`
- `@preact/preset-vite` `reactAliasesEnabled` default
- Ownership map: `qrati-labs/qrati-operations` `web/ownership.html`
