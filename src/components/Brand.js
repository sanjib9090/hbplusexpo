import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
export default function Brand({ inverse = false }) {
 return <View style={styles.row} accessibilityLabel="HB Plus team portal">
   <View style={[styles.mark, inverse && styles.markInverse]}><Text style={[styles.markText, inverse && styles.markTextInverse]}>H<Text style={styles.plus}>+</Text></Text></View>
   <View><Text style={[styles.name, inverse && styles.light]}>HB+</Text><Text style={[styles.sub, inverse && styles.lightSub]}>TEAM PORTAL</Text></View>
 </View>;
}
const styles = StyleSheet.create({row:{flexDirection:'row',alignItems:'center',gap:10},mark:{height:38,width:38,borderRadius:10,backgroundColor:'#165b4c',alignItems:'center',justifyContent:'center'},markInverse:{backgroundColor:'#dcf3bd'},markText:{fontWeight:'800',fontSize:20,color:'#fff',letterSpacing:-2},markTextInverse:{color:'#174b3b'},plus:{fontSize:14},name:{fontSize:19,fontWeight:'800',color:'#143c30',lineHeight:20},sub:{fontSize:9,fontWeight:'700',letterSpacing:1.5,color:'#678075',marginTop:3},light:{color:'#fff'},lightSub:{color:'#b2cfc3'}});
