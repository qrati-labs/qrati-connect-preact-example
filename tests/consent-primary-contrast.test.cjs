const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const MIN_NORMAL_TEXT_CONTRAST = 4.5;

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

test('cookie-consent primary button white-on-fill contrast is at least 4.5:1 in both themes', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const consent = fs.readFileSync(path.join(root, 'src/lib/cookieConsent.ts'), 'utf8');

  assert.match(consent, /acceptAllBtn:\s*'Accept all'/);
  assert.match(consent, /savePreferencesBtn:\s*'Save preferences'/);

  const light = blockVars(css, /#cc-main\s*\{([\s\S]*?)\n\}/);
  const dark = blockVars(
    css,
    /html\.dark #cc-main,\s*\[data-theme='dark'\] #cc-main\s*\{([\s\S]*?)\n\}/,
  );

  for (const [theme, vars] of [['light', light], ['dark', dark]]) {
    const fg = resolveColor(vars['--cc-btn-primary-color'], vars);
    const bg = resolveColor(vars['--cc-btn-primary-bg'], vars);
    const hoverBg = resolveColor(vars['--cc-btn-primary-hover-bg'], vars);
    const rest = contrastRatio(fg, bg);
    const hover = contrastRatio(fg, hoverBg);
    assert.ok(
      rest >= MIN_NORMAL_TEXT_CONTRAST,
      `${theme} consent primary contrast ${rest.toFixed(2)}:1 is below ${MIN_NORMAL_TEXT_CONTRAST}:1`,
    );
    assert.ok(
      hover >= MIN_NORMAL_TEXT_CONTRAST,
      `${theme} consent primary hover contrast ${hover.toFixed(2)}:1 is below ${MIN_NORMAL_TEXT_CONTRAST}:1`,
    );
  }
});
