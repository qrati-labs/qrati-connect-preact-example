const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function ruleBody(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `${selector} rule must exist`);
  return match[1];
}

test('page-shell does not trap Connect overlays under the theme toggle', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');

  const shell = ruleBody(css, '.page-shell');
  const toggle = ruleBody(css, '.theme-toggle');

  assert.match(toggle, /position:\s*fixed/);
  assert.match(toggle, /z-index:\s*100/);
  assert.match(toggle, /top:\s*1rem/);
  assert.match(toggle, /right:\s*1rem/);
  assert.equal(/\bisolation\s*:/.test(shell), false, '.page-shell must not create an isolating stacking context');

  const toggleAt = app.indexOf('class="theme-toggle"');
  const shellAt = app.indexOf('class="page-shell"');
  const widgetAt = app.indexOf('QratiConnect');
  assert.ok(toggleAt !== -1 && shellAt !== -1 && widgetAt !== -1);
  assert.ok(toggleAt < shellAt, 'theme toggle remains a previous sibling of page-shell');
  assert.ok(shellAt < widgetAt, 'QratiConnect stays inside page-shell');
});
