import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

export default function StatCard({ label, value, target, unit, color, gradient }) {
  const pct = target ? Math.min((value / target) * 100, 100) : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value} <Text style={styles.unit}>/ {target} {unit}</Text>
      </Text>

      <View style={styles.track}>
        {gradient ? (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: `${pct}%` }]}
          />
        ) : (
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: { color: COLORS.textGray, fontSize: 13, marginBottom: 6 },
  value: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  unit: { color: COLORS.textMuted, fontSize: 13, fontWeight: '400' },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
});