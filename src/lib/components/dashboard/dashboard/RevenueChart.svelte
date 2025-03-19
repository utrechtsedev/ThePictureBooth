<script>
  export let revenueChart;
  let selectedPeriod = 'week'; 
  function formatCurrency(amount) {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
  
  function getMaxRevenueValue() {
    return Math.max(...revenueChart.map(item => item.revenue)) * 1.1;
  }
  
  function getPercentage(value, max) {
    return (value / max) * 100;
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Omzet Trend</h3>
  </div>
  
  <div class="h-64">
    <!-- Simple line chart visualization -->
    <div class="flex items-end h-full space-x-2">
      {#each revenueChart as item, i}
        {@const max = getMaxRevenueValue()}
        <div class="flex-1 flex flex-col justify-end h-full">
          <div 
            class="bg-blue-500 dark:bg-blue-400 rounded-t-sm relative" 
            style="height: {getPercentage(item.revenue, max)}%"
          >
            <div class="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {formatCurrency(item.revenue)}
            </div>
          </div>
          <div class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">
            {item.date}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
