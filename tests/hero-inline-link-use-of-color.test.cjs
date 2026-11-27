const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function rulesFor(css, selector) {
  const found = [];
  for (const match of css.matchAll(/([^{}/][^{}]*)\{([^}]+)\}/g)) {
    const parts = match[1]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.includes(selector)) {
      const decls = {};
      for (const decl of match[2].matchAll(/([a-z-]+)\s*:\s*([^;]+);/gi)) {
        decls[decl[1].toLowerCase()] = decl[2].trim();
      }
      found.push(decls);
    }
  }
  return found;
}

function cascadeDecoration(css, selector) {
  const rules = rulesFor(css, selector);
  assert.ok(rules.length > 0, `missing rule mentioning ${selector}`);
  let decoration;
  for (const decls of rules) {
    if (decls['text-decoration']) decoration = decls['text-decoration'];
  }
  return decoration;
}

test('hero copy and h1 contain inline Qrati links amid static text', () => {
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  assert.match(app, /<h1>[\s\S]*<a href="https:\/\/qrati\.com"[^>]*>Qrati<\/a> Connect inside/);
  assert.match(
    app,
    /class="hero-copy"[\s\S]*embed[\s\S]*<a href="https:\/\/qrati\.com"[^>]*>Qrati<\/a> Connect into/,
  );
});

test('inline hero links use a non-color underline; pill links do not', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');

  assert.equal(cascadeDecoration(css, '.hero-copy a'), 'underline');
  assert.equal(cascadeDecoration(css, '.hero h1 a'), 'underline');
  assert.equal(cascadeDecoration(css, '.hero a'), 'none');
  assert.notEqual(cascadeDecoration(css, '.action-pills a'), 'underline');
});
