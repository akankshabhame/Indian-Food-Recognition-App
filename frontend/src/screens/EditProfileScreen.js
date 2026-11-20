import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [gender, setGender] = useState(user?.gender || '');
  const [heightCm, setHeightCm] = useState(user?.heightCm ? String(user.heightCm) : '');
  const [weightKg, setWeightKg] = useState(user?.weightKg ? String(user.weightKg) : '');
  const [goal, setGoal] = useState(user?.goal || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/me', {
        name,
        age: age ? Number(age) : undefined,
        gender,
        heightCm: heightCm ? Number(heightCm) : undefined,
        weightKg: weightKg ? Number(weightKg) : undefined,
        goal,
      });
      setUser((prev) => ({ ...prev, ...data }));
      navigation.goBack();
    } catch (err) {
      Alert.alert('Update failed', err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Field label="Name" value={name} onChangeText={setName} />
        <Field label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />
        <Field label="Gender (Male/Female/Other)" value={gender} onChangeText={setGender} />
        <Field label="Height (cm)" value={heightCm} onChangeText={setHeightCm} keyboardType="number-pad" />
        <Field label="Weight (kg)" value={weightKg} onChangeText={setWeightKg} keyboardType="number-pad" />
        <Field label="Goal (Lose Weight/Maintain Weight/Gain Weight)" value={goal} onChangeText={setGoal} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerIcon: { fontSize: 18, color: COLORS.textDark },
  headerTitle: { fontSize: 17, fontWeight: '600', color: COLORS.textDark },
  fieldLabel: { fontSize: 13, color: COLORS.textGray, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 14, color: COLORS.textDark },
  saveButton: { backgroundColor: COLORS.primaryGreen, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
