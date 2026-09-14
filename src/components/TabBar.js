import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const TABS = [
  { key: 'hoy', label: 'Hoy', icon: '🏠' },
  { key: 'gastos', label: 'Gastos', icon: '🧾' },
  { key: 'metas', label: 'Metas', icon: '🎯' },
  { key: 'ajustes', label: 'Ajustes', icon: '⚙️' },
];

export default function TabBar({ active, onChange }) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => (
        <TouchableOpacity key={t.key} style={styles.tab} onPress={() => onChange(t.key)} activeOpacity={0.7}>
          <Text style={styles.icon}>{t.icon}</Text>
          <Text style={[styles.label, active === t.key && styles.labelActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingTop: 8,
    paddingBottom: 6,
  },
  tab: { flex: 1, alignItems: 'center' },
  icon: { fontSize: 20 },
  label: { fontSize: 11, fontWeight: '600', color: colors.muted, marginTop: 2 },
  labelActive: { color: colors.coralDark },
});
