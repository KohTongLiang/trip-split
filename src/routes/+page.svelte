<script lang="ts">
    import { onMount } from "svelte";
    import { GROUPS } from "$lib/data/seed";
    import {
        loadGroups,
        saveGroups,
        loadSelectedGroupId,
        saveSelectedGroupId,
    } from "$lib/utils/storage";
    import { calculateSplits } from "$lib/utils/billSplitter";
    import type { Group, Expense } from "$lib/types";

    import Header from "$lib/components/Header.svelte";
    import SummaryCard from "$lib/components/SummaryCard.svelte";
    import ExpenseList from "$lib/components/ExpenseList.svelte";
    import CurrencyConverter from "$lib/components/CurrencyConverter.svelte";
    import GroupManager from "$lib/components/GroupManager.svelte";
    import ExpenseForm from "$lib/components/ExpenseForm.svelte";

    // State
    let groups: Group[] = [];
    let selectedGroupId: string = "";
    let jpyToSgdRate = 115.0;

    // Initialization
    onMount(() => {
        groups = loadGroups() ?? GROUPS;
        selectedGroupId = loadSelectedGroupId() ?? groups[0]?.id ?? "";
    });

    // Persistence
    $: if (groups.length > 0) saveGroups(groups);
    $: if (selectedGroupId) saveSelectedGroupId(selectedGroupId);

    // Derived State
    $: selectedGroup =
        groups.find((g) => g.id === selectedGroupId) ?? groups[0];
    $: members = selectedGroup?.members ?? [];
    $: groupExpenses = selectedGroup?.expenses ?? [];

    // Calculations
    $: splits = calculateSplits(members, groupExpenses, jpyToSgdRate);
    $: totalSpent = splits.totalSpent;
    $: settlements = splits.settlements;

    // Actions
    const updateGroup = (updated: Group) => {
        groups = groups.map((g) => (g.id === updated.id ? updated : g));
    };

    const createGroup = (name: string, members: string[]) => {
        const id = `grp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        const cleanMembers = Array.from(
            new Set(members.map((m) => m.trim()).filter(Boolean)),
        );
        const finalMembers = cleanMembers.length > 0 ? cleanMembers : ["Me"];
        const newGroup: Group = {
            id,
            name,
            members: finalMembers,
            expenses: [],
        };
        groups = [...groups, newGroup];
        selectedGroupId = id;
    };

    const deleteGroup = (id: string) => {
        groups = groups.filter((g) => g.id !== id);
        if (selectedGroupId === id) {
            const next = groups.find((g) => g.id !== id)?.id ?? "";
            selectedGroupId = next;
        }
    };

    const addExpense = (exp: Omit<Expense, "id">) => {
        if (!selectedGroup) return;

        const members = selectedGroup.members || [];
        let normalized: Omit<Expense, "id"> = exp;

        if (members.length === 1) {
            const only = members[0];
            normalized = { ...exp, paidBy: only, splitAmong: [only] };
        } else {
            const validSplit = (exp.splitAmong || []).filter((n) =>
                members.includes(n),
            );
            const paidBy = members.includes(exp.paidBy)
                ? exp.paidBy
                : (members[0] ?? exp.paidBy);
            normalized = {
                ...exp,
                paidBy,
                splitAmong: validSplit.length > 0 ? validSplit : members,
            };
        }

        const id = `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        const newExpense: Expense = { id, ...normalized };
        const updated: Group = {
            ...selectedGroup,
            expenses: [newExpense, ...selectedGroup.expenses],
        };
        updateGroup(updated);
    };

    const onSelectGroup = (id: string) => {
        selectedGroupId = id;
    };
</script>

<div class="min-h-screen bg-slate-100 text-slate-800">
    <main class="max-w-7xl mx-auto p-4 md:p-8">
        <Header {totalSpent} />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1 space-y-8">
                <CurrencyConverter bind:jpyToSgdRate />
                <GroupManager
                    {groups}
                    {selectedGroupId}
                    onSelect={onSelectGroup}
                    onCreate={createGroup}
                    onUpdate={updateGroup}
                    onDelete={deleteGroup}
                />
                <SummaryCard {settlements} />
            </div>

            <div class="lg:col-span-2 space-y-6">
                <ExpenseForm {members} onAdd={addExpense} />
                <ExpenseList expenses={groupExpenses} {members} />
            </div>
        </div>
    </main>
</div>
