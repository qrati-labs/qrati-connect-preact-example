const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function themeBootstrapScript(html) {
  const head = html.match(/<head>[\s\S]*<\/head>/);
  assert.ok(head, 'index.html must include a head element');
  const scripts = [...head[0].matchAll(/<script(?![^>]*type=["']module["'])[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]);
  const bootstrap = scripts.find((src) => src.includes('qc-theme') && src.includes('data-theme'));
  assert.ok(bootstrap, 'head must contain a non-module script that applies qc-theme to data-theme');
  return bootstrap;
}

test('index.html applies a validated theme before the module graph loads', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  const script = themeBootstrapScript(html);

  assert.match(html, /<script type="module" src="\/src\/main\.tsx"><\/script>/);
  assert.match(css, /\[data-theme='dark'\]/);
  assert.match(app, /function initTheme\(\)/);

  assert.match(script, /localStorage\.getItem\(['"]qc-theme['"]\)/);
  assert.match(script, /saved === 'light' \|\| saved === 'dark'|saved === \"light\" \|\| saved === \"dark\"/);
  assert.match(script, /prefers-color-scheme:\s*dark/);
  assert.match(script, /setAttribute\(['"]data-theme['"],\s*theme\)/);
  assert.match(script, /classList\.toggle\(['"]dark['"],\s*theme === ['"]dark['"]\)/);
  assert.match(script, /try\s*\{/);
  assert.match(script, /catch/);
  assert.equal(script.includes("setAttribute('data-theme', saved)"), false);
  assert.equal(script.includes('setAttribute("data-theme", saved)'), false);
});
