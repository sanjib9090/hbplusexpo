import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
let initialized = false;
export function configureGoogle() {
  if (!initialized) {
    GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined });
    initialized = true;
  }
}
export async function signInWithGoogle() {
  configureGoogle();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Reset the app's cached Google selection so the user can choose another account.
  try { await GoogleSignin.signOut(); } catch (_) {}
  const result = await GoogleSignin.signIn();
  if (!isSuccessResponse(result)) { const error = new Error('Sign-in was cancelled.'); error.code = 'cancelled'; throw error; }
  if (!result.data.idToken) throw new Error('Google did not return an ID token. Check your OAuth configuration.');
  return result.data.idToken;
}
export async function restoreToken() {
  configureGoogle();
  try { const result = await GoogleSignin.signInSilently(); return isSuccessResponse(result) ? result.data.idToken : null; } catch (_) { return null; }
}
export async function saveToken() {}
export async function clearGoogleSession() { configureGoogle(); await GoogleSignin.signOut(); }
