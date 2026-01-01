<script lang="ts">
    export let data;
    import { calculateSplits } from "$lib/utils/billSplitter";
    import Header from "$lib/components/Header.svelte";
    import SummaryCard from "$lib/components/SummaryCard.svelte";
    import ExpenseList from "$lib/components/ExpenseList.svelte";
    import ExpenseForm from "$lib/components/ExpenseForm.svelte";
    import CurrencyConverter from "$lib/components/CurrencyConverter.svelte";
    import { invalidateAll } from "$app/navigation";

    let jpyToSgdRate = 115.0;

    $: group = data.group;
    $: members = group?.members ?? [];
    $: expenses = group?.expenses ?? [];
    $: splits = calculateSplits(members, expenses, jpyToSgdRate);
    $: totalSpent = splits.totalSpent;
    $: totalExpense = splits.totalExpense;
    $: totalIncome = splits.totalIncome;
    $: settlements = splits.settlements;

    async function addExpense(exp: any) {
        if (!group) return;
        const formData = new FormData();
        formData.append("groupId", group.id);
        
        // Baking in the exchange rate
        if (exp.currency === "JPY") {
            exp.exchangeRate = jpyToSgdRate;
        }

        formData.append("expense", JSON.stringify(exp));
        
        const response = await fetch("/?/addExpense", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            await invalidateAll();
        }
    }
</script>

<div class="min-h-screen bg-slate-100 text-slate-800">
    <main class="max-w-7xl mx-auto p-4 md:p-8">
        <Header {totalSpent} {totalExpense} {totalIncome} />

        <div class="mb-6">
            <a href="/" class="text-sky-600 hover:underline flex items-center gap-2">
                ← Back to Groups
            </a>
        </div>

        {#if group}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1 space-y-8">
                    <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-sky-500">
                        <h2 class="text-2xl font-bold text-slate-800">{group.name}</h2>
                        <p class="text-slate-500">{members.length} members</p>
                    </div>
                    <CurrencyConverter bind:jpyToSgdRate />
                    <SummaryCard {settlements} />
                </div>

                <div class="lg:col-span-2 space-y-6">
                    <ExpenseForm {members} onAdd={addExpense} />
                    <ExpenseList {expenses} {members} />
                </div>
            </div>
        {:else}
            <div class="bg-white p-12 rounded-xl shadow-md text-center">
                <h2 class="text-xl font-bold mb-4">Please log in to see this group</h2>
                <a href="/" class="bg-sky-600 text-white px-6 py-2 rounded-lg">Go to Login</a>
            </div>
        {/if}
    </main>
</div>
