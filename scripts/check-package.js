const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Exercise package resolution; the ESLint resolver does not support package self-references.
// eslint-disable-next-line import/no-self-import, import/no-unresolved
const commonjs = require('sparrow');

async function checkPackage() {
  // eslint-disable-next-line import/no-self-import, import/no-unresolved
  const esm = await import('sparrow');
  const browser = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../dist/sparrow.js'), 'utf8'), browser);

  const expected = [
    'cartesian', 'createBand', 'createCoordinate', 'createIdentity', 'createLinear',
    'createLog', 'createOrdinal', 'createPoint', 'createQuantile', 'createQuantize',
    'createRenderer', 'createThreshold', 'createTime', 'drawRedRect', 'interpolateColor',
    'interpolateNumber', 'point', 'polar', 'text', 'transpose',
  ];
  for (const api of [commonjs, esm, browser.sp]) {
    assert.deepStrictEqual(Object.keys(api).sort(), expected.slice().sort());
    assert.strictEqual(api.createLinear({ domain: [0, 10], range: [0, 100] })(5), 50);
    const coordinate = api.createCoordinate({
      width: 100, height: 50, transforms: [api.cartesian()],
    });
    const [x, y] = coordinate([0.5, 0.5]);
    assert.strictEqual(x, 50);
    assert.strictEqual(y, 25);
  }
  process.stdout.write('CommonJS, ES Module and browser UMD package checks passed.\n');
}

checkPackage().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
