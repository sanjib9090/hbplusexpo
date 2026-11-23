import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { Atmosphere, BrandMark } from './src/components/Glass';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import Profile from './src/screens/Profile';
function Splash() {
  return <Atmosphere><View style={styles.splash} accessibilityLabel="HB Plus loading"><View style={styles.logoBox}><BrandMark style={styles.logo} /></View><Text style={styles.splashName}>HB+ GLASS</Text><Text style={styles.splashCopy}>A little room to breathe.</Text></View></Atmosphere>;
}
function Gate() {
 const { user, initializing, profileState, retryProfile, logout, busy, error } = useAuth();
 const [editing, setEditing] = useState(false);
 useEffect(() => { setEditing(false); }, [user?.id]);
 const [minimumSplash, setMinimumSplash] = useState(true);
 useEffect(() => { const id = setTimeout(() => setMinimumSplash(false), 1200); return () => clearTimeout(id); }, []);
 useEffect(() => {
   if (Platform.OS === 'web' && !initializing && !minimumSplash) {
     const target = !user ? '/' : (profileState.status === 'missing' || editing ? '/profile' : '/dashboard');
     if (window.location.pathname !== target) window.history.replaceState(null, '', target);
   }
 }, [user, initializing, minimumSplash, profileState.status, editing]);
 if (initializing || minimumSplash) return <Splash />;
 if (!user) return <Login />;
 if (profileState.status === 'idle' || profileState.status === 'loading' || profileState.userId !== user.id) return <Splash />;
 if (profileState.status === 'error') return <Atmosphere><View style={styles.splash}><Text style={styles.splashName}>COULD NOT LOAD PROFILE</Text><Text accessibilityRole="alert" style={styles.splashCopy}>{profileState.message}{error ? `\n${error}` : ''}</Text><Text accessibilityRole="button" onPress={retryProfile} style={styles.action}>Try again</Text><Text accessibilityRole="button" onPress={busy ? undefined : logout} style={styles.action}>Sign out</Text></View></Atmosphere>;
 if (profileState.status === 'missing' || editing) return <Profile editing={editing} onCancel={() => setEditing(false)} />;
 return <Dashboard onEditProfile={() => setEditing(true)} />;
}
export default function App() { return <SafeAreaProvider><AuthProvider><StatusBar style="light" /><Gate /></AuthProvider></SafeAreaProvider>; }
const styles = StyleSheet.create({splash:{flex:1,justifyContent:'center',alignItems:'center',padding:24},logoBox:{width:144,height:144,borderRadius:38,borderColor:'rgba(232,255,238,.23)',borderWidth:1,backgroundColor:'rgba(236,255,241,.12)',alignItems:'center',justifyContent:'center'},logo:{width:95,height:58},splashName:{fontSize:16,color:'#f5fff7',fontWeight:'800',letterSpacing:3,marginTop:30},splashCopy:{fontSize:15,color:'#c4dfcf',marginTop:12,textAlign:'center'},action:{color:'#effff5',fontSize:16,fontWeight:'700',padding:14,marginTop:8}});
