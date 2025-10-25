import React, { useMemo, useState } from 'react';
import { Group } from '../types';

interface GroupManagerProps {
  groups: Group[];
  selectedGroupId: string;
  onSelect: (groupId: string) => void;
  onCreate: (name: string, members: string[]) => void;
  onUpdate: (group: Group) => void;
  onDelete: (groupId: string) => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12M9.75 7.5V6a2.25 2.25 0 012.25-2.25h0a2.25 2.25 0 012.25 2.25v1.5M18 7.5v12A2.25 2.25 0 0115.75 22h-7.5A2.25 2.25 0 016 19.5v-12m3 4.5v6m6-6v6" />
  </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.651-1.651a2.121 2.121 0 113 3L9 19.5 4.5 21l1.5-4.5 10.862-12.013z" />
  </svg>
);

const GroupManager: React.FC<GroupManagerProps> = ({ groups, selectedGroupId, onSelect, onCreate, onUpdate, onDelete }) => {
  const [newName, setNewName] = useState('');
  const [newMembersText, setNewMembersText] = useState<string>('');
  const [addMemberName, setAddMemberName] = useState<string>('');

  const selected = useMemo(() => groups.find(g => g.id === selectedGroupId), [groups, selectedGroupId]);

  const handleCreate = () => {
    const name = newName.trim() || `Group ${groups.length + 1}`;
    const members = Array.from(new Set(
      newMembersText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    ));

    // If no members specified, do not prompt; App.createGroup will default to ["Me"]
    onCreate(name, members);
    setNewName('');
    setNewMembersText('');
  };

  const removeMemberFromSelected = (name: string) => {
    if (!selected) return;
    const members = selected.members.filter(m => m !== name);
    const fixedExpenses = selected.expenses.map(e => {
      const split = (e.splitAmong || []).filter(n => members.includes(n));
      const splitAmong = split.length > 0 ? split : members;
      const paidBy = members.includes(e.paidBy) ? e.paidBy : (members[0] ?? e.paidBy);
      return { ...e, splitAmong, paidBy };
    });
    onUpdate({ ...selected, members, expenses: fixedExpenses });
  };

  const addMemberToSelected = (name: string) => {
    const trimmed = name.trim();
    if (!selected || !trimmed) return;
    if (selected.members.includes(trimmed)) return;
    const members = [...selected.members, trimmed];
    onUpdate({ ...selected, members });
  };

  const renameSelected = () => {
    if (!selected) return;
    const name = prompt('Rename group', selected.name) ?? selected.name;
    onUpdate({ ...selected, name });
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (confirm(`Delete group "${selected.name}"? This cannot be undone.`)) {
      onDelete(selected.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Groups</h3>

      <div className="space-y-2 mb-6">
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            className={`w-full text-left px-3 py-2 rounded border ${g.id === selectedGroupId ? 'bg-sky-50 border-sky-300' : 'bg-slate-50 border-slate-200'} hover:bg-sky-50`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{g.name}</p>
                <p className="text-xs text-slate-500">{(g.members || []).join(', ')}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mb-6 border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-slate-700">Selected: {selected.name}</p>
            <div className="flex items-center gap-2">
              <button onClick={renameSelected} className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded inline-flex items-center gap-1">
                <PencilIcon className="h-4 w-4" /> Rename
              </button>
              <button onClick={deleteSelected} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded inline-flex items-center gap-1">
                <TrashIcon className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-1">Members</p>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {(selected.members || []).map(name => (
              <span key={name} className="inline-flex items-center gap-2 px-2 py-1 rounded border border-slate-300 bg-slate-50">
                <span>{name}</span>
                <button onClick={() => removeMemberFromSelected(name)} className="text-xs text-red-600 hover:underline">Remove</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add member name"
              className="flex-1 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
              value={addMemberName}
              onChange={e => setAddMemberName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMemberToSelected(addMemberName);
                  setAddMemberName('');
                }
              }}
            />
            <button
              onClick={() => {
                addMemberToSelected(addMemberName);
                setAddMemberName('');
              }}
              className="px-3 py-2 text-sm rounded bg-slate-100 hover:bg-slate-200"
            >Add</button>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <p className="font-semibold text-slate-700 mb-2">Create new group</p>
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Group name"
          className="w-full mb-3 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
        />
        <p className="text-sm text-slate-600 mb-1">Members (comma separated)</p>
        <input
          type="text"
          value={newMembersText}
          onChange={e => setNewMembersText(e.target.value)}
          placeholder="e.g. Alice, Bob, Charlie"
          className="w-full mb-3 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
        />
        <button onClick={handleCreate} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded">
          <PlusIcon className="h-5 w-5" /> Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupManager;
