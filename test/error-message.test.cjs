const { test }=require('node:test');
const assert=require('node:assert/strict');
const { signInErrorMessage, profileErrorMessage }=require('../src/auth/error-message.cjs');
const { DENIED_MESSAGE }=require('../src/auth/policy.cjs');
test('cancellation is concise and does not claim a configuration issue',()=>{assert.equal(signInErrorMessage({code:'cancelled'},'android'),'Sign-in canceled. Tap Continue to try again.');});
test('developer error points to Android signing configuration',()=>{assert.match(signInErrorMessage({code:'10',message:'DEVELOPER_ERROR'},'android'),/SHA-1/);});
test('account rejection and network failures give actionable messages',()=>{assert.match(signInErrorMessage({message:DENIED_MESSAGE},'web'),/Account not allowed/);assert.match(signInErrorMessage({message:'Failed to fetch'},'web'),/internet/);});
test('database errors are concise and do not expose technical internals',()=>{assert.match(profileErrorMessage({code:'23502',message:'null value in column email'},'save'),/setup needs attention/);assert.doesNotMatch(profileErrorMessage({code:'23502',message:'null value in column email'},'save'),/column/);assert.match(profileErrorMessage({code:'42501'},'save'),/access was denied/);});
