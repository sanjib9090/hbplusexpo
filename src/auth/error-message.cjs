const { DENIED_MESSAGE } = require('./policy.cjs');
function signInErrorMessage(error, platform) {
  const code = String(error?.code || '');
  const message = String(error?.message || '');
  if (code === 'cancelled' || code === 'SIGN_IN_CANCELLED' || code === '12501') return 'Sign-in canceled. Tap Continue to try again.';
  if (message === DENIED_MESSAGE) return 'Account not allowed. Choose an approved Google account.';
  if (platform === 'android' && (code === '10' || /DEVELOPER_ERROR/i.test(message))) return 'Google sign-in needs setup. Check the Android app ID and signing SHA-1.';
  if (/network|failed to fetch|internet|offline/i.test(message)) return 'Connection problem. Check your internet and try again.';
  return 'Could not sign in. Please try again.';
}
function profileErrorMessage(error, operation = 'load') {
  const code = String(error?.code || '');
  const message = String(error?.message || '');
  if (/network|failed to fetch|internet|offline/i.test(message)) return 'Connection problem. Check your internet and try again.';
  if (code === '42501' || /row.level security|permission denied/i.test(message)) return 'Profile access was denied. Contact support.';
  if (['23502', '42703', 'PGRST204', '42P01'].includes(code) || /does not exist|schema cache/i.test(message)) return 'Profile setup needs attention. Contact support.';
  if (code === '23505') return 'This profile conflicts with an existing record. Contact support.';
  return operation === 'save' ? 'Could not save your profile. Please try again.' : 'Could not load your profile. Please try again.';
}
module.exports = { signInErrorMessage, profileErrorMessage };
