<script lang="ts">
  import type { Settlement } from '$lib/types';

  export let settlements: Settlement[];

  const ArrowRightIcon = `M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3`;
</script>

<div class="bg-white p-6 rounded-xl shadow-md">
  <h3 class="text-lg font-semibold text-slate-700 mb-4">Settlement Plan</h3>
  {#if settlements.length === 0}
    <p class="text-slate-500 text-center py-4">All expenses are settled!</p>
  {:else}
    <ul class="space-y-4">
      {#each settlements as settlement}
        <li class="bg-slate-50 p-4 rounded-lg flex items-center justify-between transition hover:bg-slate-100">
          <div class="flex items-center space-x-3">
            <span class="font-bold text-slate-800 text-lg w-24 truncate">{settlement.from}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-sky-500">
                <path stroke-linecap="round" stroke-linejoin="round" d={ArrowRightIcon} />
            </svg>
            <span class="font-bold text-slate-800 text-lg w-24 truncate">{settlement.to}</span>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-green-600">
              {settlement.amount.toLocaleString('en-SG', { style: 'currency', currency: 'SGD' })}
            </p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
