<script lang="ts">
    import { Currency, type Expense, type TransactionType } from "$lib/types";

    export let members: string[];
    export let onAdd: (expense: Omit<Expense, "id">) => void;

    let description = "";
    let amount = "";
    let currency = Currency.JPY;
    let type: TransactionType = 'expense';
    let paidBy = "";
    let splitAmong: string[] = [];

    $: isSingleMember = members.length === 1;

    // React to members changes or init
    $: {
        if (!members.includes(paidBy)) {
            paidBy = members[0] ?? "";
        }
    }

    // splitAmong logic
    $: {
        const filtered = splitAmong.filter((n) => members.includes(n));
        if (isSingleMember) {
            splitAmong = members[0] ? [members[0]] : [];
        } else {
            // If we lost some members but still have some, keep them.
            // If we haven't initialized splitAmong yet (empty), default to all.
            // If we filtered and result is different or empty, update.
            if (
                filtered.length === 0 &&
                members.length > 0 &&
                splitAmong.length === 0
            ) {
                splitAmong = [...members];
            } else if (filtered.length !== splitAmong.length) {
                splitAmong = filtered;
            }
        }
    }

    const toggleSplit = (name: string) => {
        if (isSingleMember) return;
        if (splitAmong.includes(name)) {
            splitAmong = splitAmong.filter((x) => x !== name);
        } else {
            splitAmong = [...splitAmong, name];
        }
    };

    const setAllMembers = () => (splitAmong = [...members]);
    const setOnlyPayer = () => (splitAmong = paidBy ? [paidBy] : []);

    const reset = () => {
        description = "";
        amount = "";
        currency = Currency.JPY;
        type = 'expense';
        paidBy = members[0] ?? "";
        splitAmong = isSingleMember
            ? members[0]
                ? [members[0]]
                : []
            : [...members];
    };

    const submit = () => {
        const amt = Number(amount);
        if (!description.trim()) return;
        if (!amt || amt <= 0) return;
        if (!paidBy) return;
        const validSplit = splitAmong.filter((name) => members.includes(name));
        if (validSplit.length === 0) return;

        onAdd({
            description: description.trim(),
            amount: amt,
            currency,
            type,
            paidBy,
            splitAmong: validSplit,
        });
        reset();
    };
</script>

<div class="bg-white p-6 rounded-xl shadow-md">
    <h3 class="text-lg font-semibold text-slate-700 mb-4">Add Transaction</h3>
    <form on:submit|preventDefault={submit} class="space-y-4">
        <div class="flex p-1 bg-slate-100 rounded-lg mb-4">
            <button
                type="button"
                class={`flex-1 py-2 text-sm font-medium rounded-md transition ${type === 'expense' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                on:click={() => type = 'expense'}
            >
                Expense
            </button>
            <button
                type="button"
                class={`flex-1 py-2 text-sm font-medium rounded-md transition ${type === 'income' ? 'bg-white shadow text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
                on:click={() => type = 'income'}
            >
                Income
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label
                    for="description"
                    class="block text-sm text-slate-600 mb-1">Description</label
                >
                <input
                    id="description"
                    type="text"
                    bind:value={description}
                    placeholder="e.g. Dinner at Udon"
                    class="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
                    required
                />
            </div>
            <div class="grid grid-cols-3 gap-2 items-end">
                <div class="col-span-2">
                    <label
                        for="amount"
                        class="block text-sm text-slate-600 mb-1">Amount</label
                    >
                    <input
                        id="amount"
                        type="number"
                        inputmode="decimal"
                        step="0.01"
                        min="0"
                        bind:value={amount}
                        class="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
                        required
                    />
                </div>
                <div>
                    <label
                        for="currency"
                        class="block text-sm text-slate-600 mb-1"
                        >Currency</label
                    >
                    <select
                        id="currency"
                        bind:value={currency}
                        class="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
                    >
                        <option value={Currency.JPY}>JPY</option>
                        <option value={Currency.SGD}>SGD</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="paidBy" class="block text-sm text-slate-600 mb-1"
                    >Paid by</label
                >
                <select
                    id="paidBy"
                    bind:value={paidBy}
                    class="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
                    disabled={isSingleMember}
                >
                    {#each members as name}
                        <option value={name}>{name}</option>
                    {/each}
                </select>
            </div>
            <div>
                <div class="flex items-center justify-between">
                    <span class="block text-sm text-slate-600 mb-1"
                        >Split among</span
                    >
                    <div class="flex gap-2">
                        <button
                            type="button"
                            on:click={setAllMembers}
                            class="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSingleMember}>All</button
                        >
                        <button
                            type="button"
                            on:click={setOnlyPayer}
                            class="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSingleMember}>Only payer</button
                        >
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    {#each members as name}
                        <label
                            class={`px-2 py-1 rounded border cursor-pointer ${splitAmong.includes(name) ? "bg-sky-100 border-sky-300" : "bg-slate-50 border-slate-200"}`}
                        >
                            <input
                                type="checkbox"
                                class="mr-2"
                                checked={splitAmong.includes(name)}
                                on:change={() => toggleSplit(name)}
                            />
                            {name}
                        </label>
                    {/each}
                </div>
            </div>
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                class={`px-6 py-2 rounded font-bold text-white transition ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-sky-600 hover:bg-sky-700'}`}
            >
                Add {type === 'income' ? 'Income' : 'Expense'}
            </button>
        </div>
    </form>
</div>
