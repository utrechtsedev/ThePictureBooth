<!-- src/lib/components/dashboard/RevenueChart.svelte -->
<script>
  import { PERIODS, getPeriod } from "$lib/state/periodState.svelte.js";

  // Props - data from your server or parent component
  let revenueData = $props();

  // Reactive variables
  let filteredData;
  let chartTitle;

  // This effect reruns whenever getPeriod() changes
  $effect(() => {
    const currentPeriod = getPeriod();

    // Filter data based on the period
    filteredData = filterDataByPeriod(revenueData, currentPeriod);

    // Update chart title based on period
    chartTitle = getChartTitle(currentPeriod);
  });

  // Helper functions
  function filterDataByPeriod(data, period) {
    if (!data) return [];

    const now = new Date();
    let startDate = new Date();

    // Determine date range based on period
    switch (period) {
      case PERIODS.WEEK:
        startDate.setDate(now.getDate() - 7);
        break;
      case PERIODS.MONTH:
        startDate.setMonth(now.getMonth() - 1);
        break;
      case PERIODS.QUARTER:
        startDate.setMonth(now.getMonth() - 3);
        break;
      case PERIODS.YEAR:
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Filter data based on date
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
  }

  function getChartTitle(period) {
    switch (period) {
      case PERIODS.WEEK:
        return "Weekly Revenue";
      case PERIODS.MONTH:
        return "Monthly Revenue";
      case PERIODS.QUARTER:
        return "Quarterly Revenue";
      case PERIODS.YEAR:
        return "Yearly Revenue";
      default:
        return "Revenue Chart";
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  function getMaxValue() {
    if (!filteredData || filteredData.length === 0) return 100;
    return Math.max(...filteredData.map((item) => item.amount)) * 1.1;
  }

  function getPercentage(value, max) {
    return (value / max) * 100;
  }
</script>

<!-- Chart UI -->
<div
  class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
>
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
      {chartTitle}
    </h3>
    <div class="text-sm text-gray-500 dark:text-gray-400">
      Currently viewing: {getPeriod()}
    </div>
  </div>

  <!-- Chart visualization -->
  <div class="h-64">
    {#if filteredData && filteredData.length > 0}
      <div class="flex items-end h-full space-x-2">
        {#each filteredData as item, i}
          {@const max = getMaxValue()}
          <div class="flex-1 flex flex-col justify-end h-full">
            <div
              class="bg-blue-500 dark:bg-blue-400 rounded-t-sm relative"
              style="height: {getPercentage(item.amount, max)}%"
            >
              <div
                class="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                {formatCurrency(item.amount)}
              </div>
            </div>
            <div
              class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap"
            >
              {item.label}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="flex items-center justify-center h-full text-gray-400 dark:text-gray-500"
      >
        No data available for this period
      </div>
    {/if}
  </div>
</div>

