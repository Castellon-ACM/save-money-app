import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Sheet from './Sheet';
import { colors, radius } from '../theme';
import { fmtDate } from '../utils';

export default function BudgetModal({ visible, profile, onClose, onSave }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible && profile) {
      setAmount(String(profile.total));
      setDate(new Date(profile.end + 'T00:00:00'));
    }
  }, [visible, profile]);

  const submit = () => {
    const n = parseFloat(amount.replace(',', '.'));
    if (!n || n <= 0 || !date) return;
    onSave({ total: n, end: date.toISOString().slice(0, 10) });
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Editar presupuesto">
      <Text style={styles.label}>Dinero disponible ahora</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.label}>Hasta qué día te tiene que durar</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={{ color: colors.ink }}>
          {date ? fmtDate(date.toISOString().slice(0, 10)) : 'Elegir fecha'}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selected) => {
            setShowPicker(Platform.OS === 'ios');
            if (selected) setDate(selected);
          }}
        />
      )}
      <TouchableOpacity style={styles.primaryBtn} onPress={submit}>
        <Text style={styles.primaryBtnText}>Guardar cambios</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '700', color: colors.muted, marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 13,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.coral,
    borderRadius: radius.sm,
    padding: 15,
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
