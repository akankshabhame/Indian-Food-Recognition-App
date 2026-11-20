import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

// segments: [{ value: number, color: string }]
export default function DonutChart({
  size = 120,
  strokeWidth = 14,
  segments = [],
  centerLabel,
  centerSubLabel,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  let cumulative = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {segments.map((seg, i) => {
          const fraction = seg.value / total;
          const dash = Math.max(fraction * circumference - 2, 0);
          const gap = circumference - dash;
          const rotation = (cumulative / total) * 360 - 90;
          cumulative += seg.value;
          return (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="round"
              fill="none"
              origin={`${size / 2}, ${size / 2}`}
              rotation={rotation}
            />
          );
        })}
      </Svg>
      <View style={styles.centerContent} pointerEvents="none">
        {centerLabel ? <Text style={[styles.centerLabel, { fontSize: size * 0.19 }]}>{centerLabel}</Text> : null}
        {centerSubLabel ? (
          <Text style={[styles.centerSubLabel, { fontSize: size * 0.09 }]}>{centerSubLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  centerLabel: { fontWeight: '700', color: COLORS.textDark },
  centerSubLabel: { color: COLORS.textGray, marginTop: 2 },
});
