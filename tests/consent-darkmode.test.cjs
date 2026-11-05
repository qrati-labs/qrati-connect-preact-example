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

test('host theme writers enable vanilla-cookieconsent dark mode', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  const script = themeBootstrapScript(html);

  assert.match(script, /classList\.toggle\(['"]cc--darkmode['"],\s*theme === ['"]dark['"]\)/);
  assert.match(app, /function initTheme\(\)/);
  assert.match(app, /const toggleTheme = \(\) =>/);

  const initBlock = app.slice(app.indexOf('function initTheme()'), app.indexOf('export function App()'));
  const toggleBlock = app.slice(app.indexOf('const toggleTheme = () =>'), app.indexOf('return ('));

  assert.match(initBlock, /classList\.toggle\(['"]cc--darkmode['"],\s*theme === ['"]dark['"]\)/);
  assert.match(toggleBlock, /classList\.toggle\(['"]cc--darkmode['"],\s*(?:next|theme) === ['"]dark['"]\)/);
});
