
import React, { useEffect, useMemo, useState } from 'react';
import { GROUPS } from './data/seed';
import { useBillSplitter } from './hooks/useBillSplitter';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import ExpenseList from './components/ExpenseList';
import CurrencyConverter from './components/CurrencyConverter';
import GroupManager from './components/GroupManager';
import ExpenseForm from './components/ExpenseForm';
import { Group, Expense } from './types';
import { loadGroups, saveGroups, loadSelectedGroupId, saveSelectedGroupId } from './utils/storage';

const App: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(() => loadGroups() ?? GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => loadSelectedGroupId() ?? groups[0]?.id ?? '');
  const [jpyToSgdRate, setJpyToSgdRate] = useState(115.0);

  useEffect(() => {
    saveGroups(groups);
  }, [groups]);

  useEffect(() => {
    if (selectedGroupId) saveSelectedGroupId(selectedGroupId);
  }, [selectedGroupId]);

  const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId) ?? groups[0], [groups, selectedGroupId]);
  const members = selectedGroup?.members ?? [];
  const groupExpenses = selectedGroup?.expenses ?? [];

  const { totalSpent, settlements } = useBillSplitter(members, groupExpenses, jpyToSgdRate);

  const updateGroup = (updated: Group) => {
    setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)));
  };

  const createGroup = (name: string, members: string[]) => {
    const id = `grp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const cleanMembers = Array.from(new Set(members.map(m => m.trim()).filter(Boolean)));
    const finalMembers = cleanMembers.length > 0 ? cleanMembers : ['Me']; // default to creator placeholder if none provided
    const newGroup: Group = { id, name, members: finalMembers, expenses: [] };
    setGroups(prev => [...prev, newGroup]);
    setSelectedGroupId(id);
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    if (selectedGroupId === id) {
      const next = groups.find(g => g.id !== id)?.id ?? '';
      setSelectedGroupId(next);
    }
  };

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    if (!selectedGroup) return;

    const members = selectedGroup.members || [];
    let normalized: Omit<Expense, 'id'> = exp;

    if (members.length === 1) {
      const only = members[0];
      normalized = { ...exp, paidBy: only, splitAmong: [only] };
    } else {
      const validSplit = (exp.splitAmong || []).filter(n => members.includes(n));
      const paidBy = members.includes(exp.paidBy) ? exp.paidBy : (members[0] ?? exp.paidBy);
      normalized = { ...exp, paidBy, splitAmong: validSplit.length > 0 ? validSplit : members };
    }

    const id = `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const newExpense: Expense = { id, ...normalized };
    const updated: Group = { ...selectedGroup, expenses: [newExpense, ...selectedGroup.expenses] };
    updateGroup(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Header totalSpent={totalSpent} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <CurrencyConverter jpyToSgdRate={jpyToSgdRate} setJpyToSgdRate={setJpyToSgdRate} />
            <GroupManager
              groups={groups}
              selectedGroupId={selectedGroup?.id ?? ''}
              onSelect={setSelectedGroupId}
              onCreate={createGroup}
              onUpdate={updateGroup}
              onDelete={deleteGroup}
            />
            <SummaryCard settlements={settlements} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <ExpenseForm members={members} onAdd={addExpense} />
            <ExpenseList expenses={groupExpenses} members={members} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
