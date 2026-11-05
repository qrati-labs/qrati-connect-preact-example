const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const DEMO_ORG_ID = '69ad9c7876d8bf6f864b3a65';

test('organizationId falls back to the public demo org when env is empty', () => {
  const config = fs.readFileSync(path.join(root, 'src/config.ts'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.tsx'), 'utf8');
  const envExample = fs.readFileSync(path.join(root, '.env.example'), 'utf8');

  assert.match(
    config,
    /DEFAULT_EXAMPLE_ORG_ID\s*=\s*'69ad9c7876d8bf6f864b3a65'/,
    'config must declare the public demo org used by sibling Connect examples',
  );
  assert.match(
    config,
    /VITE_ORGANIZATION_ID\s*\|\|\s*DEFAULT_EXAMPLE_ORG_ID/,
    'empty or missing VITE_ORGANIZATION_ID must fall back to the demo org, not empty string',
  );
  assert.equal(
    config.includes("|| ''"),
    false,
    'config must not coerce a missing organization id to an empty string',
  );
  assert.match(
    app,
    /organizationId=\{ORGANIZATION_ID\}/,
    'the gallery embed must pass the resolved ORGANIZATION_ID',
  );
  assert.match(
    envExample,
    /^VITE_ORGANIZATION_ID=69ad9c7876d8bf6f864b3a65$/m,
    '.env.example must document the demo org so optional env copy still works',
  );
  assert.equal(DEMO_ORG_ID.length, 24);
});
