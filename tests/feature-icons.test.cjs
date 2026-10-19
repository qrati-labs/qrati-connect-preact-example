const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const featureMap = app.split('class="feature-map-grid">')[1].split('</div>\n            </section>')[0];

assert.equal((featureMap.match(/class="feature-map-icon"/g) || []).length, 8);
assert.doesNotMatch(featureMap, /data-icon=|iconify/);
assert.doesNotMatch(html, /code\.iconify\.design/);
