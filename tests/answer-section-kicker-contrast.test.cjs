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

function lerpColor(a, b, t) {
  return {
    rgb: a.rgb.map((channelValue, i) => channelValue * (1 - t) + b.rgb[i] * t),
    alpha: a.alpha * (1 - t) + b.alpha * t,
  };
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

function gradientStops(backgroundValue, vars) {
  const match = String(backgroundValue).match(/linear-gradient\(\s*[^,]+,\s*(.+)\s*\)$/i);
  assert.ok(match, `expected linear-gradient background, got ${JSON.stringify(backgroundValue)}`);
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of match[1]) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  assert.equal(parts.length, 2, `expected two gradient stops, got ${JSON.stringify(parts)}`);
  return parts.map((part) => resolveColorValue(part, vars));
}

function answerSectionBackground(css, theme, vars) {
  const themed = ruleBody(css, `[data-theme='${theme}'] .answer-section`);
  const base = ruleBody(css, '.answer-section');
  assert.ok(base, 'missing .answer-section rule');
  const backgroundRaw = (themed && declaration(themed, 'background')) || declaration(base, 'background');
  assert.ok(backgroundRaw, '.answer-section must set background');
  return gradientStops(backgroundRaw, vars);
}

function pageBackground(vars) {
  assert.ok(vars['--page-bg'], 'theme missing --page-bg');
  return resolveColorValue(vars['--page-bg'], vars).rgb;
}

test('answer-section kicker exists on the host landing page', () => {
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  assert.match(app, /class="answer-section"/);
  assert.match(app, /class="seo-kicker"/);
  assert.match(app, /The short answer/);
});

test('answer-section kicker contrast is at least 4.5:1 on the card wash in both themes', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const kickerBody = ruleBody(css, '.seo-kicker');
  assert.ok(kickerBody, 'missing .seo-kicker rule');
  const kickerColorRaw = declaration(kickerBody, 'color');
  assert.ok(kickerColorRaw, '.seo-kicker must set color');

  for (const theme of ['light', 'dark']) {
    const vars = themeVars(css, theme);
    const fg = resolveColorValue(kickerColorRaw, vars).rgb;
    const pageBg = pageBackground(vars);
    const stops = answerSectionBackground(css, theme, vars);
    const samples = [0, 0.25, 0.5, 0.75, 1].map((t) => {
      const layer = lerpColor(stops[0], stops[1], t);
      return composite(layer, pageBg);
    });
    for (const bg of samples) {
      const ratio = contrastRatio(fg, bg);
      assert.ok(
        ratio >= MIN_NORMAL_TEXT_CONTRAST,
        `${theme} .answer-section .seo-kicker contrast ${ratio.toFixed(2)}:1 is below ${MIN_NORMAL_TEXT_CONTRAST}:1`,
      );
    }
  }
});
