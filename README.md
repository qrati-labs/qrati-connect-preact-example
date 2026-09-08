# Qrati Connect — Preact Example

[![Qrati Connect — embeddable event photo galleries](public/qrati-connect-og.png)](https://qrati.com/connect)

Add a lightweight live event photo gallery to Preact applications with guest uploads, lightbox viewing, emoji reactions, and contest leaderboards. [Explore Qrati Connect](https://qrati.com/connect) or [view the live Preact example](https://qrati.com/connect/preact-example).

Embeds [Qrati Connect](https://qrati.com) into a Preact + Vite app using the
**React component** integration (through `preact/compat`), with a host-controlled
light/dark theme.

## Integration method: React component

The SDK ships a React component. Preact aliases `react` → `preact/compat`, so it
drops straight in:

```tsx
import QratiConnect from '@qratilabs/qrati-connect';

<QratiConnect organizationId={ORGANIZATION_ID} theme={theme} router="hash" />
```

## Run it

```bash
pnpm install
cp .env.example .env   # optional — sensible defaults are baked in
pnpm dev
```

## Other integration methods

- **Web component** — `<qrati-connect>` from the CDN (see the Svelte / Solid / Qwik / Lit examples).
- **Embed (no-code)** — single `<script>` tag with `data-*` attributes (see the Vanilla JS / Marko / Ember examples).

Docs: <https://www.npmjs.com/package/@qratilabs/qrati-connect>
