import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Atmosphere, Glass, BrandMark } from '../components/Glass';
import AdaptiveScrollView from '../components/AdaptiveScrollView';
import errors from '../auth/error-message.cjs';
import { useAuth } from '../auth/AuthProvider';
import validation from '../auth/profile-validation.cjs';

export default function Profile({ editing = false, onCancel }) {
  const { user, profileState, saveProfile, logout, busy, error: authError } = useAuth();
  const initial = profileState.profile;
  const [name, setName] = useState(initial?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');
  const { width, height } = useWindowDimensions();
  const wide = width >= 840;
  const compact = !wide;
  const short = !wide && height <= 600;
  const submit = async () => {
    const message = validation.validateProfile(name, phone);
    if (message) { setError(message); return; }
    setError(''); setSaving(true);
    try { await saveProfile({ fullName: name.trim(), phone: phone.trim() }); if (editing) onCancel(); }
    catch (err) { setError(errors.profileErrorMessage(err, 'save')); }
    finally { setSaving(false); }
  };
  return <Atmosphere><KeyboardAvoidingView style={styles.keyboardArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><AdaptiveScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.page, compact && styles.pageCompact, wide && styles.pageWide]}>
    <View style={styles.header}><View style={styles.brand}><BrandMark style={styles.mark}/><Text style={styles.brandText}>HB+  GLASS</Text></View><Pressable accessibilityRole="button" onPress={logout} disabled={busy || saving} style={styles.outline}><Text style={styles.outlineText}>Sign out</Text></Pressable></View>
    <View style={[styles.center, compact && styles.centerCompact, short && styles.centerShort]}><Glass blur={false} style={[styles.card, compact && styles.cardCompact, short && styles.cardShort, wide && styles.cardWide]}>
      <Text style={styles.eyebrow}>{editing ? 'YOUR ACCOUNT' : 'ONE LAST STEP'}</Text>
      <Text style={[styles.title, compact && styles.titleCompact]}>{editing ? 'Your profile' : 'Let’s get to know you.'}</Text>
      {!short && <Text style={[styles.copy, compact && styles.copyCompact]}>{editing ? 'Update your details whenever you need to.' : 'Complete your profile to make this space yours.'}</Text>}
      <Text style={[styles.label, compact && styles.labelCompact, short && styles.labelShort]}>Email</Text><View style={[styles.readOnly, short && styles.fieldShort]}><Text style={styles.value} selectable>{user?.email}</Text></View><Text style={styles.hint}>From your Google account · cannot be edited here</Text>
      <Text style={[styles.label, compact && styles.labelCompact, short && styles.labelShort]}>Full name *</Text><TextInput accessibilityLabel="Full name" value={name} onChangeText={setName} maxLength={100} autoCapitalize="words" autoComplete="name" placeholder="Your name" placeholderTextColor="#5c7569" style={[styles.input, short && styles.fieldShort, focused === 'name' && styles.inputFocused]} onFocus={() => setFocused('name')} onBlur={() => setFocused('')} editable={!saving}/>
      <Text style={[styles.label, compact && styles.labelCompact, short && styles.labelShort]}>Phone number <Text style={styles.optional}>(optional)</Text></Text><TextInput accessibilityLabel="Phone number (optional)" value={phone} onChangeText={setPhone} maxLength={30} keyboardType="phone-pad" autoComplete="tel" placeholder="Your phone number" placeholderTextColor="#5c7569" style={[styles.input, short && styles.fieldShort, focused === 'phone' && styles.inputFocused]} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} editable={!saving}/>
      {!!(error || authError) && <Text accessibilityRole="alert" style={styles.error}>{error || authError}</Text>}
      <Pressable accessibilityRole="button" onPress={submit} disabled={saving || busy} style={[styles.primary,compact && styles.primaryCompact,(saving || busy) && styles.disabled]}>{saving ? <ActivityIndicator color="#173e30" /> : <Text style={styles.primaryText}>{editing ? 'Save changes' : 'Complete profile'}</Text>}</Pressable>
      {editing && <Pressable accessibilityRole="button" disabled={saving} onPress={onCancel} style={styles.cancel}><Text style={styles.cancelText}>Cancel</Text></Pressable>}
    </Glass></View>{!short && <Text style={styles.footer}>BODY  ·  MIND  ·  GUT</Text>}
  </AdaptiveScrollView></KeyboardAvoidingView></Atmosphere>;
}
const styles = StyleSheet.create({keyboardArea:{flex:1},centerShort:{paddingVertical:4},cardShort:{padding:14},labelShort:{marginTop:8,marginBottom:4},fieldShort:{minHeight:46},pageCompact:{paddingHorizontal:16,paddingVertical:10},centerCompact:{paddingVertical:14},cardCompact:{padding:18},titleCompact:{fontSize:26,lineHeight:32,marginTop:8},copyCompact:{marginTop:5,marginBottom:4},labelCompact:{marginTop:12,marginBottom:6},primaryCompact:{marginTop:16},page:{flexGrow:1,width:'100%',maxWidth:580,alignSelf:'center',paddingHorizontal:24,paddingVertical:20},pageWide:{maxWidth:1360,paddingHorizontal:48,paddingVertical:28},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},brand:{flexDirection:'row',alignItems:'center',gap:10},mark:{width:38,height:27},brandText:{color:'#f4fff7',fontSize:13,fontWeight:'800',letterSpacing:1.4},outline:{minHeight:44,paddingHorizontal:16,borderWidth:1,borderColor:'rgba(237,255,244,.3)',borderRadius:12,justifyContent:'center'},outlineText:{color:'#f4fff7',fontWeight:'700'},center:{flex:1,justifyContent:'center',paddingVertical:40},card:{padding:24,width:'100%',alignSelf:'center',backgroundColor:'#17443b'},cardWide:{maxWidth:530,padding:40},eyebrow:{color:'#cdebd5',fontSize:11,letterSpacing:1.4,fontWeight:'700'},title:{color:'#fff',fontSize:30,lineHeight:38,fontWeight:'700',letterSpacing:-.7,marginTop:14},copy:{color:'#d4e8dc',fontSize:15,lineHeight:23,marginTop:8,marginBottom:10},label:{color:'#edf9f0',fontSize:14,fontWeight:'700',marginTop:20,marginBottom:8},optional:{color:'#c4ddce',fontWeight:'400'},input:{minHeight:52,borderWidth:2,borderColor:'#c0d9c8',backgroundColor:'#f8fff9',borderRadius:12,paddingHorizontal:15,color:'#173e30',fontSize:16},inputFocused:{borderColor:'#77dba1'},readOnly:{minHeight:52,borderWidth:1,borderColor:'rgba(226,255,235,.14)',backgroundColor:'rgba(9,44,37,.18)',borderRadius:12,paddingHorizontal:15,justifyContent:'center'},value:{color:'#d4e8dc',fontSize:15},hint:{color:'#c2dccc',fontSize:12,marginTop:6},primary:{minHeight:52,marginTop:24,borderRadius:12,backgroundColor:'#c8efd2',alignItems:'center',justifyContent:'center'},primaryText:{color:'#173e30',fontSize:15,fontWeight:'800'},disabled:{opacity:.55},cancel:{minHeight:44,alignItems:'center',justifyContent:'center',marginTop:8},cancelText:{color:'#e2f6e8',fontWeight:'700'},error:{color:'#752f24',backgroundColor:'#fff1ea',borderRadius:10,padding:12,fontSize:14,lineHeight:20,marginTop:16},footer:{textAlign:'center',fontSize:10,color:'#bfdbca',fontWeight:'700',letterSpacing:1.4}});
