<script lang="ts">
  export let totalSpent: number;
  export let totalExpense: number = 0;
  export let totalIncome: number = 0;
  import { authStore, logout } from "../stores/authStore";
</script>

<header class="bg-white shadow-md rounded-xl p-6 mb-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-slate-800">TripSplit</h1>
      <p class="text-slate-500">Your trip's expense summary</p>
    </div>
    <div class="flex items-center space-x-6">
      <div class="flex gap-6">
        <div class="text-right">
          <p class="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Expense</p>
          <p class="text-xl font-bold text-slate-700">
            {totalExpense.toLocaleString("en-SG", {
              style: "currency",
              currency: "SGD",
            })}
          </p>
        </div>
        <div class="text-right">
          <p class="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Income</p>
          <p class="text-xl font-bold text-green-600">
            {totalIncome.toLocaleString("en-SG", {
              style: "currency",
              currency: "SGD",
            })}
          </p>
        </div>
        <div class="text-right border-l pl-6">
          <p class="text-slate-500 text-sm font-medium">Net Balance</p>
          <p class="text-3xl font-bold text-sky-600">
            {totalSpent.toLocaleString("en-SG", {
              style: "currency",
              currency: "SGD",
            })}
          </p>
        </div>
      </div>
      <div>
        {#if $authStore.loading}
          <div class="text-sm text-slate-400">Loading...</div>
        {:else if $authStore.user}
          <div class="flex items-center space-x-3">
            {#if $authStore.user.photoURL}
              <img
                src={$authStore.user.photoURL}
                alt="Avatar"
                class="w-8 h-8 rounded-full border border-slate-200"
              />
            {/if}
            <div class="text-right">
              <p class="text-xs text-slate-500">
                {$authStore.user.displayName}
              </p>
              <button
                class="text-sm font-medium text-red-500 hover:text-red-600 underline"
                on:click={logout}
              >
                Logout
              </button>
            </div>
          </div>
        {:else}
          <div class="text-sm text-slate-500">Please sign in below</div>
        {/if}
      </div>
    </div>
  </div>
</header>
