const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isAllowedEmail } = require('../src/auth/policy.cjs');
test('accepts exact allowed domains, ignoring case', () => { for (const email of ['example@hbplus.fit','EXAMPLE@HBPLUS.FIT','person@outlook.com','PERSON@OUTLOOK.COM']) assert.equal(isAllowedEmail(email),true); });
test('rejects other domains and deceptive addresses', () => { for (const email of ['example@gmail.com','foo@hbplus.fit.evil.com','foo@outlook.com.evil.com','foo@evil-outlook.com','foo@hbplus.fit@evil.com','@outlook.com','foo bar@hbplus.fit','',null]) assert.equal(isAllowedEmail(email), false, String(email)); });
