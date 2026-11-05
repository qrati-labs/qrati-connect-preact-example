const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function viteBase() {
  const config = fs.readFileSync(path.join(root, 'vite.config.ts'), 'utf8');
  const match = config.match(/base:\s*'([^']+)'/);
  assert.ok(match, 'vite.config.ts must declare a string base path');
  return match[1];
}

function iconHref(html) {
  const match = html.match(/rel="icon"[^>]*href="([^"]+)"/);
  assert.ok(match, 'index.html must include a rel="icon" href');
  return match[1];
}

function canonicalHref(html) {
  const match = html.match(/rel="canonical" href="([^"]+)"/);
  assert.ok(match, 'index.html must include a canonical href');
  return match[1];
}

test('favicon resolves under the mounted example path on the canonical URL', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const base = viteBase();
  const resolvedIcon = iconHref(html).replaceAll('%BASE_URL%', base);
  const canonical = canonicalHref(html);

  assert.match(canonical, /\/connect\/preact-example$/);
  assert.equal(new URL(canonical).pathname, '/connect/preact-example');

  const resolved = new URL(resolvedIcon, canonical);
  assert.equal(resolved.pathname, '/connect/preact-example/qrati-logo-square.svg');

  const publicIcon = path.join(root, 'public', 'qrati-logo-square.svg');
  assert.equal(fs.existsSync(publicIcon), true);
  assert.equal(pathToFileURL(publicIcon).protocol, 'file:');
});
