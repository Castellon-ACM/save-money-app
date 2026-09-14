import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius } from '../theme';
import { todayISO, fmtDate } from '../utils';

export default function OnboardingScreen({ onFinish }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const submit = () => {
    const n = parseFloat(amount.replace(',', '.'));
    if (!n || n <= 0 || !date) return;
    onFinish({ total: n, start: todayISO(), end: date.toISOString().slice(0, 10) });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hola 👋</Text>
      <Text style={styles.subtitle}>Vamos a montar tu control de dinero. Solo tardas 20 segundos.</Text>

      <View style={styles.card}>
        <Text style={styles.emoji}>💶</Text>
        <Text style={styles.label}>¿Cuánto dinero tienes ahora?</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Ej. 70"
          placeholderTextColor={colors.muted}
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.label}>¿Hasta qué día te tiene que durar?</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker(true)}>
          <Text style={{ color: date ? colors.ink : colors.muted }}>
            {date ? fmtDate(date.toISOString().slice(0, 10)) : 'Elegir fecha'}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            minimumDate={new Date()}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selected) => {
              setShowPicker(Platform.OS === 'ios');
              if (selected) setDate(selected);
            }}
          />
        )}
        <TouchableOpacity style={styles.primaryBtn} onPress={submit}>
          <Text style={styles.primaryBtnText}>Empezar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 2, marginBottom: 10 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 22,
    marginTop: 20,
  },
  emoji: { fontSize: 40, marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '700', color: colors.muted, marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 13,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  dateBtn: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 13,
    backgroundColor: colors.surface,
  },
  primaryBtn: {
    backgroundColor: colors.coral,
    borderRadius: radius.sm,
    padding: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
