const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const src = fs.readFileSync(
  path.resolve(__dirname, '../src/lib/cookieConsent.ts'),
  'utf8',
);

test('preferences modal links necessary and analytics categories', () => {
  assert.match(src, /showPreferencesBtn:\s*'Manage preferences'/);
  assert.doesNotMatch(
    src,
    /preferencesModal:\s*\{[^}]*sections:\s*\[\s*\]/,
  );
  assert.match(
    src,
    /linkedCategory:\s*'necessary'/,
  );
  assert.match(
    src,
    /linkedCategory:\s*'analytics'/,
  );
  const necessaryAt = src.indexOf("linkedCategory: 'necessary'");
  const analyticsAt = src.indexOf("linkedCategory: 'analytics'");
  assert.notEqual(necessaryAt, -1);
  assert.notEqual(analyticsAt, -1);
  assert.ok(necessaryAt < analyticsAt, 'necessary section should appear before analytics');
});
