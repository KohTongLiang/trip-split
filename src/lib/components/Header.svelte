<script lang="ts">
  export let totalSpent: number;
</script>

<header class="bg-white shadow-md rounded-xl p-6 mb-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-slate-800">TripSplit</h1>
      <p class="text-slate-500">Your trip's expense summary</p>
    </div>
    <div class="text-right">
      <p class="text-slate-500 text-sm">Total Trip Cost</p>
      <p class="text-3xl font-bold text-sky-600">
        {totalSpent.toLocaleString('en-SG', { style: 'currency', currency: 'SGD' })}
      </p>
    </div>
  </div>
</header>
