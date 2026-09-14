import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from './src/theme';
import { loadState, saveState } from './src/storage';
import { computeAvailable } from './src/utils';

import TabBar from './src/components/TabBar';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import ExpenseModal from './src/components/ExpenseModal';
import GoalModal from './src/components/GoalModal';
import ContributeModal from './src/components/ContributeModal';
import BudgetModal from './src/components/BudgetModal';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ profile: null, expenses: [], goals: [] });
  const [tab, setTab] = useState('hoy');

  const [expenseModal, setExpenseModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);
  const [contributeGoalId, setContributeGoalId] = useState(null);
  const [budgetModal, setBudgetModal] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await loadState();
      setData(s);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    saveState(next);
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.coral} size="large" />
      </View>
    );
  }

  if (!data.profile) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar style="dark" />
          <OnboardingScreen onFinish={(profile) => persist({ ...data, profile })} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const calc = computeAvailable(data.profile, data.expenses, data.goals);

  const addExpense = (payload) => {
    const expense = { id: Date.now().toString(), date: new Date().toISOString().slice(0, 10), ...payload };
    persist({ ...data, expenses: [expense, ...data.expenses] });
    setExpenseModal(false);
  };

  const deleteExpense = (id) => {
    persist({ ...data, expenses: data.expenses.filter((e) => e.id !== id) });
  };

  const addGoal = (goal) => {
    persist({ ...data, goals: [...data.goals, { id: Date.now().toString(), saved: 0, ...goal }] });
    setGoalModal(false);
  };

  const contribute = (amount) => {
    const goals = data.goals.map((g) => (g.id === contributeGoalId ? { ...g, saved: g.saved + amount } : g));
    persist({ ...data, goals });
    setContributeGoalId(null);
  };

  const deleteGoal = () => {
    persist({ ...data, goals: data.goals.filter((g) => g.id !== contributeGoalId) });
    setContributeGoalId(null);
  };

  const editBudget = (changes) => {
    persist({ ...data, profile: { ...data.profile, ...changes } });
    setBudgetModal(false);
  };

  const resetAll = () => {
    persist({ profile: null, expenses: [], goals: [] });
  };

  const activeGoal = data.goals.find((g) => g.id === contributeGoalId) || null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>
          {tab === 'hoy' && (
            <HomeScreen
              profile={data.profile}
              expenses={data.expenses}
              calc={calc}
              onGoTab={setTab}
              onDeleteExpense={deleteExpense}
            />
          )}
          {tab === 'gastos' && <ExpensesScreen expenses={data.expenses} onDeleteExpense={deleteExpense} />}
          {tab === 'metas' && (
            <GoalsScreen
              goals={data.goals}
              onOpenNewGoal={() => setGoalModal(true)}
              onOpenContribute={setContributeGoalId}
            />
          )}
          {tab === 'ajustes' && (
            <SettingsScreen profile={data.profile} onEditBudget={() => setBudgetModal(true)} onResetAll={resetAll} />
          )}

          {(tab === 'hoy' || tab === 'gastos') && (
            <TouchableOpacity style={styles.fab} onPress={() => setExpenseModal(true)} activeOpacity={0.85}>
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <TabBar active={tab} onChange={setTab} />

        <ExpenseModal visible={expenseModal} onClose={() => setExpenseModal(false)} onSave={addExpense} />
        <GoalModal visible={goalModal} onClose={() => setGoalModal(false)} onSave={addGoal} />
        <ContributeModal
          visible={!!contributeGoalId}
          goal={activeGoal}
          maxAvailable={calc.remaining}
          onClose={() => setContributeGoalId(null)}
          onSave={contribute}
          onDelete={deleteGoal}
        />
        <BudgetModal
          visible={budgetModal}
          profile={data.profile}
          onClose={() => setBudgetModal(false)}
          onSave={editBudget}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
