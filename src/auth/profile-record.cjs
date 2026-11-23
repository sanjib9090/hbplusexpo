// Construct the database record from the authenticated session and form fields.
function profileRecord(userId, email, fullName, phone) {
  if (!userId || !email) throw new Error('Your account email is unavailable. Please sign in again.');
  return { id: userId, email, full_name: fullName, phone: phone || null };
}
module.exports = { profileRecord };
