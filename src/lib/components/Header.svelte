<script lang="ts">
  export let totalSpent: number;
  import { authStore, loginWithGoogle, logout } from "../stores/authStore";
</script>

<header class="bg-white shadow-md rounded-xl p-6 mb-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-slate-800">TripSplit</h1>
      <p class="text-slate-500">Your trip's expense summary</p>
    </div>
    <div class="flex items-center space-x-6">
      <div class="text-right">
        <p class="text-slate-500 text-sm">Total Trip Cost</p>
        <p class="text-3xl font-bold text-sky-600">
          {totalSpent.toLocaleString("en-SG", {
            style: "currency",
            currency: "SGD",
          })}
        </p>
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
          <button
            class="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
            on:click={loginWithGoogle}
          >
            Login with Google
          </button>
        {/if}
      </div>
    </div>
  </div>
</header>
