import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Sheet from './Sheet';
import { colors, radius } from '../theme';

const CATEGORIES = [
  { emoji: '🍔', label: 'Comida' },
  { emoji: '🚌', label: 'Transporte' },
  { emoji: '🎮', label: 'Ocio' },
  { emoji: '👕', label: 'Ropa' },
  { emoji: '📦', label: 'Otros' },
];

export default function ExpenseModal({ visible, onClose, onSave }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [cat, setCat] = useState(CATEGORIES[0]);

  useEffect(() => {
    if (visible) {
      setAmount('');
      setNote('');
      setCat(CATEGORIES[0]);
    }
  }, [visible]);

  const submit = () => {
    const n = parseFloat(amount.replace(',', '.'));
    if (!n || n <= 0) return;
    onSave({ amount: n, note: note.trim(), categoryEmoji: cat.emoji, categoryLabel: cat.label });
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Nuevo gasto">
      <Text style={styles.label}>¿Cuánto?</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="0,00 €"
        placeholderTextColor={colors.muted}
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.label}>¿En qué?</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.label}
            style={[styles.chip, cat.label === c.label && styles.chipActive]}
            onPress={() => setCat(c)}
          >
            <Text style={[styles.chipText, cat.label === c.label && styles.chipTextActive]}>
              {c.emoji} {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Nota (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. bocadillo en el recreo"
        placeholderTextColor={colors.muted}
        value={note}
        onChangeText={setNote}
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={submit}>
        <Text style={styles.primaryBtnText}>Guardar gasto</Text>
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
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  chipTextActive: { color: '#fff' },
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
