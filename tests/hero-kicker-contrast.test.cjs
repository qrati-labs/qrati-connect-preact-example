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

function parseColor(value) {
  const cleaned = String(value).replace(/!important/gi, '').trim();
  const rgba = cleaned.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i);
  if (rgba) {
    return {
      rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])],
      alpha: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  return { rgb: parseHex(cleaned), alpha: 1 };
}

function composite(fg, bg) {
  const a = fg.alpha;
  return fg.rgb.map((channelValue, i) => Math.round(channelValue * a + bg[i] * (1 - a)));
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

function resolveColorValue(value, vars) {
  const cleaned = String(value).replace(/!important/gi, '').trim();
  const ref = cleaned.match(/^var\((--[a-z0-9-]+)\)/i);
  if (ref) {
    assert.ok(vars[ref[1]], `theme is missing ${ref[1]}`);
    return resolveColorValue(vars[ref[1]], vars);
  }
  return parseColor(cleaned);
}

function ruleBody(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  return match ? match[1] : null;
}

function declaration(body, property) {
  const match = body.match(new RegExp(`${property}\\s*:\\s*([^;]+);`, 'i'));
  return match ? match[1].trim() : null;
}

function kickerStyle(css, theme, vars) {
  const base = ruleBody(css, '.hero-kicker');
  assert.ok(base, 'missing .hero-kicker rule');
  const themed = ruleBody(css, `[data-theme='${theme}'] .hero-kicker`);
  const colorRaw = (themed && declaration(themed, 'color')) || declaration(base, 'color');
  const backgroundRaw = (themed && declaration(themed, 'background')) || declaration(base, 'background');
  assert.ok(colorRaw, '.hero-kicker must set color');
  assert.ok(backgroundRaw, '.hero-kicker must set background');
  return {
    color: resolveColorValue(colorRaw, vars),
    background: resolveColorValue(backgroundRaw, vars),
  };
}

test('hero kicker exists on the host landing page', () => {
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  assert.match(app, /class="hero-kicker"/);
  assert.match(app, /Qrati Connect Demo/);
});

test('hero kicker contrast is at least 4.5:1 on the composited chip in both themes', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');

  for (const theme of ['light', 'dark']) {
    const vars = themeVars(css, theme);
    assert.ok(vars['--page-bg'], `${theme} theme missing --page-bg`);
    const pageBg = resolveColorValue(vars['--page-bg'], vars).rgb;
    const kicker = kickerStyle(css, theme, vars);
    const chip = composite(kicker.background, pageBg);
    const ratio = contrastRatio(kicker.color.rgb, chip);
    assert.ok(
      ratio >= MIN_NORMAL_TEXT_CONTRAST,
      `${theme} .hero-kicker contrast ${ratio.toFixed(2)}:1 on composited chip is below ${MIN_NORMAL_TEXT_CONTRAST}:1`,
    );
  }
});
