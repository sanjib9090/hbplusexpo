const { test } = require('node:test');
const assert = require('node:assert/strict');
const { decodePayload, profileForDisplay } = require('../src/auth/claims.cjs');
const client = 'test.apps.googleusercontent.com';
const base = {iss:'https://accounts.google.com',aud:client,sub:'123',email:'person@outlook.com',email_verified:true,exp:2000000000,name:'José'};
function token(value) { return `e30.${Buffer.from(JSON.stringify(value)).toString('base64url')}.signature`; }
test('decodes a Google-like profile including Unicode for presentation', () => {
  assert.equal(decodePayload(token(base)).name, 'José');
  assert.equal(profileForDisplay(token(base),client,1000).user.email,'person@outlook.com');
  assert.equal(profileForDisplay(token({...base,email:'staff@hbplus.fit',hd:'hbplus.fit'}),client,1000).user.email,'staff@hbplus.fit');
});
test('rejects malformed, expired and disallowed claims', () => {
  for (const value of [{...base,aud:'wrong'}, {...base,exp:0}, {...base,email:'person@gmail.com'}, {...base,email_verified:false}, {...base,email:'staff@hbplus.fit',hd:undefined}]) assert.throws(() => profileForDisplay(token(value),client,1000));
  for (const value of ['bad','a.!.b','a.A.b',null]) assert.throws(() => decodePayload(value));
});
