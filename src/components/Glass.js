import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
const mark = require('../../assets/brand-mark.png');
export function Atmosphere({ children }) {
  return <View style={styles.canvas}>
    <LinearGradient colors={['#071f22', '#123c38', '#102b33']} start={{x:0,y:0}} end={{x:1,y:1}} style={StyleSheet.absoluteFill} />
    <View pointerEvents="none" style={[styles.glow, styles.glowOne]} />
    <View pointerEvents="none" style={[styles.glow, styles.glowTwo]} />
    <SafeAreaView style={styles.safe} edges={['top','bottom','left','right']}>{children}</SafeAreaView>
  </View>;
}
export function Glass({ children, style, blur = true }) {
  return <View style={[styles.glass, style]}>{blur && <BlurView pointerEvents="none" intensity={Platform.OS === 'web' ? 35 : 30} tint="dark" style={StyleSheet.absoluteFill} />}{children}</View>;
}
export function BrandMark({ style }) { return <Image source={mark} style={[styles.mark, style]} resizeMode="contain" accessibilityLabel="HB plus logo" />; }
const styles=StyleSheet.create({canvas:{flex:1,backgroundColor:'#0a2929',overflow:'hidden'},safe:{flex:1},glow:{position:'absolute',borderRadius:9999},glowOne:{width:450,height:450,top:-240,right:-170,backgroundColor:'rgba(150,219,178,0.18)'},glowTwo:{width:430,height:430,bottom:-240,left:-140,backgroundColor:'rgba(116,155,181,0.16)'},glass:{overflow:'hidden',backgroundColor:'rgba(220,255,237,0.10)',borderWidth:1,borderColor:'rgba(239,255,246,0.24)',borderRadius:22},mark:{width:80,height:48}});
