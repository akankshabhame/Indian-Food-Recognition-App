import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function ProgressBar({ progress = 0, color = COLORS.primaryGreen, height = 6 }) {
  const pct = Math.max(0, Math.min(progress * 100, 100));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: COLORS.border, overflow: 'hidden', width: '100%' },
  fill: { height: '100%' },
});
