import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>

     <Image
        source={require('../assets/f2.png')}
        style={styles.foodImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>AI-Powered</Text>

      <Text style={styles.titleAccent}>Indian Food</Text>

      <Text style={styles.subtitle}>Recognition & Nutrition Assistant</Text>
      <Text style={styles.tagline}>Scan. Recognize. Understand.{'\n'}Eat Better. Live Better.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Register')}>
        <LinearGradient
  colors={['#168BEE','#0c36c1', '#7618e9']}
  start={{ x: 0, y: 0.5 }}
  end={{ x: 1, y: 0.5 }}
  style={styles.nutritionButton}
>
        <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.loginText}>Login / Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff' },
  titleAccent: { fontSize: 35, fontWeight: '700', color: '#581fdc', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#fff', marginBottom: 24, textAlign: 'center' },
  tagline: { fontSize: 13, color: COLORS.textGray, textAlign: 'center', marginBottom: 40 },
  button: {  paddingVertical: 14, paddingHorizontal: 48, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loginText: { color: COLORS.primaryGreen, marginTop: 16, fontWeight: '500' },
  nutritionButton: {
  height: 56,
  width: 300,
  borderRadius: 16,

  alignItems: 'center',
  justifyContent: 'center',
},
foodImage: {
    width: 320,
    height: 320,
  },
});
