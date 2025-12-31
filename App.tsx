
import React, { useEffect, useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useBillSplitter } from './hooks/useBillSplitter';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import ExpenseList from './components/ExpenseList';
import CurrencyConverter from './components/CurrencyConverter';
import GroupManager from './components/GroupManager';
import ExpenseForm from './components/ExpenseForm';
import { Group, Expense } from './types';
import { loadGroups, saveGroups, loadSelectedGroupId, saveSelectedGroupId } from './utils/storage';
import {
  getGroups,
  saveGroup,
  deleteGroup as deleteFirestoreGroup,
  subscribeToGroups
} from './lib/firestore';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>(() => loadGroups() ?? []);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    const savedGroups = loadGroups() ?? [];
    return loadSelectedGroupId() ?? savedGroups[0]?.id ?? '';
  });
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);
  const [jpyToSgdRate, setJpyToSgdRate] = useState(115.0);
  const [isLoadingFirestore, setIsLoadingFirestore] = useState(false);


  // Load data from Firestore when user signs in
  useEffect(() => {
    if (user) {
      setIsLoadingFirestore(true);

      // Set a timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.warn('Firestore connection timeout - falling back to localStorage');
        setIsLoadingFirestore(false);
        setIsFirestoreConnected(false); // Mark Firestore as disconnected
        // Load from localStorage as fallback
        const localGroups = loadGroups() ?? [];
        setGroups(localGroups);
        setSelectedGroupId(loadSelectedGroupId() ?? localGroups[0]?.id ?? '');
      }, 5000); // 5 second timeout

      // First, check if we need to migrate localStorage data
      const migrateData = async () => {
        try {
          const firestoreGroups = await getGroups(user.uid);

          if (firestoreGroups.length === 0) {
            // Firestore is empty - check if we have localStorage data to migrate
            const localGroups = loadGroups();
            if (localGroups && localGroups.length > 0) {
              console.log('Migrating localStorage data to Firestore...');
              // Migrate all groups to Firestore
              for (const group of localGroups) {
                await saveGroup(user.uid, group);
              }
              console.log('Migration complete!');
            }
          }

          // Now subscribe to real-time updates
          const unsubscribe = subscribeToGroups(user.uid, (firestoreGroups) => {
            clearTimeout(loadingTimeout); // Clear timeout on successful connection
            setIsFirestoreConnected(true); // Mark Firestore as connected
            setGroups(firestoreGroups);
            if (firestoreGroups.length > 0) {
              if (!selectedGroupId || !firestoreGroups.find(g => g.id === selectedGroupId)) {
                setSelectedGroupId(firestoreGroups[0].id);
              }
            } else {
              setSelectedGroupId('');
            }
            setIsLoadingFirestore(false);
          });

          return unsubscribe;
        } catch (error) {
          console.error('Firestore error:', error);
          console.warn('Falling back to localStorage due to Firestore error');
          clearTimeout(loadingTimeout);
          setIsLoadingFirestore(false);
          setIsFirestoreConnected(false); // Mark Firestore as disconnected

          // Fallback to localStorage
          const localGroups = loadGroups() ?? [];
          setGroups(localGroups);
          setSelectedGroupId(loadSelectedGroupId() ?? localGroups[0]?.id ?? '');

          // Return a no-op unsubscribe function
          return () => { };
        }
      };

      const unsubscribePromise = migrateData();

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribePromise.then(unsub => unsub()).catch(() => { });
      };
    } else {
      // Guest mode: use localStorage
      const localGroups = loadGroups() ?? [];
      setGroups(localGroups);
      setSelectedGroupId(loadSelectedGroupId() ?? localGroups[0]?.id ?? '');
    }
  }, [user]);


  // Save to localStorage for guest users OR when Firestore is not connected
  useEffect(() => {
    if (!user || (user && !isFirestoreConnected)) {
      saveGroups(groups);
    }
  }, [groups, user, isFirestoreConnected]);

  useEffect(() => {
    if ((!user || (user && !isFirestoreConnected)) && selectedGroupId) {
      saveSelectedGroupId(selectedGroupId);
    }
  }, [selectedGroupId, user, isFirestoreConnected]);

  const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId) ?? groups[0], [groups, selectedGroupId]);
  const members = selectedGroup?.members ?? [];
  const groupExpenses = selectedGroup?.expenses ?? [];

  const { totalSpent, settlements } = useBillSplitter(members, groupExpenses, jpyToSgdRate);

  const updateGroup = async (updated: Group) => {
    setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)));

    // Save to Firestore if authenticated and connected
    if (user && isFirestoreConnected) {
      try {
        await saveGroup(user.uid, updated);
      } catch (error) {
        console.error('Failed to save to Firestore:', error);
      }
    }
  };

  const createGroup = async (name: string, members: string[]) => {
    const id = `grp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const cleanMembers = Array.from(new Set(members.map(m => m.trim()).filter(Boolean)));
    const finalMembers = cleanMembers.length > 0 ? cleanMembers : ['Me'];
    const newGroup: Group = { id, name, members: finalMembers, expenses: [] };

    setGroups(prev => [...prev, newGroup]);
    setSelectedGroupId(id);

    // Save to Firestore if authenticated and connected
    if (user && isFirestoreConnected) {
      try {
        await saveGroup(user.uid, newGroup);
      } catch (error) {
        console.error('Failed to save to Firestore:', error);
      }
    }
  };

  const deleteGroup = async (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    if (selectedGroupId === id) {
      const next = groups.find(g => g.id !== id)?.id ?? '';
      setSelectedGroupId(next);
    }

    // Delete from Firestore if authenticated and connected
    if (user && isFirestoreConnected) {
      try {
        await deleteFirestoreGroup(user.uid, id);
      } catch (error) {
        console.error('Failed to delete from Firestore:', error);
      }
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

  if (isLoadingFirestore) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your data...</p>
        </div>
      </div>
    );
  }

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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
