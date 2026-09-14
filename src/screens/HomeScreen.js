import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressRing from '../components/ProgressRing';
import { colors, radius } from '../theme';
import { fmtMoney, todayISO } from '../utils';

export default function HomeScreen({ expenses, profile, calc, onGoTab, onDeleteExpense }) {
  const today = todayISO();
  const todayExpenses = expenses.filter((e) => e.date === today);
  const todaySpent = todayExpenses.reduce((a, e) => a + e.amount, 0);
  const todayBudget = calc.daily + todaySpent;
  const usedPct = todayBudget > 0 ? todaySpent / todayBudget : 0;
  const outOfMoney = calc.remaining <= 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{greeting}</Text>
      <Text style={styles.subtitle}>
        {calc.daysLeft === 1 ? 'hoy es el último día' : `quedan ${calc.daysLeft} días`}
      </Text>

      <LinearGradient
        colors={outOfMoney ? ['#E85A50', colors.danger] : [colors.coral, colors.coralDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <ProgressRing
          size={100}
          strokeWidth={9}
          progress={outOfMoney ? 1 : usedPct}
          color="#fff"
          bgColor="rgba(255,255,255,0.25)"
        >
          <Text style={{ fontSize: 26 }}>{outOfMoney ? '😬' : usedPct > 0.85 ? '⚠️' : '💶'}</Text>
        </ProgressRing>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.heroLabel}>PUEDES GASTAR HOY</Text>
          <Text style={styles.heroAmount}>{outOfMoney ? '0,00 €' : fmtMoney(calc.daily)}</Text>
          <Text style={styles.heroSub}>
            {outOfMoney
              ? 'Se acabó el presupuesto de este periodo'
              : calc.daysLeft === 1
              ? 'último día — ¡que cunda!'
              : 'sin quedarte a cero antes de fin de mes'}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.statRow}>
        <StatCard label="Presupuesto" value={fmtMoney(profile.total)} />
        <StatCard label="Gastado" value={fmtMoney(calc.spent)} />
        <StatCard label="En metas" value={fmtMoney(calc.saved)} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gastos de hoy</Text>
        <TouchableOpacity onPress={() => onGoTab('gastos')}>
          <Text style={styles.link}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      {todayExpenses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Todavía no has gastado nada hoy 🎉</Text>
        </View>
      ) : (
        todayExpenses.map((e) => <ExpenseRow key={e.id} expense={e} onDelete={() => onDeleteExpense(e.id)} />)
      )}
    </ScrollView>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function ExpenseRow({ expense, onDelete }) {
  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseEmoji}>
        <Text style={{ fontSize: 18 }}>{expense.categoryEmoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.expenseName}>{expense.categoryLabel}</Text>
        {!!expense.note && <Text style={styles.expenseMeta}>{expense.note}</Text>}
      </View>
      <Text style={styles.expenseAmount}>-{fmtMoney(expense.amount)}</Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={{ paddingLeft: 10 }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink, marginTop: 12 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 16 },
  hero: { borderRadius: radius.lg, padding: 22, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroLabel: { color: '#fff', fontSize: 12, fontWeight: '700', opacity: 0.9, marginBottom: 4 },
  heroAmount: { color: '#fff', fontSize: 32, fontWeight: '700' },
  heroSub: { color: '#fff', fontSize: 12, opacity: 0.85, marginTop: 6, lineHeight: 16 },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statLabel: { fontSize: 11, color: colors.muted, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.ink },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.ink },
  link: { fontSize: 13, fontWeight: '600', color: colors.blue },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
  },
  emptyText: { color: colors.muted, fontSize: 13 },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  expenseEmoji: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  expenseMeta: { fontSize: 12, color: colors.muted, marginTop: 1 },
  expenseAmount: { fontSize: 15, fontWeight: '700', color: colors.ink },
});
