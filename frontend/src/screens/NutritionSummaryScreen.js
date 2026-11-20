import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import DonutChart from '../components/DonutChart';

export default function NutritionSummaryScreen({ route, navigation }) {
  const { totals = {} } = route.params || {};
  const kcal = Math.round(totals.calories || 0);
  const protein = Math.round(totals.protein || 0);
  const carbs = Math.round(totals.carbs || 0);
  const fat = Math.round(totals.fat || 0);

  const nutrients = [
    { label: 'Fiber', value: `${(totals.fiber || 0).toFixed(1)} g` },
    { label: 'Sugar', value: `${(totals.sugar || 0).toFixed(1)} g` },
    { label: 'Sodium', value: `${Math.round(totals.sodium || 0)} mg` },
    { label: 'Cholesterol', value: `${Math.round(totals.cholesterol || 0)} mg` },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition Summary</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Nutrition (Approx.)</Text>

          <View style={styles.donutRow}>
            <DonutChart
              size={140}
              strokeWidth={16}
              segments={[
                { value: protein, color: COLORS.proteinBlue },
                { value: carbs, color: COLORS.carbsGreen },
                { value: fat, color: COLORS.fatOrange },
              ]}
              centerLabel={`${kcal}`}
              centerSubLabel="kcal Calories"
            />

            <View style={styles.legend}>
              <LegendRow color={COLORS.proteinBlue} label="Protein" value={`${protein} g`} />
              <LegendRow color={COLORS.carbsGreen} label="Carbs" value={`${carbs} g`} />
              <LegendRow color={COLORS.fatOrange} label="Fat" value={`${fat} g`} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nutrients</Text>
        <View style={styles.nutrientsCard}>
          {nutrients.map((n, i) => (
            <View key={n.label} style={[styles.nutrientRow, i === nutrients.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.nutrientLabel}>{n.label}</Text>
              <Text style={styles.nutrientValue}>{n.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.textDark },
  card: { backgroundColor: COLORS.cardDark, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 18, marginBottom: 24 },
  cardTitle: { fontSize: 14, color: COLORS.textGray, marginBottom: 16 },
  donutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  legend: { flex: 1, marginLeft: 16, gap: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { flex: 1, fontSize: 13, color: COLORS.textDark },
  legendValue: { fontSize: 13, fontWeight: '600', color: COLORS.textDark },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 10 },
  nutrientsCard: { backgroundColor: COLORS.cardDark, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16 },
  nutrientRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  nutrientLabel: { fontSize: 14, color: COLORS.textDark },
  nutrientValue: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
});
