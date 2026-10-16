const test = require('node:test');
const assert = require('node:assert/strict');

let themeModule;
test.before(async () => {
  themeModule = await import('../src/theme.js');
});

test('initial theme falls back to system preference when localStorage access throws', () => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      get localStorage() {
        throw new DOMException('Storage disabled', 'SecurityError');
      },
    },
  });

  assert.equal(themeModule.readSavedTheme(), null);
  assert.equal(themeModule.getInitialTheme(themeModule.readSavedTheme(), true), 'dark');
});

test('initial theme falls back to system preference when localStorage reads throw', () => {
  globalThis.window = { localStorage: { getItem() { throw new DOMException('Storage disabled', 'SecurityError'); } } };
  assert.equal(themeModule.readSavedTheme(), null);
  assert.equal(themeModule.getInitialTheme(themeModule.readSavedTheme(), false), 'light');
});

test('invalid saved themes are ignored', () => {
  globalThis.window = { localStorage: { getItem: () => 'system' } };
  assert.equal(themeModule.readSavedTheme(), null);
  assert.equal(themeModule.getInitialTheme(themeModule.readSavedTheme(), false), 'light');
});

test('theme persistence failure does not escape', () => {
  globalThis.window = {
    localStorage: {
      setItem() {
        throw new DOMException('Storage disabled', 'SecurityError');
      },
    },
  };

  assert.doesNotThrow(() => themeModule.persistTheme('dark'));
});

test('valid saved theme is preserved', () => {
  globalThis.window = { localStorage: { getItem: () => 'dark' } };
  assert.equal(themeModule.readSavedTheme(), 'dark');
  assert.equal(themeModule.getInitialTheme(themeModule.readSavedTheme(), false), 'dark');
});
