import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/theme';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanFoodScreen({ navigation }) {
  const [previewUri, setPreviewUri] = useState(null);

  const goToAnalyzing = (uri) => {
    navigation.navigate('Analyzing', { imageUri: uri });
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission needed', 'Please allow camera access to scan your food.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPreviewUri(result.assets[0].uri);
      goToAnalyzing(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photos permission needed', 'Please allow photo library access to upload a meal photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPreviewUri(result.assets[0].uri);
      goToAnalyzing(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Food</Text>
        <Text style={styles.headerIcon}><Ionicons name="flash-outline" size={28} color="#FFFFFF" /></Text>
      </View>

      <View style={styles.frameWrap}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderFrame}>
            <Text style={styles.placeholderEmoji}>🍛</Text>
          </View>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Position your food in the frame</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideButton} onPress={pickFromGallery}>
          <Text style={styles.sideIcon}><Ionicons name="image-outline" size={29} color="#FFFFFF" /></Text>
          <Text style={styles.sideLabel}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <LinearGradient
            colors={["#4d1dbf", "#2242e4", "#3ea6fc"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
             style={styles.square}>
          <View style={styles.captureInner} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => Alert.alert('Tips', 'Place your plate on a plain background with good lighting for the most accurate results.')}
        >
          <Text style={styles.sideIcon}><Ionicons name="help-circle-outline" size={29} color="#FFFFFF" /></Text>
          <Text style={styles.sideLabel}>Tips</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerIcon: { color: '#fff', fontSize: 18 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
  frameWrap: { flex: 1, marginHorizontal: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
  previewImage: { width: '100%', height: '100%' },
  placeholderFrame: { alignItems: 'center', justifyContent: 'center' },
  placeholderEmoji: { fontSize: 64, opacity: 0.5 },
  badge: { position: 'absolute', top: 16, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 13 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 28 },
  sideButton: { alignItems: 'center' },
  sideIcon: { fontSize: 22, marginBottom: 4 },
  sideLabel: { color: '#ccc', fontSize: 12 },
  captureButton: { width: 68, height: 68, borderRadius: 34, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 54, height: 54, borderRadius: 25   },
   square: {
    width: 51,
    height: 51,
    borderRadius: 45
  },
});
