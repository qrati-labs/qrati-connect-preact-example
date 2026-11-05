const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const src = fs.readFileSync(
  path.resolve(__dirname, '../src/lib/cookieConsent.ts'),
  'utf8',
);

test('geo opt-in does not pre-enable analytics; opt-out still does via !required', () => {
  assert.match(src, /mode:\s*required\s*\?\s*'opt-in'\s*:\s*'opt-out'/);
  assert.match(
    src,
    /analytics:\s*\{\s*enabled:\s*!required\s*\}/,
    'analytics.enabled must follow geo mode so opt-in toggles start off',
  );
  assert.doesNotMatch(
    src,
    /analytics:\s*\{\s*enabled:\s*true\s*\}/,
    'unconditional analytics.enabled: true pre-checks the opt-in preferences toggle',
  );
});
