# Qrati Connect — Preact Example

Embeds [Qrati Connect](https://qrati.com) into a Preact + Vite app using the
**React component** integration (through `preact/compat`), with a host-controlled
light/dark theme and a demo login for organizations that use custom auth.

## Integration method: React component

The SDK ships a React component. Preact aliases `react` → `preact/compat`, so it
drops straight in:

```tsx
import QratiConnect from '@qratilabs/qrati-connect';

<QratiConnect organizationId={ORGANIZATION_ID} uid={user.userId} theme={theme} router="hash" />
```

## Run it

```bash
pnpm install
cp .env.example .env   # optional — sensible defaults are baked in
pnpm dev
```

## Configuration

| Variable               | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `VITE_ORGANIZATION_ID` | Your Qrati organization ID                                        |
| `VITE_API_ENDPOINT`    | Demo-login endpoint for custom-auth orgs. Leave empty to skip it. |

## Demo auth

Orgs with custom auth expect a known user. The login form (`src/auth.ts`) derives
a stable `uid` from the email, optionally POSTs to `VITE_API_ENDPOINT`, then
renders the widget with `uid` / `fname` / `lname` so the user is recognized.

## Other integration methods

- **Web component** — `<qrati-connect>` from the CDN (see the Svelte / Solid / Qwik / Lit examples).
- **Embed (no-code)** — single `<script>` tag with `data-*` attributes (see the Vanilla JS / Marko / Ember examples).

Docs: <https://www.npmjs.com/package/@qratilabs/qrati-connect>
