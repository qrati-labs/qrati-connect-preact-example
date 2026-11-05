const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const consentSrc = fs.readFileSync(
  path.resolve(__dirname, '../src/lib/cookieConsent.ts'),
  'utf8',
);
const appSrc = fs.readFileSync(
  path.resolve(__dirname, '../src/app.tsx'),
  'utf8',
);

test('host exports showCookiePreferences that opens the library modal', () => {
  assert.match(consentSrc, /export async function showCookiePreferences/);
  const fnAt = consentSrc.indexOf('export async function showCookiePreferences');
  const showAt = consentSrc.indexOf('CookieConsent.showPreferences', fnAt);
  assert.notEqual(fnAt, -1);
  assert.notEqual(showAt, -1);
  assert.ok(showAt > fnAt, 'showPreferences must be called from showCookiePreferences');
  assert.match(
    consentSrc,
    /export async function showCookiePreferences[\s\S]*await initCookieConsent\(\)/,
  );
});

test('footer exposes a persistent cookie preferences control', () => {
  assert.match(appSrc, /showCookiePreferences/);
  assert.match(appSrc, /data-cc=["']show-preferencesModal["']/);
  assert.match(appSrc, /Cookie Preferences/);
  const navAt = appSrc.indexOf('aria-label="Footer navigation"');
  const btnAt = appSrc.indexOf('show-preferencesModal');
  assert.notEqual(navAt, -1);
  assert.notEqual(btnAt, -1);
  assert.ok(btnAt > navAt, 'preferences control must live in the footer nav');
});
