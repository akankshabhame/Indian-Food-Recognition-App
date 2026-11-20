import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

export default function MealListItem({ meal, onPress }) {
  const time = new Date(meal.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const itemCount = meal.detectedItems?.length || 0;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      {meal.imageUrl ? (
        <Image source={{ uri: meal.imageUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbFallback]}>
          <Text style={styles.thumbEmoji}>🍽️</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{meal.mealType}</Text>
        <Text style={styles.subtitle}>
          {time} • {itemCount} item{itemCount !== 1 ? 's' : ''}
        </Text>
      </View>
      <Text style={styles.kcal}>{Math.round(meal.totals?.calories || 0)} kcal</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  thumb: { width: 48, height: 48, borderRadius: 10, backgroundColor: COLORS.lightGreen, marginRight: 12 },
  thumbFallback: { alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 20 },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },
  subtitle: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },
  kcal: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
});
