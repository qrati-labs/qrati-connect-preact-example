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

function themeVars(css, theme) {
  const block = css.match(new RegExp(`\\[data-theme='${theme}'\\]\\s*\\{([\\s\\S]*?)\\n\\}`));
  assert.ok(block, `missing [data-theme='${theme}'] block`);
  const vars = {};
  for (const match of block[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    vars[`--${match[1]}`] = match[2].trim();
  }
  return vars;
}

function ctaDeclarations(css) {
  const block = css.match(/\.btn-cta-primary\s*\{([^}]+)\}/);
  assert.ok(block, 'missing .btn-cta-primary rule');
  const background = block[1].match(/background\s*:\s*([^;]+);/i);
  const color = block[1].match(/color\s*:\s*([^;]+);/i);
  assert.ok(background, 'CTA must set background');
  assert.ok(color, 'CTA must set color');
  return { background: background[1].trim(), color: color[1].trim() };
}

function resolveColor(value, vars) {
  const cleaned = value.replace(/!important/gi, '').trim();
  const ref = cleaned.match(/^var\((--[a-z0-9-]+)\)/i);
  if (ref) {
    assert.ok(vars[ref[1]], `theme is missing ${ref[1]}`);
    return resolveColor(vars[ref[1]], vars);
  }
  return parseHex(cleaned);
}

test('primary CTA white-on-fill contrast is at least 4.5:1 in both themes', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  const { background, color } = ctaDeclarations(css);

  assert.match(app, /class="btn-cta-primary"/);
  assert.match(background, /^var\(--cta-bg\)$/);
  assert.equal(background.includes('--brand-accent'), false);

  for (const theme of ['light', 'dark']) {
    const vars = themeVars(css, theme);
    const fg = resolveColor(color, vars);
    const bg = resolveColor(background, vars);
    const ratio = contrastRatio(fg, bg);
    assert.ok(
      ratio >= MIN_NORMAL_TEXT_CONTRAST,
      `${theme} CTA contrast ${ratio.toFixed(2)}:1 is below ${MIN_NORMAL_TEXT_CONTRAST}:1 (fg=${fg}, bg=${bg})`,
    );
  }
});
