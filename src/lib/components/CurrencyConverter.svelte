<script lang="ts">
  export let jpyToSgdRate: number;
  
  // No need for a setter prop, we can bind or just dispatch. 
  // In usage, we can use bind:jpyToSgdRate.
</script>

<div class="bg-white p-6 rounded-xl shadow-md">
  <h3 class="text-lg font-semibold text-slate-700 mb-3">Exchange Rate</h3>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-slate-600">1 SGD =</span>
    <input
      type="number"
      bind:value={jpyToSgdRate}
      class="w-28 p-2 text-lg font-semibold text-slate-800 bg-slate-100 rounded-md border-2 border-transparent focus:border-sky-500 focus:outline-none focus:ring-0 transition"
    />
    <span class="font-medium text-slate-600">JPY</span>
  </div>
  <p class="text-xs text-slate-400 mt-2">Update the rate to recalculate totals.</p>
</div>
