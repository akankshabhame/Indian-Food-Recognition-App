import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';

const TIPS = [
  { icon: '🍽️', label: 'How to balance your plate' },
  { icon: '🥗', label: 'High protein Indian foods' },
  { icon: '🍳', label: 'Healthy cooking methods' },
  { icon: '💧', label: 'Drink enough water' },
];

export default function HealthTipsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Tips</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={styles.sectionLabel}>Today's Tip</Text>
        <View style={styles.tipCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Add more green vegetables</Text>
            <Text style={styles.tipBody}>to your meals for better fiber and vitamins.</Text>
          </View>
          <Text style={styles.tipEmoji}>🥦</Text>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>More Tips</Text>
        <View style={styles.list}>
          {TIPS.map((tip, i) => (
            <TouchableOpacity key={tip.label} style={[styles.listRow, i === TIPS.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.listIcon}>{tip.icon}</Text>
              <Text style={styles.listLabel}>{tip.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.textDark },
  sectionLabel: { fontSize: 14, color: COLORS.textGray, marginBottom: 10 },
  tipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGreen, borderRadius: 16, padding: 18 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  tipBody: { fontSize: 13, color: COLORS.textGray },
  tipEmoji: { fontSize: 40, marginLeft: 10 },
  list: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  listIcon: { fontSize: 18, marginRight: 14 },
  listLabel: { flex: 1, fontSize: 14, color: COLORS.textDark, fontWeight: '500' },
  chevron: { fontSize: 18, color: COLORS.textGray },
});
