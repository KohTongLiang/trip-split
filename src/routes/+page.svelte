<script lang="ts">
    export let data: import("./$types").PageData;

    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";
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

    $: source = data.source;

    // Initialization
    onMount(() => {
        if (source === "db") {
            groups = data.groups;
        } else {
            groups = loadGroups() ?? GROUPS;
        }
        // Restore selected group selection if possible, else default
        const savedId = loadSelectedGroupId();
        selectedGroupId =
            (groups.find((g) => g.id === savedId) ? savedId : groups[0]?.id) ??
            "";
    });

    // React to data changes (e.g. after server action invalidation)
    $: if (source === "db") {
        groups = data.groups;
        // Keep selectedGroupId if valid, else reset
        if (
            !groups.find((g) => g.id === selectedGroupId) &&
            groups.length > 0
        ) {
            selectedGroupId = groups[0].id;
        }
    }

    // Persistence (Local Only)
    $: if (source === "local" && groups.length > 0) saveGroups(groups);
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

    const createGroup = async (name: string, members: string[]) => {
        const cleanMembers = Array.from(
            new Set(members.map((m) => m.trim()).filter(Boolean)),
        );
        const finalMembers = cleanMembers.length > 0 ? cleanMembers : ["Me"];

        if (source === "db") {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("members", finalMembers.join(","));
            await fetch("?/createGroup", { method: "POST", body: formData });
            await invalidateAll();
        } else {
            const id = `grp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
            const newGroup: Group = {
                id,
                name,
                members: finalMembers,
                expenses: [],
            };
            groups = [...groups, newGroup];
            selectedGroupId = id;
        }
    };

    const deleteGroup = async (id: string) => {
        if (source === "db") {
            const formData = new FormData();
            formData.append("groupId", id);
            await fetch("?/deleteGroup", { method: "POST", body: formData });
            await invalidateAll();
        } else {
            groups = groups.filter((g) => g.id !== id);
            if (selectedGroupId === id) {
                const next = groups.find((g) => g.id !== id)?.id ?? "";
                selectedGroupId = next;
            }
        }
    };

    const addExpense = async (exp: Omit<Expense, "id">) => {
        if (!selectedGroup) return;

        const members = selectedGroup.members || [];
        let normalized: Omit<Expense, "id"> = exp;

        // Baking in the exchange rate
        if (normalized.currency === "JPY") {
            normalized.exchangeRate = jpyToSgdRate;
        }

        if (members.length === 1) {
            const only = members[0];
            normalized = { ...normalized, paidBy: only, splitAmong: [only] };
        } else {
            const validSplit = (normalized.splitAmong || []).filter((n) =>
                members.includes(n),
            );
            const paidBy = members.includes(normalized.paidBy)
                ? normalized.paidBy
                : (members[0] ?? normalized.paidBy);
            normalized = {
                ...normalized,
                paidBy,
                splitAmong: validSplit.length > 0 ? validSplit : members,
            };
        }

        if (source === "db") {
            const formData = new FormData();
            formData.append("groupId", selectedGroupId);
            formData.append("expense", JSON.stringify(normalized));
            await fetch("?/addExpense", { method: "POST", body: formData });
            await invalidateAll();
        } else {
            const id = `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
            const newExpense: Expense = { id, ...normalized };
            const updated: Group = {
                ...selectedGroup,
                expenses: [newExpense, ...selectedGroup.expenses],
            };
            updateGroup(updated);
        }
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
