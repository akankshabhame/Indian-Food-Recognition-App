import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import DonutChart from '../components/DonutChart';
import { scanFoodImage } from '../services/mealService';

const STEPS = [
  { key: 'detect', label: 'Detecting food items' },
  { key: 'identify', label: 'Identifying food type' },
  { key: 'nutrition', label: 'Estimating nutrition' },
  { key: 'finalize', label: 'Finalizing results' },
];

export default function AnalyzingScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const resultRef = useRef(null);
  const errorRef = useRef(null);

  // Kick off the real API call in the background
  useEffect(() => {
    let cancelled = false;
    scanFoodImage(imageUri)
      .then((data) => {
        if (!cancelled) resultRef.current = data;
      })
      .catch((err) => {
        if (!cancelled) errorRef.current = err?.response?.data?.message || 'Could not analyze this photo';
      });
    return () => {
      cancelled = true;
    };
  }, [imageUri]);

  // Animate through the checklist steps regardless of API speed, for a smooth UX,
  // then wait for the real result before navigating.
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = Math.min(prev + 1, STEPS.length - 1);
        setProgress(Math.min(20 + next * 25, 95));
        return next;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stepIndex < STEPS.length - 1) return;

    // Poll briefly for the API result to resolve after the checklist finishes animating
    const poll = setInterval(() => {
      if (errorRef.current) {
        clearInterval(poll);
        Alert.alert('Analysis failed', errorRef.current, [{ text: 'Try Again', onPress: () => navigation.goBack() }]);
        return;
      }
      if (resultRef.current) {
        clearInterval(poll);
        setProgress(100);
        setTimeout(() => {
          navigation.replace('Results', { imageUri, ...resultRef.current });
        }, 300);
      }
    }, 300);

    return () => clearInterval(poll);
  }, [stepIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analyzing Food</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.center}>
        <DonutChart
          size={180}
          strokeWidth={14}
          segments={[
            { value: progress, color: COLORS.primaryGreen },
            { value: 100 - progress, color: COLORS.border },
          ]}
          centerLabel={`${progress}%`}
          centerSubLabel="Analyzing..."
        />
      </View>

      <View style={styles.checklist}>
        {STEPS.map((step, i) => (
          <View style={styles.checklistRow} key={step.key}>
            <Text style={styles.checklistLabel}>{step.label}</Text>
            {i < stepIndex ? (
              <Text style={styles.checkDone}>✓</Text>
            ) : i === stepIndex ? (
              <Text style={styles.checkSpinner}>◌</Text>
            ) : (
              <Text style={styles.checkPending}>○</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>✨ This may take a few seconds</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.textDark },
  center: { alignItems: 'center', marginVertical: 30 },
  checklist: { paddingHorizontal: 24, gap: 16 },
  checklistRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  checklistLabel: { fontSize: 15, color: COLORS.textDark },
  checkDone: { color: COLORS.primaryGreen, fontSize: 16, fontWeight: '700' },
  checkSpinner: { color: COLORS.accentOrange, fontSize: 16 },
  checkPending: { color: COLORS.border, fontSize: 16 },
  footerNote: { marginTop: 30, marginHorizontal: 24, backgroundColor: COLORS.lightGreen, borderRadius: 12, padding: 14, alignItems: 'center' },
  footerText: { color: COLORS.primaryGreen, fontSize: 13, fontWeight: '500' },
});
