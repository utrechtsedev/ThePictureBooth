<script>
  export let revenueChart;
  let selectedPeriod = 'week'; 
  let hoveredItem = null;
  let hoveredIndex = null;
  
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
  
  function formatDate(dateStr) {
    // Split the date string into parts (assuming format like "jan 2025" or "q1 2025")
    const parts = dateStr.split(' ');
    if (parts.length !== 2) return { period: dateStr, year: '' }; // Handle unexpected formats
    
    return {
      period: parts[0],
      year: parts[1]
    };
  }
  
  function handleMouseEnter(item, index) {
    hoveredItem = item;
    hoveredIndex = index;
  }
  
  function handleMouseLeave() {
    hoveredItem = null;
    hoveredIndex = null;
  }
  
  function getTooltipPosition(index, total) {
    // Calculate base position in %
    const basePosition = (100 / total) * (index + 0.5);
    
    // Adjust for edges
    if (index === 0) {
      // First bar - align tooltip to left
      return { left: '0', transform: 'translateX(0)' };
    } else if (index === total - 1) {
      // Last bar - align tooltip to right
      return { right: '0', transform: 'translateX(0)' };
    } else {
      // Middle bars - position tooltip centered above bar
      return { left: basePosition + '%', transform: 'translateX(-50%)' };
    }
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Omzet Trend</h3>
  </div>
  
  <div class="h-64 relative">
    <!-- Simple line chart visualization -->
    <div class="flex items-end h-full space-x-2">
      {#each revenueChart as item, i}
        {@const max = getMaxRevenueValue()}
        {@const formattedDate = formatDate(item.date)}
        <div class="flex-1 flex flex-col justify-end h-full">
          <div 
            class="bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-t-sm relative cursor-pointer transition-colors"
            style="height: {getPercentage(item.revenue, max)}%"
            on:mouseenter={() => handleMouseEnter(item, i)}
            on:mouseleave={handleMouseLeave}
          >
            <div class="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {formatCurrency(item.revenue)}
            </div>
          </div>
          <div class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 flex flex-col">
            <span>{formattedDate.period}</span>
            {#if formattedDate.year}
              <span>{formattedDate.year}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Tooltip -->
    {#if hoveredItem && hoveredIndex !== null}
      {@const position = getTooltipPosition(hoveredIndex, revenueChart.length)}
      <div 
        class="absolute bottom-full mb-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 pointer-events-none w-56"
        style="
          {Object.entries(position).map(([key, value]) => `${key}: ${value}`).join('; ')};
        "
      >
        <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">{hoveredItem.date}</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          <div class="text-xs text-gray-500 dark:text-gray-400">Omzet:</div>
          <div class="text-xs font-medium text-gray-900 dark:text-white text-right">{formatCurrency(hoveredItem.revenue)}</div>
          
          {#if hoveredItem.bookings !== undefined}
            <div class="text-xs text-gray-500 dark:text-gray-400">Boekingen:</div>
            <div class="text-xs font-medium text-gray-900 dark:text-white text-right">{hoveredItem.bookings}</div>
          {/if}
          
          {#if hoveredItem.avgValue !== undefined}
            <div class="text-xs text-gray-500 dark:text-gray-400">Gem. waarde:</div>
            <div class="text-xs font-medium text-gray-900 dark:text-white text-right">{formatCurrency(hoveredItem.avgValue)}</div>
          {/if}
          
          {#if hoveredItem.growth !== undefined}
            <div class="text-xs text-gray-500 dark:text-gray-400">Groei:</div>
            <div class="text-xs font-medium text-gray-900 dark:text-white text-right" class:text-green-600={hoveredItem.growth > 0} class:dark:text-green-400={hoveredItem.growth > 0} class:text-red-600={hoveredItem.growth < 0} class:dark:text-red-400={hoveredItem.growth < 0}>
              {hoveredItem.growth > 0 ? '+' : ''}{hoveredItem.growth}%
            </div>
          {/if}
        </div>
        
        <!-- Triangle pointer - adjustment based on position -->
        {#if hoveredIndex === 0}
          <!-- Left-aligned tooltip -->
          <div class="absolute h-2 w-2 bottom-0 left-6 transform translate-y-1 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"></div>
        {:else if hoveredIndex === revenueChart.length - 1}
          <!-- Right-aligned tooltip -->
          <div class="absolute h-2 w-2 bottom-0 right-6 transform translate-y-1 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"></div>
        {:else}
          <!-- Center-aligned tooltip -->
          <div class="absolute h-2 w-2 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"></div>
        {/if}
      </div>
    {/if}
  </div>
</div>
