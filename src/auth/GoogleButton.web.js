import React, { useEffect, useRef } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { useAuth } from './AuthProvider';
let loader;
let initialized = false;
let onCredential = null;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!loader) loader = new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true;
    script.onload = resolve; script.onerror = () => { loader = null; script.remove(); reject(new Error('Could not load Google Sign-In.')); }; document.head.appendChild(script);
  });
  return loader;
}
export default function GoogleButton({ styles }) {
  const { busy, configured, login, reportError } = useAuth();
  const node = useRef(null);
  const { width } = useWindowDimensions();
  const buttonWidth = Math.max(180, Math.min(340, Math.floor(width - 96)));
  useEffect(() => {
    if (!configured) return;
    let active = true;
    const handle = (response) => { if (active && response.credential) login(response.credential); };
    onCredential = handle;
    loadGoogle().then(() => {
      if (!active || !node.current) return;
      // GIS is global and should be initialized only once per page.
      if (!initialized) {
        window.google.accounts.id.initialize({ client_id: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, callback: response => onCredential?.(response), auto_select: false });
        initialized = true;
      }
      node.current.replaceChildren();
      window.google.accounts.id.renderButton(node.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: buttonWidth });
    }).catch(error => { if (active) reportError(error); });
    return () => { active = false; if (onCredential === handle) onCredential = null; if (node.current) node.current.replaceChildren(); };
  }, [configured, login, reportError, buttonWidth]);
  return <View style={[styles.googleButton, { backgroundColor: 'transparent' }, (busy || !configured) && styles.disabled]} pointerEvents={busy || !configured ? 'none' : 'auto'}>
    {configured ? <div ref={node} /> : <Text style={styles.buttonText}>Continue with Google</Text>}
  </View>;
}
