<script>
  import { createEventDispatcher } from "svelte";

  export let searchQuery = "";
  export let selectedFilter = "all";
  export let selectedSort = "name_asc";

  const dispatch = createEventDispatcher();

  function handleSearch() {
    dispatch("search");
  }

  function handleFilterChange() {
    dispatch("filterChange");
  }

  function handleSortChange() {
    dispatch("sortChange");
  }
</script>

<div
  class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4"
>
  <div class="flex flex-col sm:flex-row gap-4">
    <!-- Customer Filter -->
    <div class="flex space-x-2 overflow-x-auto pb-1">
      <button
        class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
          {selectedFilter === 'all'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => {
          selectedFilter = "all";
          handleFilterChange();
        }}
      >
        Alle klanten
      </button>
      <button
        class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
          {selectedFilter === 'individual'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => {
          selectedFilter = "individual";
          handleFilterChange();
        }}
      >
        Particulieren
      </button>
      <button
        class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
          {selectedFilter === 'business'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => {
          selectedFilter = "business";
          handleFilterChange();
        }}
      >
        Bedrijven
      </button>
      <button
        class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
          {selectedFilter === 'with_events'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => {
          selectedFilter = "with_events";
          handleFilterChange();
        }}
      >
        Met boekingen
      </button>
      <button
        class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
          {selectedFilter === 'no_events'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
        on:click={() => {
          selectedFilter = "no_events";
          handleFilterChange();
        }}
      >
        Zonder boekingen
      </button>
    </div>

    <!-- Search and Sort -->
    <div class="flex space-x-2 ml-auto">
      <div class="relative">
        <input
          type="text"
          placeholder="Zoek op naam, e-mail, telefoon..."
          bind:value={searchQuery}
          on:input={handleSearch}
          class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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

      <select
        bind:value={selectedSort}
        on:change={handleSortChange}
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
      >
        <option value="name_asc">Naam (A-Z)</option>
        <option value="name_desc">Naam (Z-A)</option>
        <option value="date_asc">Datum (oudste eerst)</option>
        <option value="date_desc">Datum (nieuwste eerst)</option>
        <option value="value_asc">Waarde (laag-hoog)</option>
        <option value="value_desc">Waarde (hoog-laag)</option>
      </select>
    </div>
  </div>
</div>
