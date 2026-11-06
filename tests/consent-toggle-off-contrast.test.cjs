const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const MIN_NON_TEXT_CONTRAST = 3;

function channel(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb) {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function contrastRatio(fg, bg) {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseHex(value) {
  const match = String(value).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  assert.ok(match, `expected a hex color, got ${JSON.stringify(value)}`);
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex.split('').map((ch) => ch + ch).join('');
  }
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function blockVars(css, pattern) {
  const block = css.match(pattern);
  assert.ok(block, `missing CSS block ${pattern}`);
  const vars = {};
  for (const match of block[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    vars[`--${match[1]}`] = match[2].trim();
  }
  return vars;
}

function resolveColor(value, vars) {
  const cleaned = value.replace(/!important/gi, '').trim();
  const ref = cleaned.match(/^var\((--[a-z0-9-]+)\)/i);
  if (ref) {
    assert.ok(vars[ref[1]], `block is missing ${ref[1]}`);
    return resolveColor(vars[ref[1]], vars);
  }
  return parseHex(cleaned);
}

test('light-theme cookie-consent off toggle meets WCAG 1.4.11 3:1 against adjacent chrome and white knob', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const consent = fs.readFileSync(path.join(root, 'src/lib/cookieConsent.ts'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');

  assert.match(consent, /linkedCategory:\s*'analytics'/);
  assert.match(app, /showCookiePreferences/);

  const light = blockVars(css, /#cc-main\s*\{([\s\S]*?)\n\}/);
  const dark = blockVars(
    css,
    /html\.dark #cc-main,\s*\[data-theme='dark'\] #cc-main\s*\{([\s\S]*?)\n\}/,
  );

  const off = resolveColor(light['--cc-toggle-off-bg'], light);
  const block = resolveColor(light['--cc-cookie-category-block-bg'], light);
  const modal = resolveColor(light['--cc-bg'], light);
  const knob = [255, 255, 255];

  const vsBlock = contrastRatio(off, block);
  const vsModal = contrastRatio(off, modal);
  const vsKnob = contrastRatio(knob, off);

  assert.ok(
    vsBlock >= MIN_NON_TEXT_CONTRAST,
    `light off-toggle vs category block ${vsBlock.toFixed(2)}:1 is below ${MIN_NON_TEXT_CONTRAST}:1`,
  );
  assert.ok(
    vsModal >= MIN_NON_TEXT_CONTRAST,
    `light off-toggle vs modal bg ${vsModal.toFixed(2)}:1 is below ${MIN_NON_TEXT_CONTRAST}:1`,
  );
  assert.ok(
    vsKnob >= MIN_NON_TEXT_CONTRAST,
    `white knob vs light off-toggle ${vsKnob.toFixed(2)}:1 is below ${MIN_NON_TEXT_CONTRAST}:1`,
  );

  const darkOff = resolveColor(dark['--cc-toggle-off-bg'], dark);
  const darkBlock = resolveColor(dark['--cc-cookie-category-block-bg'], dark);
  const darkModal = resolveColor(dark['--cc-bg'], dark);
  assert.ok(
    contrastRatio(darkOff, darkBlock) >= MIN_NON_TEXT_CONTRAST,
    'dark off-toggle vs category block dropped below 3:1',
  );
  assert.ok(
    contrastRatio(darkOff, darkModal) >= MIN_NON_TEXT_CONTRAST,
    'dark off-toggle vs modal bg dropped below 3:1',
  );
});
