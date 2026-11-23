function validateProfile(fullName, phone) {
  const name = String(fullName || '').trim();
  const number = String(phone || '').trim();
  if (!name) return 'Enter your name to continue.';
  if (name.length > 100) return 'Your name must be 100 characters or fewer.';
  if (number.length > 30) return 'Your phone number must be 30 characters or fewer.';
  return '';
}
module.exports = { validateProfile };
