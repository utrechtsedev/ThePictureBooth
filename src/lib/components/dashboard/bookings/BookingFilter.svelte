<!-- src/lib/components/dashboard/bookings/BookingFilter.svelte -->
<script>
  // Props
  export let selectedView = "list";
  export let selectedFilter = "all";
  export let searchQuery = "";

  // Event handlers/callbacks
  export let onViewChange = () => {};
  export let onFilterChange = () => {};
  export let onSearchChange = () => {};

  // Handle view selection
  function handleViewChange(view) {
    selectedView = view;
    onViewChange(view);
  }

  // Handle filter selection
  function handleFilterChange(filter) {
    selectedFilter = filter;
    onFilterChange(filter);
  }

  // Handle search input
  function handleSearch(event) {
    searchQuery = event.target.value;
    onSearchChange(searchQuery);
  }
</script>

<div
  class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-700"
>
  <div class="flex flex-col md:flex-row gap-3 md:gap-4">
    <!-- View Toggle -->
    <div
      class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full md:w-auto"
    >
      <button
        class="px-3 md:px-4 py-2 text-sm font-medium flex items-center justify-center flex-1 md:flex-initial {selectedView ===
        'list'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => handleViewChange("list")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1 md:mr-1.5"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"
          />
        </svg>
        Lijst
      </button>
      <button
        class="px-3 md:px-4 py-2 text-sm font-medium flex items-center justify-center flex-1 md:flex-initial {selectedView ===
        'calendar'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => handleViewChange("calendar")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1 md:mr-1.5"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7 11h2v2H7v-2zm0 4h2v2H7v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"
          />
          <path
            fill="currentColor"
            d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"
          />
        </svg>
        Kalender
      </button>
    </div>

    <!-- Status Filter -->
    <div
      class="grid grid-cols-2 md:flex md:space-x-2 md:overflow-x-auto md:pb-1 md:flex-wrap md:flex-nowrap gap-2 md:gap-0"
    >
      <button
        class="px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap
        {selectedFilter === 'all'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => handleFilterChange("all")}
      >
        Alle boekingen
      </button>
      <button
        class="px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap
        {selectedFilter === 'upcoming'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => handleFilterChange("upcoming")}
      >
        Aankomend
      </button>
      <button
        class="px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap
        {selectedFilter === 'completed'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => handleFilterChange("completed")}
      >
        Voltooid
      </button>
      <button
        class="px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap
        {selectedFilter === 'cancelled'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => handleFilterChange("cancelled")}
      >
        Geannuleerd
      </button>
    </div>

    <!-- Search -->
    <div class="relative w-full md:flex-grow md:max-w-md md:ml-auto">
      <input
        type="text"
        placeholder="Zoek op naam, type of locatie..."
        value={searchQuery}
        on:input={handleSearch}
        class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
        text-sm"
      />
      <div class="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"
          />
        </svg>
      </div>
    </div>
  </div>
</div>

