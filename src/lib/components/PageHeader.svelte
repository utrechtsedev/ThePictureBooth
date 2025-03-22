<script>
    import { PERIODS, getPeriod, setPeriod } from "$lib/state/periodState.svelte.js";
    let showWelcomeModal = false;
    
    // We need a reactive variable that updates when getPeriod() changes
    $effect(() => {
      // This will re-run whenever getPeriod() returns a different value
      const currentPeriod = getPeriod();
    });
  </script>
  
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-1">Overzicht van je fotobooth business</p>
    </div>
    
    <!-- Period Selector -->
    <div class="flex w-full sm:w-auto rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        class="flex-1 px-3 py-2 text-sm font-medium text-center whitespace-nowrap {getPeriod() === PERIODS.WEEK ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => setPeriod(PERIODS.WEEK)}>Week
      </button>
      <button
        class="flex-1 px-3 py-2 text-sm font-medium text-center whitespace-nowrap {getPeriod() === PERIODS.MONTH ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => setPeriod(PERIODS.MONTH)}>
        Maand
      </button>
      <button
        class="flex-1 px-3 py-2 text-sm font-medium text-center whitespace-nowrap
        {getPeriod() === PERIODS.QUARTER
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => setPeriod(PERIODS.QUARTER)}>
        Kwartaal
      </button>
      <button
        class="flex-1 px-3 py-2 text-sm font-medium text-center whitespace-nowrap
        {getPeriod() === PERIODS.YEAR
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => setPeriod(PERIODS.YEAR)}>
        Jaar
      </button>
    </div>
  </div>
