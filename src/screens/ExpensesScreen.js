import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radius } from '../theme';
import { fmtDate, todayISO } from '../utils';
import { ExpenseRow } from './HomeScreen';

export default function ExpensesScreen({ expenses, onDeleteExpense }) {
  const today = todayISO();
  const groups = {};
  expenses.forEach((e) => {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  });
  const dates = Object.keys(groups).sort().reverse();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Gastos</Text>
      <Text style={styles.subtitle}>Todo lo que has registrado este mes.</Text>

      {expenses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aún no hay gastos registrados</Text>
        </View>
      ) : (
        dates.map((d) => (
          <View key={d}>
            <Text style={styles.dateLabel}>{d === today ? 'Hoy' : fmtDate(d)}</Text>
            {groups[d].map((e) => (
              <ExpenseRow key={e.id} expense={e} onDelete={() => onDeleteExpense(e.id)} />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink, marginTop: 12 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 16 },
  dateLabel: { fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 14, marginBottom: 8 },
  empty: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 20, alignItems: 'center' },
  emptyText: { color: colors.muted, fontSize: 13 },
});
