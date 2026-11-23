const { profileForDisplay } = require('./claims.cjs');
// Local checks only improve the error message. Supabase verifies credentials.
async function attemptGoogleLogin(token, clientId, exchange, clearSelection) {
  try {
    profileForDisplay(token, clientId);
    const { error } = await exchange(token);
    if (error) throw error;
  } catch (err) {
    // Clear cached account selection, without signing out an unrelated Supabase session.
    try { await clearSelection(); } catch (_) {}
    throw err;
  }
}
module.exports = { attemptGoogleLogin };
