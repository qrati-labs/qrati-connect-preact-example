const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('theme toggle accessible name includes visible Light/Dark label', () => {
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  const match = app.match(/<button\b([^>]*)class="theme-toggle"([^>]*)>([\s\S]*?)<\/button>/);
  assert.ok(match, 'theme-toggle button must exist');

  const attrs = `${match[1]} ${match[2]}`;
  const inner = match[3];
  assert.match(inner, /Light/);
  assert.match(inner, /Dark/);

  const aria = attrs.match(/aria-label=(?:\{([^}]+)\}|"([^"]*)"|'([^']*)')/);
  if (!aria) return;

  const value = `${aria[1] || ''} ${aria[2] || ''} ${aria[3] || ''}`.toLowerCase();
  assert.match(
    value,
    /light/,
    'aria-label must contain the visible Light label (WCAG 2.5.3 / F96)',
  );
  assert.match(
    value,
    /dark/,
    'aria-label must contain the visible Dark label (WCAG 2.5.3 / F96)',
  );
});
