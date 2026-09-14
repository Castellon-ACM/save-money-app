import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ProgressRing from '../components/ProgressRing';
import { colors, radius, goalColors } from '../theme';
import { fmtMoney, daysBetweenInclusive, todayISO } from '../utils';

export default function GoalsScreen({ goals, onOpenNewGoal, onOpenContribute }) {
  const today = todayISO();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Tus metas</Text>
      <Text style={styles.subtitle}>Aparta dinero de tu presupuesto para lo que quieres.</Text>

      {goals.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Crea tu primera meta: un viaje, un móvil nuevo, un concierto o el carnet 🎯</Text>
        </View>
      )}

      {goals.map((g, i) => {
        const color = goalColors[i % goalColors.length];
        const pct = Math.min(1, g.saved / g.target);
        const isDone = g.saved >= g.target;
        let daysLeftGoal = null;
        let perDay = null;
        let expired = false;
        if (g.targetDate) {
          daysLeftGoal = daysBetweenInclusive(today, g.targetDate) + 1;
          if (daysLeftGoal > 0 && !isDone) perDay = (g.target - g.saved) / daysLeftGoal;
          if (daysLeftGoal <= 0) expired = true;
        }

        return (
          <View key={g.id} style={styles.card}>
            <View style={[styles.glow, { backgroundColor: color.soft }]} />
            <View style={styles.top}>
              <ProgressRing size={58} strokeWidth={6} progress={pct} color={color.main} bgColor={color.soft}>
                <Text style={{ fontSize: 20 }}>{g.emoji}</Text>
              </ProgressRing>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{g.name}</Text>
                <Text style={styles.target}>Objetivo: {fmtMoney(g.target)}</Text>
              </View>
              {isDone && (
                <View style={styles.doneTag}>
                  <Text style={styles.doneTagText}>¡Conseguida! 🎉</Text>
                </View>
              )}
            </View>

            {!!g.reason && (
              <View style={styles.reasonBox}>
                <Text style={styles.reasonText}>💬 {g.reason}</Text>
              </View>
            )}

            {g.targetDate && (
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {expired ? '📅 fecha límite pasada' : `📅 quedan ${daysLeftGoal} día${daysLeftGoal === 1 ? '' : 's'}`}
                  </Text>
                </View>
                {perDay !== null && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>💡 ahorra ~{fmtMoney(perDay)}/día</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color.main }]} />
            </View>

            <View style={styles.bottom}>
              <Text style={styles.saved}>
                <Text style={styles.savedBold}>{fmtMoney(g.saved)}</Text> ahorrados ({Math.round(pct * 100)}%)
              </Text>
              {!isDone && (
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: color.main }]} onPress={() => onOpenContribute(g.id)}>
                  <Text style={styles.addBtnText}>Añadir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      <TouchableOpacity style={styles.newGoalBtn} onPress={onOpenNewGoal}>
        <Text style={styles.newGoalText}>+ Añadir una meta nueva</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink, marginTop: 12 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 16 },
  empty: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 20, marginBottom: 16 },
  emptyText: { color: colors.muted, fontSize: 13, textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 16, marginBottom: 14, overflow: 'hidden' },
  glow: { position: 'absolute', top: -40, right: -40, width: 110, height: 110, borderRadius: 55, opacity: 0.6 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '700', color: colors.ink },
  target: { fontSize: 12, color: colors.muted, marginTop: 2 },
  doneTag: { backgroundColor: colors.mintSoft, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  doneTagText: { fontSize: 11, fontWeight: '700', color: colors.mint },
  reasonBox: { backgroundColor: colors.bg, borderRadius: 10, padding: 10, marginBottom: 12 },
  reasonText: { fontSize: 12.5, color: colors.ink, lineHeight: 17 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  badge: { backgroundColor: colors.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { fontSize: 11, fontWeight: '600', color: colors.muted },
  barTrack: { height: 10, backgroundColor: colors.bg, borderRadius: 8, overflow: 'hidden', marginBottom: 10 },
  barFill: { height: '100%', borderRadius: 8 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saved: { fontSize: 13, color: colors.muted },
  savedBold: { color: colors.ink, fontWeight: '700' },
  addBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  newGoalBtn: { borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', borderRadius: radius.md, padding: 16, alignItems: 'center', marginBottom: 20 },
  newGoalText: { color: colors.muted, fontWeight: '700', fontSize: 14 },
});
