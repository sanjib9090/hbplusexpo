import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Atmosphere, Glass, BrandMark } from '../components/Glass';
import AdaptiveScrollView from '../components/AdaptiveScrollView';
import { useAuth } from '../auth/AuthProvider';
import GoogleButton from '../auth/GoogleButton';
export default function Login() {
 const { error, configured, clearError } = useAuth();
 const { width, height } = useWindowDimensions();
 const wide = width >= 840;
 const compact = !wide;
 const short = !wide && (height <= 650 || !!error);
 return <Atmosphere><AdaptiveScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.page, compact && styles.pageCompact, wide && styles.pageWide]}>
   <View style={styles.top}><View style={styles.miniIcon}><BrandMark style={styles.miniMark} /></View><Text style={styles.topText}>HB+  GLASS</Text><View style={styles.spacer}/><View style={styles.tag}><Text style={styles.tagText}>WELCOME</Text></View></View>
   <View style={[styles.main, compact && styles.mainCompact, short && styles.mainShort, wide && styles.mainWide]}>
     <View style={[styles.intro, wide && styles.introWide]}>
       <Glass style={[styles.emblem, compact && styles.emblemCompact, short && styles.emblemShort, wide && styles.emblemWide]}><BrandMark style={[styles.emblemMark, compact && styles.emblemMarkCompact]}/></Glass>
       {wide && <Text style={styles.wideKicker}>A LITTLE SPACE FOR YOU</Text>}
       <Text style={[styles.title,compact && styles.titleCompact,wide && styles.titleWide]}>Welcome to HB<Text style={styles.accent}>+</Text></Text>
       <Text style={[styles.subtitle,compact && styles.subtitleCompact,wide && styles.subtitleWide]}>A little space for a better day.</Text>
       {wide && <Text style={styles.wideDescription}>Take a moment to slow down, reconnect, and find a fresh perspective.</Text>}
     </View>
     <Glass style={[styles.card, compact && styles.cardCompact, short && styles.cardShort, wide && styles.cardWide]}>
       <View style={styles.cardHeading}><View style={styles.dot}/><Text style={styles.eyebrow}>SIGN IN TO CONTINUE</Text></View>
       <Text style={[styles.cardTitle, compact && styles.cardTitleCompact]}>Good to see you.</Text>
       <Text style={styles.copy}>Choose your Google account to get started.</Text>
       <View style={[styles.buttonWrap, compact && styles.buttonWrapCompact]}><GoogleButton styles={styles} /></View>
       {!configured && <Text accessibilityRole="alert" style={styles.error}>Add your Google and Supabase configuration in .env and rebuild the app.</Text>}
       {!!error && <View style={styles.errorBox}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text><Pressable accessibilityRole="button" accessibilityLabel="Dismiss message" onPress={clearError} hitSlop={8} style={styles.dismiss}><Text style={styles.dismissText}>✕</Text></Pressable></View>}
       <View style={[styles.divider, compact && styles.dividerCompact]}/>
       <Text style={styles.caption}>For Google accounts using <Text style={styles.emphasis}>@hbplus.fit</Text>  <Text style={styles.emphasis}></Text>.</Text>
     </Glass>
   </View>
   {!short && <View style={[styles.footer,compact && styles.footerCompact,wide && styles.footerWide]}><Text style={styles.footerMain}>BODY  ·  MIND  ·  GUT</Text><Text style={styles.footerNote}>Your space, made personal</Text></View>}
 </AdaptiveScrollView></Atmosphere>;
}
const styles=StyleSheet.create({
 mainShort:{paddingVertical:8},emblemShort:{height:52,width:52},cardShort:{marginTop:12},
 pageCompact:{paddingHorizontal:16,paddingTop:10,paddingBottom:12},mainCompact:{paddingVertical:12},emblemCompact:{height:62,width:62,borderRadius:20},emblemMarkCompact:{width:44,height:30},titleCompact:{fontSize:27,lineHeight:33,marginTop:10},subtitleCompact:{fontSize:15,lineHeight:21,marginTop:4},cardCompact:{padding:18,marginTop:16},cardTitleCompact:{marginTop:10},buttonWrapCompact:{marginTop:14},dividerCompact:{marginVertical:12},footerCompact:{gap:3},
 page:{flexGrow:1,width:'100%',maxWidth:500,alignSelf:'center',paddingHorizontal:24,paddingTop:16,paddingBottom:20},pageWide:{maxWidth:1360,paddingHorizontal:48,paddingTop:28,paddingBottom:28},top:{flexDirection:'row',alignItems:'center',gap:10,minHeight:44},miniIcon:{width:40,height:40,borderRadius:13,borderWidth:1,borderColor:'rgba(233,255,240,.24)',backgroundColor:'rgba(236,255,242,.11)',alignItems:'center',justifyContent:'center'},miniMark:{width:28,height:18},topText:{color:'#f4fff7',fontSize:13,fontWeight:'800',letterSpacing:1.4},spacer:{flex:1},tag:{borderWidth:1,borderColor:'rgba(226,255,235,.20)',borderRadius:30,paddingHorizontal:12,paddingVertical:7},tagText:{fontSize:10,letterSpacing:1,color:'#d3eadb',fontWeight:'700'},
 main:{flex:1,justifyContent:'center',paddingVertical:28},mainWide:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:48,paddingVertical:64},intro:{alignItems:'center'},introWide:{alignItems:'flex-start',flex:1,maxWidth:620},emblem:{height:90,width:90,borderRadius:28,alignItems:'center',justifyContent:'center',alignSelf:'center'},emblemWide:{alignSelf:'flex-start'},emblemMark:{width:62,height:42},wideKicker:{color:'#c5e9d0',fontSize:11,letterSpacing:1.7,fontWeight:'700',marginTop:34},title:{color:'#f8fff9',fontSize:32,lineHeight:39,letterSpacing:-.8,fontWeight:'700',marginTop:22,textAlign:'center'},titleWide:{fontSize:58,lineHeight:66,letterSpacing:-2,textAlign:'left',marginTop:16},accent:{color:'#bdebc8'},subtitle:{color:'#d0e5d8',fontSize:16,lineHeight:24,textAlign:'center',marginTop:8},subtitleWide:{fontSize:20,lineHeight:30,textAlign:'left',marginTop:14},wideDescription:{color:'#c0d9cb',fontSize:16,lineHeight:26,maxWidth:450,marginTop:20},
 card:{padding:24,marginTop:30},cardWide:{width:420,padding:36,marginTop:0},cardHeading:{flexDirection:'row',alignItems:'center',gap:8},dot:{width:7,height:7,borderRadius:4,backgroundColor:'#b7edc5'},eyebrow:{color:'#cdebd5',fontSize:11,letterSpacing:1.4,fontWeight:'700'},cardTitle:{color:'#fff',fontSize:23,lineHeight:30,fontWeight:'700',letterSpacing:-.4,marginTop:18},copy:{color:'#d4e8dc',fontSize:15,lineHeight:23,marginTop:6},buttonWrap:{marginTop:22,alignItems:'center'},googleButton:{minHeight:52,width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:12,borderRadius:10,backgroundColor:'#fff',overflow:'hidden'},disabled:{opacity:.55},googleG:{fontSize:20,fontWeight:'800',color:'#4285f4'},buttonText:{fontSize:15,fontWeight:'700',color:'#173e30'},divider:{height:1,backgroundColor:'rgba(230,255,238,.22)',marginVertical:19},caption:{color:'#d4e8dc',fontSize:14,lineHeight:21},emphasis:{color:'#f2fff5',fontWeight:'700'},errorBox:{flexDirection:'row',alignItems:'flex-start',gap:8,backgroundColor:'#fff1ea',borderRadius:10,padding:10,marginTop:12},errorText:{flex:1,color:'#752f24',fontSize:13,lineHeight:19},dismiss:{minWidth:32,minHeight:32,alignItems:'center',justifyContent:'center'},dismissText:{color:'#752f24',fontSize:16,fontWeight:'700'},error:{color:'#752f24',backgroundColor:'#fff1ea',borderRadius:10,padding:12,fontSize:14,lineHeight:20,marginTop:14},
 footer:{alignItems:'center',gap:8},footerWide:{flexDirection:'row',justifyContent:'space-between'},footerMain:{color:'#bedac9',fontSize:10,fontWeight:'700',letterSpacing:1.5},footerNote:{color:'#c1d9cc',fontSize:12,lineHeight:18,textAlign:'center'}
});
