const { isAllowedEmail, DENIED_MESSAGE } = require('./policy.cjs');
// Decode the JWT payload for display ONLY. No signature verification is performed.
function decodePayload(token) {
  if (typeof token !== 'string' || token.length > 16384) throw new Error('Invalid Google credential.');
  const parts = token.split('.');
  if (parts.length !== 3 || !/^[A-Za-z0-9_-]+$/.test(parts[1])) throw new Error('Invalid Google credential.');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const input = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  if (input.length % 4 === 1) throw new Error('Invalid Google credential.');
  let bits = 0, value = 0, encoded = '';
  for (const char of input) {
    value = (value << 6) | chars.indexOf(char); bits += 6;
    if (bits >= 8) { bits -= 8; encoded += '%' + ((value >> bits) & 255).toString(16).padStart(2, '0'); }
  }
  try { return JSON.parse(decodeURIComponent(encoded)); }
  catch (_) { throw new Error('Invalid Google credential.'); }
}
function profileForDisplay(token, clientId, now = Date.now()) {
  const claims = decodePayload(token);
  if (!claims || claims.aud !== clientId || !['accounts.google.com', 'https://accounts.google.com'].includes(claims.iss) || typeof claims.exp !== 'number' || !Number.isFinite(claims.exp) || claims.exp * 1000 <= now || !claims.sub || claims.email_verified !== true || !isAllowedEmail(claims.email)) throw new Error(DENIED_MESSAGE);
  if (claims.email.trim().toLowerCase().endsWith('@hbplus.fit') && claims.hd !== 'hbplus.fit') throw new Error(DENIED_MESSAGE);
  return { user: { email: claims.email, displayName: typeof claims.name === 'string' ? claims.name : '' }, expiresAt: claims.exp * 1000 };
}
module.exports = { decodePayload, profileForDisplay };
