import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getMeals } from '../services/mealService';
import StatCard from '../components/StatCard';
import MealListItem from '../components/MealListItem';
import { resolveImageUrl } from '../services/mealService';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const targets = user?.dailyTargets || { calories: 2000, protein: 80, carbs: 250, fat: 60 };

  const loadTodayMeals = useCallback(async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];
      const data = await getMeals(todayStr);
      setMeals(data);
    } catch (e) {
      // silent fail, keep empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTodayMeals();
    }, [loadTodayMeals])
  );

  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += m.totals?.calories || 0;
      acc.protein += m.totals?.protein || 0;
      acc.carbs += m.totals?.carbs || 0;
      acc.fat += m.totals?.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTodayMeals} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {firstName}! 👋</Text>
          <Text style={styles.subGreeting}>What's on your plate today?</Text>
        </View>
        <Text style={styles.bell}>🔔</Text>
      </View>
        
       
        <TouchableOpacity
  activeOpacity={0.85}
  onPress={() => navigation.navigate('Scan')}
  style={styles.scanTouchable}
>
  {/* Outer glow */}
  <View style={styles.scanGlow}>
    <View style={styles.scanGlowInner} />

    {/* Glowing border + card */}
    <LinearGradient
      colors={['#0055FF', '#222A91', '#7A22FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.scanBorder}
    >
      {/* Actual card */}
      <LinearGradient
        colors={['#101A55', '#15145B', '#321078']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.scanCard}
      >
        <View style={styles.scanContent}>
          <Text style={styles.scanTitle}>
            Scan Your Food
          </Text>

          <Text style={styles.scanSubtitle}>
            Take a photo or upload{"\n"}to analyze your meal
          </Text>
        </View>

        {/* Camera */}
        <View style={styles.cameraCircle}>
          <Ionicons
            name="camera"
            size={40}
            color="#5D2BDA"
          />
        </View>
      </LinearGradient>
    </LinearGradient>
  </View>
</TouchableOpacity>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>Today's Summary</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>


        <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard label="Calories" value={Math.round(totals.calories)} target={targets.calories} unit="kcal" gradient={[COLORS.caloriesStart, COLORS.caloriesEnd]} />
          <StatCard label="Protein" value={Math.round(totals.protein)} target={targets.protein} unit="g" color={COLORS.proteinBlue} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Carbs" value={Math.round(totals.carbs)} target={targets.carbs} unit="g" color={COLORS.carbsGreen} />
          <StatCard label="Fat" value={Math.round(totals.fat)} target={targets.fat} unit="g" color={COLORS.fatOrange} />
        </View>
      </View>

      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Recent Meals</Text>
      <View style={styles.mealsList}>
        {meals.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged yet today. Scan your first meal!</Text>

        ) : (
          meals
            .slice(0, 5)
            .map((meal) => (
              <MealListItem
                key={meal._id}
                meal={{ ...meal, imageUrl: resolveImageUrl(meal.imageUrl) }}
                onPress={() =>
                  navigation.navigate('NutritionSummary', { totals: meal.totals, detectedItems: meal.detectedItems })
                }
              />
            ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020817" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: "#fff" },
  subGreeting: { fontSize: 14, color:"#fff" , marginTop: 4 },
  bell: { fontSize: 20 },
  
   scanTouchable: {
    marginHorizontal: 5,
    marginVertical: 10,
  },

  /*
   * Main glow area
   */
  scanGlow: {
    borderRadius: 25,

    // iOS glow
    shadowColor: '#5B2A9E',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 14,

    // Android
    elevation: 10,
  },

  /*
   * Extra soft glow behind the card
   */
  scanGlowInner: {
    position: 'absolute',

    top: -4,
    bottom: -4,
    left: -4,
    right: -4,

    borderRadius: 32,

    backgroundColor: '#4420C7',

    opacity: 0.35,

    shadowColor: '#174DFF',
    shadowOpacity: 0.8,
    shadowRadius: 18,

    elevation: 12,
  },

  /*
   * Blue → purple glowing border
   */
  scanBorder: {
    borderRadius: 25,
    padding: 1.5,

    shadowColor: '#6B2EFF',
    shadowOpacity: 0.8,
    shadowRadius: 10,

    elevation: 8,
  },

  /*
   * Inner card
   */
  scanCard: {
    height: 130,
    borderRadius: 23,
    paddingHorizontal: 28,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  scanContent: {
    flex: 1,
  },

  scanTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '500',
    marginBottom: 8,

    textShadowColor: 'rgba(255,255,255,0.25)',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 5,
  },

  scanSubtitle: {
    color: '#D7D9F5',
    fontSize: 15,
    lineHeight: 25,
    fontWeight: '500',
  },

  /*
   * White camera circle
   */
  cameraCircle: {
    width: 80,
    height: 80,
    borderRadius: 46,
    backgroundColor: '#F7F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,

    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 12,

    elevation: 8,
  },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 10 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  viewAll: { fontSize: 13, color: COLORS.primaryGreen, fontWeight: '600' },
  statsGrid: { gap: 12 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  mealsList: { backgroundColor: COLORS.cardDark, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border, marginTop: 10, },
  emptyText: { color: COLORS.textGray, fontSize: 13, textAlign: 'center', paddingVertical: 20 },
});



