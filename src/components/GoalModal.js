import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Sheet from './Sheet';
import { colors, radius } from '../theme';
import { fmtDate } from '../utils';

const PRESETS = [
  { emoji: '✈️', name: 'Viaje' },
  { emoji: '📱', name: 'Móvil' },
  { emoji: '🎤', name: 'Concierto' },
  { emoji: '🚗', name: 'Carnet' },
  { emoji: '👟', name: 'Ropa o zapatillas' },
  { emoji: '🎮', name: 'Videojuego' },
  { emoji: '🎁', name: 'Regalo' },
  { emoji: '🎯', name: '' },
];

export default function GoalModal({ visible, onClose, onSave }) {
  const [emoji, setEmoji] = useState('🎯');
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [target, setTarget] = useState('');
  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setEmoji('🎯');
      setName('');
      setReason('');
      setTarget('');
      setDate(null);
      setShowPicker(false);
    }
  }, [visible]);

  const submit = () => {
    const n = parseFloat(target.replace(',', '.'));
    if (!name.trim() || !n || n <= 0) return;
    onSave({
      name: name.trim(),
      reason: reason.trim(),
      target: n,
      emoji,
      targetDate: date ? date.toISOString().slice(0, 10) : null,
    });
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Nueva meta">
      <Text style={styles.label}>¿Qué quieres conseguir?</Text>
      <View style={styles.chipRow}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.name || 'otra'}
            style={[styles.chip, emoji === p.emoji && styles.chipActive]}
            onPress={() => {
              setEmoji(p.emoji);
              if (p.name) setName(p.name);
            }}
          >
            <Text style={[styles.chipText, emoji === p.emoji && styles.chipTextActive]}>
              {p.emoji} {p.name || 'Otra cosa'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Nombre de la meta</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Viaje de fin de curso"
        placeholderTextColor={colors.muted}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>¿Por qué quieres ahorrar para esto?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Es mi último viaje con la clase"
        placeholderTextColor={colors.muted}
        value={reason}
        onChangeText={setReason}
      />

      <Text style={styles.label}>¿Cuánto necesitas en total?</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="Ej. 150"
        placeholderTextColor={colors.muted}
        value={target}
        onChangeText={setTarget}
      />

      <Text style={styles.label}>¿Para cuándo lo necesitas? (opcional)</Text>
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
        <Text style={styles.primaryBtnText}>Crear meta</Text>
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
  dateBtn: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 13,
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
