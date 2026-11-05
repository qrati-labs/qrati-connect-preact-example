const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const src = fs.readFileSync(
  path.resolve(__dirname, '../src/lib/cookieConsent.ts'),
  'utf8',
);

test('consent-gated GTM inject queues gtm.js bootstrap before loading the container script', () => {
  const scriptUrl = src.indexOf('googletagmanager.com/gtm.js');
  const startAt = src.indexOf('gtm.start');
  const eventAt = src.search(/event:\s*['"]gtm\.js['"]/);

  assert.notEqual(scriptUrl, -1, 'must load gtm.js');
  assert.notEqual(startAt, -1, 'must record gtm.start');
  assert.notEqual(eventAt, -1, 'must push event gtm.js');
  assert.ok(startAt < scriptUrl, 'gtm.start must be queued before the script URL');
  assert.ok(eventAt < scriptUrl, 'event gtm.js must be queued before the script URL');
  assert.match(
    src,
    /dataLayer(?:\?|\.)push\(\s*\{[\s\S]*?gtm\.start[\s\S]*?event:\s*['"]gtm\.js['"]/,
  );
});
