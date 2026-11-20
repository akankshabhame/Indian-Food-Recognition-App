import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { getAnalytics } from '../services/mealService';
import DonutChart from '../components/DonutChart';
import { LinearGradient } from 'expo-linear-gradient';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsScreen() {
  const [meals, setMeals] = useState([]);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });

  useFocusEffect(
    useCallback(() => {
      getAnalytics()
        .then((data) => {
          setMeals(data.meals || []);
          setMacros(data.macroTotals || { protein: 0, carbs: 0, fat: 0 });
        })
        .catch(() => {
          setMeals([]);
        });
    }, [])
  );

  // Bucket calories per day of week for the last 7 days
  const caloriesByDay = Array(7).fill(0);
  meals.forEach((m) => {
    const day = new Date(m.loggedAt).getDay();
    caloriesByDay[day] += m.totals?.calories || 0;
  });
  const maxCal = Math.max(...caloriesByDay, 1);
  const avgCal = meals.length
    ? Math.round(meals.reduce((s, m) => s + (m.totals?.calories || 0), 0) / 7)
    : 0;

  const macroTotal = macros.protein + macros.carbs + macros.fat || 1;
  const proteinPct = Math.round((macros.protein / macroTotal) * 100);
  const carbsPct = Math.round((macros.carbs / macroTotal) * 100);
  const fatPct = Math.round((macros.fat / macroTotal) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.rangeSelector}>
          <Text style={styles.rangeText}>This Week</Text>
          <Text style={styles.rangeCaret}>⌄</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Calorie Intake</Text>
            <Text style={styles.cardSubtitle}>Avg, {avgCal.toLocaleString()} kcal/day</Text>
          </View>

          <View style={styles.barsRow}>
            {caloriesByDay.map((cal, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barTrack}>
                 <LinearGradient
  colors={["#3806ad", "#4918ab", "#8d55ef"]}
  start={{ x: 0, y: 1 }}
  end={{ x: 0, y: 0 }}
  
><View style={[styles.barFill, { height: `${Math.max((cal / maxCal) * 100, 4)}%` }]} />
</LinearGradient>
                 
                
                </View>
                <Text style={styles.barLabel}>{dayLabels[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.cardTitle}>Macro Distribution</Text>
          <View style={styles.donutRow}>
            <DonutChart
              size={130}
              strokeWidth={16}
              segments={[
                { value: proteinPct, color: COLORS.proteinBlue },
                { value: carbsPct, color: COLORS.carbsGreen },
                { value: fatPct, color: COLORS.fatOrange },
              ]}
            />
            <View style={styles.legend}>
              <LegendRow color={COLORS.proteinBlue} label="Protein" value={`${proteinPct}%`} />
              <LegendRow color={COLORS.carbsGreen} label="Carbs" value={`${carbsPct}%`} />
              <LegendRow color={COLORS.fatOrange} label="Fat" value={`${fatPct}%`} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function LegendRow({ color, label, value }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.textDark },
  rangeSelector: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: COLORS.cardDark, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 16 },
  rangeText: { fontSize: 15, fontWeight: '600', color: COLORS.textDark, marginRight: 8 },
  rangeCaret: { fontSize: 12, color: COLORS.textGray },
  card: { backgroundColor: COLORS.cardDark, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 18 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 25, fontWeight: '700', color: COLORS.textDark },
  cardSubtitle: { fontSize: 12, color: COLORS.textGray },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  barCol: { alignItems: 'center', flex: 1 },
  barTrack: { width: 19, height: 110, backgroundColor: COLORS.lightGreen, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: {  borderRadius: 7, width: '100%' },
  barLabel: { fontSize: 11, color: 'white', marginTop: 8 },
  donutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  legend: { flex: 1, marginLeft: 16 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { flex: 1, fontSize: 13, color: COLORS.textDark },
  legendValue: { fontSize: 19, fontWeight: '600', color: COLORS.textDark },
});
