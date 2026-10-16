const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');

test('denies Google consent before any external script can load', () => {
  const html = readFileSync(new URL('../index.html', `file://${__filename}`), 'utf8');
  const consentDefault = html.indexOf("window.gtag('consent', 'default'");
  const firstExternalScript = html.indexOf('<script src=');

  assert.notEqual(consentDefault, -1, 'a consent default must be present');
  assert.ok(firstExternalScript === -1 || consentDefault < firstExternalScript);
  for (const category of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']) {
    assert.match(html.slice(consentDefault, firstExternalScript), new RegExp(`${category}:\\s*'denied'`));
  }
});
