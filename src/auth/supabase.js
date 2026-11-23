import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import storage from './storage';
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseConfigured = Boolean(url && key);
export const supabase = supabaseConfigured ? createClient(url, key, {
  auth: { storage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
}) : null;
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', state => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
  if (AppState.currentState !== 'active') supabase.auth.stopAutoRefresh();
}
