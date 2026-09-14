import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, radius } from '../theme';
import { fmtMoney, fmtDate } from '../utils';

export default function SettingsScreen({ profile, onEditBudget, onResetAll }) {
  const confirmReset = () => {
    Alert.alert(
      'Borrar todo',
      '¿Seguro que quieres borrar tu presupuesto, gastos y metas? No se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar todo', style: 'destructive', onPress: onResetAll },
      ]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Ajustes</Text>
      <Text style={styles.subtitle}>Tu presupuesto y periodo actual.</Text>

      <Row label="Presupuesto total" value={fmtMoney(profile.total)} />
      <Row label="Termina el" value={fmtDate(profile.end)} />
      <Row label="Empezó el" value={fmtDate(profile.start)} />

      <TouchableOpacity style={styles.primaryBtn} onPress={onEditBudget}>
        <Text style={styles.primaryBtnText}>Editar presupuesto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dangerBtn} onPress={confirmReset}>
        <Text style={styles.dangerBtnText}>Borrar todo y empezar de nuevo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink, marginTop: 12 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
  },
  rowLabel: { fontSize: 14, fontWeight: '600', color: colors.ink },
  rowValue: { fontSize: 14, color: colors.muted },
  primaryBtn: { backgroundColor: colors.coral, borderRadius: radius.sm, padding: 15, alignItems: 'center', marginTop: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  dangerBtn: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm, padding: 14, alignItems: 'center', marginTop: 16 },
  dangerBtnText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
});
