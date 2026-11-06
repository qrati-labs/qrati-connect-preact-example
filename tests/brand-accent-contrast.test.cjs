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

function resolveColor(value, vars) {
  const cleaned = value.replace(/!important/gi, '').trim();
  const ref = cleaned.match(/^var\((--[a-z0-9-]+)\)/i);
  if (ref) {
    assert.ok(vars[ref[1]], `theme is missing ${ref[1]}`);
    return resolveColor(vars[ref[1]], vars);
  }
  return parseHex(cleaned);
}

function heroKickerColor(css) {
  const block = css.match(/\.hero-kicker\s*\{([^}]+)\}/);
  assert.ok(block, 'missing .hero-kicker rule');
  const color = block[1].match(/color\s*:\s*([^;]+);/i);
  assert.ok(color, '.hero-kicker must set color');
  return color[1].trim();
}

test('light-theme brand-accent text contrast is at least 4.5:1 on white', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');

  assert.match(app, /class="hero-kicker"/);
  assert.match(app, /class="hero-copy"/);
  assert.match(app, /class="seo-kicker"/);
  assert.match(app, /class="footer-title"/);

  const light = themeVars(css, 'light');
  const white = parseHex('#ffffff');
  const names = ['--brand-accent', '--pill-text-hover', '--footer-link-hover'];
  for (const name of names) {
    assert.ok(light[name], `light theme missing ${name}`);
    const ratio = contrastRatio(resolveColor(light[name], light), white);
    assert.ok(
      ratio >= MIN_NORMAL_TEXT_CONTRAST,
      `light ${name} contrast ${ratio.toFixed(2)}:1 is below ${MIN_NORMAL_TEXT_CONTRAST}:1`,
    );
  }

  const kicker = heroKickerColor(css);
  const kickerRatio = contrastRatio(resolveColor(kicker, light), white);
  assert.ok(
    kickerRatio >= MIN_NORMAL_TEXT_CONTRAST,
    `.hero-kicker color contrast ${kickerRatio.toFixed(2)}:1 is below ${MIN_NORMAL_TEXT_CONTRAST}:1`,
  );
});

test('dark-theme brand-accent text contrast stays at least 4.5:1 on the dark page background', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const dark = themeVars(css, 'dark');
  assert.ok(dark['--brand-accent'], "dark theme missing --brand-accent");
  assert.ok(dark['--page-bg'], "dark theme missing --page-bg");
  const ratio = contrastRatio(
    resolveColor(dark['--brand-accent'], dark),
    resolveColor(dark['--page-bg'], dark),
  );
  assert.ok(
    ratio >= MIN_NORMAL_TEXT_CONTRAST,
    `dark --brand-accent contrast ${ratio.toFixed(2)}:1 is below ${MIN_NORMAL_TEXT_CONTRAST}:1`,
  );
});
