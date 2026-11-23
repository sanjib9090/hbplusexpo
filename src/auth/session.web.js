// Keep the Google ID token in memory only; refreshing the page requires sign-in.
export async function restoreToken() { return null; }
export async function saveToken() {}
export async function clearGoogleSession() {
  if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
}
