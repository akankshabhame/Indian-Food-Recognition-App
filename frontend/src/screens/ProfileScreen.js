import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const infoRows = [
    { label: 'Age', value: user?.age ? `${user.age} Years` : '—' },
    { label: 'Gender', value: user?.gender || '—' },
    { label: 'Height', value: user?.heightCm ? `${user.heightCm} cm` : '—' },
    { label: 'Weight', value: user?.weightKg ? `${user.weightKg} kg` : '—' },
    { label: 'Goal', value: user?.goal || '—' },
  ];

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerIcon}>🔔</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editLink}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Personal Info</Text>
        <View style={styles.card}>
          {infoRows.map((row, i) => (
            <View key={row.label} style={[styles.row, i === infoRows.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('HealthTips')}>
            <Text style={styles.rowLabel}>Health Tips</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={confirmLogout}>
            <Text style={[styles.rowLabel, { color: 'white' }]}>Log Out</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.textDark },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 45, backgroundColor: COLORS.cardDark, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 26, fontWeight: '700', color: COLORS.primaryGreen },
  name: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  email: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },
  editLink: { fontSize: 13, color: COLORS.primaryGreen, fontWeight: '600', marginTop: 6 },
  sectionLabel: { fontSize: 14, color: COLORS.textGray, marginBottom: 10 },
  card: { backgroundColor:  COLORS.cardDark, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel: { fontSize: 14, color: COLORS.textDark },
  rowValue: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  chevron: { fontSize: 18, color: COLORS.textGray },
});
