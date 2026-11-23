const { test } = require('node:test');
const assert = require('node:assert/strict');
const { attemptGoogleLogin } = require('../src/auth/google-login.cjs');
const client = 'test.apps.googleusercontent.com';
const base = { iss:'https://accounts.google.com', aud:client, sub:'123', email_verified:true, exp:4000000000 };
const token = email => `e30.${Buffer.from(JSON.stringify({...base,email})).toString('base64url')}.signature`;
test('rejected account is cleared and an allowed account can be tried next', async () => {
 let cleared = 0, exchanged = 0;
 const exchange = async () => { exchanged++; return { error:null }; };
 const clear = async () => { cleared++; };
 await assert.rejects(attemptGoogleLogin(token('person@gmail.com'),client,exchange,clear), /Access restricted/);
 assert.equal(cleared, 1); assert.equal(exchanged, 0);
 await attemptGoogleLogin(token('person@outlook.com'),client,exchange,clear);
 assert.equal(exchanged, 1); assert.equal(cleared, 1);
});
test('failed Supabase exchange clears selection and preserves its error', async () => {
 let cleared = false;
 await assert.rejects(attemptGoogleLogin(token('person@outlook.com'),client,async () => ({error:new Error('exchange failed')}),async () => { cleared = true; }), /exchange failed/);
 assert.equal(cleared,true);
});
