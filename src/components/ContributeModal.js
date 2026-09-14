import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Sheet from './Sheet';
import { colors, radius } from '../theme';

export default function ContributeModal({ visible, goal, maxAvailable, onClose, onSave, onDelete }) {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (visible) setAmount('');
  }, [visible]);

  if (!goal) return null;

  const submit = () => {
    const n = parseFloat(amount.replace(',', '.'));
    if (!n || n <= 0 || n > maxAvailable) return;
    onSave(n);
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={`Añadir a "${goal.name}"`}>
      <Text style={styles.subtitle}>Este dinero se resta de tu presupuesto disponible.</Text>
      <Text style={styles.label}>¿Cuánto quieres apartar?</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="Ej. 10"
        placeholderTextColor={colors.muted}
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={submit}>
        <Text style={styles.primaryBtnText}>Apartar dinero</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ghostBtn} onPress={onDelete}>
        <Text style={styles.ghostBtnText}>Eliminar esta meta</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 13, color: colors.muted, marginBottom: 6 },
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
  primaryBtn: {
    backgroundColor: colors.coral,
    borderRadius: radius.sm,
    padding: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  ghostBtn: { padding: 10, alignItems: 'center', marginTop: 8, marginBottom: 6 },
  ghostBtnText: { color: colors.muted, fontWeight: '600', fontSize: 13 },
});
