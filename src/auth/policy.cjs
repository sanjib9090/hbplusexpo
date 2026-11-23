const ALLOWED_DOMAINS = ['hbplus.fit'];
const DENIED_MESSAGE = 'Access restricted. Use a Google account with an @hbplus.fit email address.';
function isAllowedEmail(email) {
  if (typeof email !== 'string') return false;
  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 && parts[0].length > 0 && !/\s/.test(parts[0]) && ALLOWED_DOMAINS.includes(parts[1]);
}
module.exports = { ALLOWED_DOMAINS, DENIED_MESSAGE, isAllowedEmail };
