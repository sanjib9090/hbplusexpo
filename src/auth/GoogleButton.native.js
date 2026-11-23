import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useAuth } from './AuthProvider';
import { signInWithGoogle } from './session';
export default function GoogleButton({ styles }) {
  const { busy, configured, login, reportError, clearError } = useAuth();
  const [opening, setOpening] = useState(false);
  const disabled = busy || opening || !configured;
  return <Pressable accessibilityRole="button" accessibilityLabel="Continue with Google" disabled={disabled} onPress={async () => { clearError(); setOpening(true); try { await login(await signInWithGoogle()); } catch (error) { reportError(error); } finally { setOpening(false); } }} style={({pressed}) => [styles.googleButton, (pressed || disabled) && styles.disabled]}>
    {busy || opening ? <ActivityIndicator color="#173d30" /> : <><Text style={styles.googleG}>G</Text><Text style={styles.buttonText}>Continue with Google</Text></>}
  </Pressable>;
}
