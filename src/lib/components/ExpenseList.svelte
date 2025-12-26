<script lang="ts">
    import { Currency, type Expense } from "$lib/types";

    export let expenses: Expense[];
    export let members: string[];

    const formatAmount = (amount: number, currency: Currency) => {
        return amount.toLocaleString(
            currency === Currency.JPY ? "ja-JP" : "en-SG",
            {
                style: "currency",
                currency: currency,
                minimumFractionDigits: currency === Currency.JPY ? 0 : 2,
                maximumFractionDigits: currency === Currency.JPY ? 0 : 2,
            },
        );
    };

    const getParticipantsLabel = (expense: Expense) => {
        const participantNames =
            expense.splitAmong && expense.splitAmong.length > 0
                ? expense.splitAmong
                : members;
        if (participantNames.length === members.length) return "All members";
        if (participantNames.length === 1) return `Only ${participantNames[0]}`;
        return participantNames.join(", ");
    };
</script>

<div class="bg-white p-6 rounded-xl shadow-md">
    <h3 class="text-lg font-semibold text-slate-700 mb-4">Transactions</h3>
    <div class="max-h-[600px] overflow-y-auto pr-2">
        <ul class="space-y-3">
            {#each expenses as expense (expense.id)}
                <li
                    class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                    <div class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                            {#if expense.currency === Currency.JPY}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="h-6 w-6 text-red-500"
                                >
                                    <path
                                        d="M12.25 3H11.75C10.027 3 8.61 4.298 8.43 6H5V8H8.253C8.103 8.647 8 9.314 8 10V11H5V13H8V15H5V17H8V21H10V17H14V21H16V17H19V15H16V13H19V11H16V10C16 6.134 12.866 3 9 3H8.5V6C8.5 7.933 10.067 9.5 12 9.5C13.933 9.5 15.5 7.933 15.5 6V3H12.25ZM10 11H14V13H10V11Z"
                                    />
                                </svg>
                            {:else}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="h-6 w-6 text-blue-500"
                                >
                                    <path
                                        d="M18.5 3H11C7.134 3 4 6.134 4 10C4 13.866 7.134 17 11 17H12V19H10V21H14V19H13V3H18.5V5H15V8H18.5C20.433 8 22 9.567 22 11.5C22 13.433 20.433 15 18.5 15H15V13H18.5C19.328 13 20 12.328 20 11.5C20 10.672 19.328 10 18.5 10H13V6H11C8.239 6 6 7.791 6 10C6 12.209 8.239 14 11 14H18.5C19.881 14 21 12.881 21 11.5C21 10.119 19.881 9 18.5 9H15V6H18.5V3Z"
                                    />
                                </svg>
                            {/if}
                        </div>
                        <div>
                            <p class="font-medium text-slate-800">
                                {expense.description}
                            </p>
                            <p class="text-sm text-slate-500">
                                Paid by {expense.paidBy}
                            </p>
                            <p class="text-xs text-slate-400">
                                Split among: {getParticipantsLabel(expense)}
                            </p>
                        </div>
                    </div>
                    <p
                        class="font-semibold text-slate-700 text-right min-w-[120px]"
                    >
                        {formatAmount(expense.amount, expense.currency)}
                    </p>
                </li>
            {/each}
        </ul>
    </div>
</div>
