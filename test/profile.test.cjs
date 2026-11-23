const test = require('node:test');
const assert = require('node:assert/strict');
const { validateProfile } = require('../src/auth/profile-validation.cjs');
test('profile requires a nonblank name and allows optional phone', () => {
  assert.ok(validateProfile('   ', ''));
  assert.equal(validateProfile('Ada Lovelace', ''), '');
  assert.equal(validateProfile('Ada', '+1 555 0100'), '');
});
test('profile limits input lengths', () => {
  assert.ok(validateProfile('x'.repeat(101), ''));
  assert.ok(validateProfile('Ada', '1'.repeat(31)));
  assert.equal(validateProfile('x'.repeat(100), '1'.repeat(30)), '');
});
