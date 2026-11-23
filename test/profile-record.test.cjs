const test = require('node:test');
const assert = require('node:assert/strict');
const { profileRecord } = require('../src/auth/profile-record.cjs');
test('profile insert includes authenticated email and optional phone', () => {
  assert.deepEqual(profileRecord('user-id', 'user@example.com', 'Ada', ''), {
    id: 'user-id', email: 'user@example.com', full_name: 'Ada', phone: null
  });
  assert.equal(profileRecord('user-id', 'user@example.com', 'Ada', '123').phone, '123');
});
test('rejects incomplete session before saving', () => {
  assert.throws(() => profileRecord('user-id', undefined, 'Ada', ''), /sign in again/i);
  assert.throws(() => profileRecord('', 'user@example.com', 'Ada', ''), /sign in again/i);
});
