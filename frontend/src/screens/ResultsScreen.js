import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme.js';
import { saveMeal, inferMealType, resolveImageUrl } from '../services/mealService.js';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultsScreen({ route, navigation }) {
  const { imageUri, imageUrl, detectedItems = [], totals = {} } = route.params;
  const [saving, setSaving] = useState(true);
  const [savedMeal, setSavedMeal] = useState(null);

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const mealType = inferMealType(now);
    saveMeal({ imageUrl, mealType, detectedItems, totals, loggedAt: now.toISOString() })
      .then((meal) => setSavedMeal(meal))
      .catch(() => {
        // Non-fatal: user can still view the summary even if saving to history failed
      })
      .finally(() => setSaving(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Results</Text>
          <Text style={styles.headerSubtitle}>{dateLabel} • {timeLabel}</Text>
        </View>
        <Text style={styles.headerIcon}><Ionicons name="share-outline" size={24} color="white" /></Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUri || resolveImageUrl(imageUrl) }} style={styles.image} />
          {detectedItems.slice(0, 4).map((_, i) => (
            <View
              key={i}
              style={[
                styles.itemBadge,
                {
                  top: 12 + (i % 2) * 130,
                  left: i < 2 ? 12 : undefined,
                  right: i >= 2 ? 12 : undefined,
                },
              ]}
            >
              <Text style={styles.itemBadgeText}>{i + 1}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Detected Items</Text>

        <View style={styles.itemsList}>
          {detectedItems.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name || item.dish || 'Unnamed item'}</Text>
                <Text style={styles.itemPrep}>{item.preparation}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.itemQty}>{item.quantity}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.summaryButton}
          disabled={saving}
          onPress={() => navigation.replace('NutritionSummary', { totals, detectedItems })}
        ><LinearGradient
  colors={['#168BEE', '#7424D8']}
  start={{ x: 0, y: 0.5 }}
  end={{ x: 1, y: 0.5 }}
   style={styles.nutritionButton}
>
          <Text style={styles.summaryButtonText}>{saving ? 'Saving...' : 'View Nutrition Summary'}</Text>
        </LinearGradient>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cardDark },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 25, fontWeight: '600', color: COLORS.textDark },
  headerSubtitle: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },
  imageWrap: { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.cardDark, marginBottom: 20 },
  image: { width: '100%', height: '100%' },
  itemBadge: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: '#5f2fe1', alignItems: 'center', justifyContent: 'center' },
  itemBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 25, fontWeight: '700', color: COLORS.textDark, marginBottom: 10 },
  itemsList: { backgroundColor: COLORS.cardDark, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemNumber: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.cardDark, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemNumberText: { color: COLORS.textGray, fontWeight: '700', fontSize: 12 },
  itemName: { fontSize: 17, fontWeight: '600', color: 'white' },
  itemPrep: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },
  itemQty: { fontSize: 13, color: COLORS.textGray, marginRight: 6 },
  chevron: { fontSize: 18, color: COLORS.textGray },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
  summaryButton: {  borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  summaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  nutritionButton: {
  height: 56,
  width:300,
  borderRadius: 16,

  alignItems: 'center',
  justifyContent: 'center',

  // Glow around the button
  shadowColor: '#5D2BDA',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.7,
  shadowRadius: 8,

  elevation: 8,
},
});
