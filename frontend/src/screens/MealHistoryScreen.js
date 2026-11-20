import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { getMeals, resolveImageUrl } from '../services/mealService';
import MealListItem from '../components/MealListItem';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDays(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
}

export default function MealHistoryScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const monthDays = getMonthDays(selectedDate.getFullYear(), selectedDate.getMonth());
  const monthLabel = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const loadMeals = useCallback(async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await getMeals(dateStr);
      setMeals(data);
    } catch (e) {
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [loadMeals])
  );

  const changeMonth = (delta) => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + delta);
    d.setDate(1);
    setSelectedDate(d);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <Text style={styles.headerTitle}>Meal History</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.monthRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={monthDays}
        keyExtractor={(d) => d.toISOString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
        renderItem={({ item }) => {
          const isSelected = item.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity style={[styles.dayCell, isSelected && styles.dayCellSelected]} onPress={() => setSelectedDate(item)}>
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>{dayLabels[item.getDay()]}</Text>
              <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>{item.getDate()}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : meals.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged on this day.</Text>
        ) : (
          <View style={styles.mealsCard}>
            {meals.map((meal) => (
              <MealListItem
                key={meal._id}
                meal={{ ...meal, imageUrl: resolveImageUrl(meal.imageUrl) }}
                onPress={() => navigation.navigate('NutritionSummary', { totals: meal.totals, detectedItems: meal.detectedItems })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.textDark },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, paddingVertical: 10 },
  arrow: { fontSize: 22, color: COLORS.textDark, paddingHorizontal: 12 },
  monthLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },
  dayCell: { width: 44, alignItems: 'center', paddingVertical: 10, borderRadius: 12, marginRight: 8, backgroundColor: COLORS.cardDark, borderWidth: 1, borderColor: COLORS.border },
  dayCellSelected: { backgroundColor: COLORS.primaryGreen, borderColor: COLORS.primaryGreen },
  dayLabel: { fontSize: 11, color: COLORS.textGray },
  dayLabelSelected: { color: '#E8F5E9' },
  dayNumber: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginTop: 4 },
  dayNumberSelected: { color: '#fff' },
  mealsCard: { backgroundColor: COLORS.cardDark, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.textGray, fontSize: 13, textAlign: 'center', paddingVertical: 30 },
});
