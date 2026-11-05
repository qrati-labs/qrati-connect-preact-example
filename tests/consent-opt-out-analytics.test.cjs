const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const src = fs.readFileSync(
  path.resolve(__dirname, '../src/lib/cookieConsent.ts'),
  'utf8',
);

test('geo opt-out configures analytics as enabled by default', () => {
  assert.match(src, /mode:\s*required\s*\?\s*'opt-in'\s*:\s*'opt-out'/);
  assert.match(src, /autoShow:\s*required/);
  assert.match(
    src,
    /categories:\s*\{\s*necessary:\s*\{\s*enabled:\s*true,\s*readOnly:\s*true\s*\},\s*analytics:\s*\{\s*enabled:\s*true\s*\}/,
  );
  assert.doesNotMatch(src, /analytics:\s*\{\s*\}/);
});
