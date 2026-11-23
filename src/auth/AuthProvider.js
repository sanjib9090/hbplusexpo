import { Platform } from 'react-native';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { clearGoogleSession } from './session';
import { supabase, supabaseConfigured } from './supabase';
import googleLogin from './google-login.cjs';
import errors from './error-message.cjs';
import profileRecord from './profile-record.cjs';

const Context = createContext(null);
const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const configured = Boolean(clientId && supabaseConfigured && (Platform.OS !== 'ios' || process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID));
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(configured);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [profileState, setProfileState] = useState({ status: 'idle', profile: null });
  const [reload, setReload] = useState(0);
  const user = session?.user || null;
  const userId = user?.id;
  const userEmail = user?.email;
  const clearError = useCallback(() => setError(''), []);
  const reportError = useCallback(err => setError(errors.signInErrorMessage(err, Platform.OS)), []);
  useEffect(() => {
    if (!configured) return;
    // INITIAL_SESSION also covers restoration. Never await Supabase calls inside this callback.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession); setInitializing(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    let active = true;
    if (!userId) { setProfileState({ status: 'idle', profile: null }); return () => { active = false; }; }
    setProfileState({ status: 'loading', profile: null, userId });
    (async () => {
      try {
        const { data, error: dbError } = await supabase.from('profiles').select('id, full_name, phone, updated_at').eq('id', userId).maybeSingle();
        if (dbError) throw dbError;
        if (active) setProfileState({ status: data && typeof data.full_name === 'string' && data.full_name.trim() ? 'ready' : 'missing', profile: data, userId });
      } catch (err) { if (active) setProfileState({ status: 'error', profile: null, message: errors.profileErrorMessage(err), userId }); }
    })();
    return () => { active = false; };
  }, [userId, reload]);
  const login = useCallback(async token => {
    if (!configured || !token) return;
    setError(''); setBusy(true);
    try {
      await googleLogin.attemptGoogleLogin(token, clientId,
        credential => supabase.auth.signInWithIdToken({ provider: 'google', token: credential }),
        clearGoogleSession); 
    } catch (err) { reportError(err); }
    finally { setBusy(false); }
  }, [reportError]);
  const logout = useCallback(async () => {
    setBusy(true); setError('');
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      try { await clearGoogleSession(); } catch (_) {}
    } catch (err) { reportError(err); }
    finally { setBusy(false); }
  }, [reportError]);
  const saveProfile = useCallback(async ({ fullName, phone }) => {
    if (!userId) throw new Error('Your session has ended. Please sign in again.');
    const { data, error: dbError } = await supabase.from('profiles').upsert(profileRecord.profileRecord(userId, userEmail, fullName, phone), { onConflict: 'id' }).select('id, full_name, phone, updated_at').single();
    if (dbError) throw dbError;
    // Reload under the current auth identity rather than committing potentially stale data.
    setReload(value => value + 1);
    return data;
  }, [userId, userEmail]);
  const retryProfile = useCallback(() => setReload(value => value + 1), []);
  return <Context.Provider value={{ user, initializing, busy, error, login, logout, configured, reportError, clearError, profileState, saveProfile, retryProfile }}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
