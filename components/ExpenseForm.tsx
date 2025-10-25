import React, { useEffect, useMemo, useState } from 'react';
import { Currency, Expense } from '../types';

interface ExpenseFormProps {
  members: string[];
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ members, onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>(Currency.JPY);
  const [paidBy, setPaidBy] = useState<string>(members[0] ?? '');
  const [splitAmong, setSplitAmong] = useState<string[]>(members);

  const all = useMemo(() => members, [members]);
  const isSingleMember = all.length === 1;

  const toggleSplit = (name: string) => {
    if (isSingleMember) return; // lock split when only one member
    setSplitAmong(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

  const setAllMembers = () => setSplitAmong(all);
  const setOnlyPayer = () => setSplitAmong(paidBy ? [paidBy] : []);

  const reset = () => {
    setDescription('');
    setAmount('');
    setCurrency(Currency.JPY);
    setPaidBy(all[0] ?? '');
    setSplitAmong(isSingleMember ? (all[0] ? [all[0]] : []) : all);
  };

  // Keep form state in sync with members changes and enforce single-member auto-selection
  useEffect(() => {
    // Ensure payer is valid
    if (!all.includes(paidBy)) {
      setPaidBy(all[0] ?? '');
    }
    // Sanitize splitAmong to existing members
    setSplitAmong(prev => {
      const filtered = prev.filter(n => all.includes(n));
      if (isSingleMember) {
        return all[0] ? [all[0]] : [];
      }
      return filtered.length > 0 ? filtered : all;
    });
  }, [all, isSingleMember]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!description.trim()) return;
    if (!amt || amt <= 0) return;
    if (!paidBy) return;
    const validSplit = splitAmong.filter(name => all.includes(name));
    if (validSplit.length === 0) return;

    onAdd({ description: description.trim(), amount: amt, currency, paidBy, splitAmong: validSplit });
    reset();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Add Expense</h3>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Dinner at Udon"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div className="col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Amount</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
              >
                <option value={Currency.JPY}>JPY</option>
                <option value={Currency.SGD}>SGD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Paid by</label>
            <select
              value={paidBy}
              onChange={e => {
                setPaidBy(e.target.value);
              }}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
              disabled={isSingleMember}
            >
              {members.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-600 mb-1">Split among</label>
              <div className="flex gap-2">
                <button type="button" onClick={setAllMembers} className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSingleMember}>All</button>
                <button type="button" onClick={setOnlyPayer} className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSingleMember}>Only payer</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {members.map(name => (
                <label key={name} className={`px-2 py-1 rounded border cursor-pointer ${splitAmong.includes(name) ? 'bg-sky-100 border-sky-300' : 'bg-slate-50 border-slate-200'}`}>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={splitAmong.includes(name)}
                    onChange={() => toggleSplit(name)}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded">Add Expense</button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
