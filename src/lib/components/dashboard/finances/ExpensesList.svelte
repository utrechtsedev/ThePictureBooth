<!-- src/lib/components/dashboard/finances/ExpensesList.svelte -->
<script>
  import { createEventDispatcher } from "svelte";

  export let expenses = [];
  export let filteredExpenses = [];
  export let formatCurrency;
  export let formatDate;

  const dispatch = createEventDispatcher();

  // Component state
  let searchQuery = "";
  let categoryFilter = "all";
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // Available categories derived from expense data
  $: categories = [...new Set(expenses.map((expense) => expense.category))];

  $: {
    applyExpenseFilters();
  }

  function applyExpenseFilters() {
    let results = [...expenses];

    // Apply category filter
    if (categoryFilter !== "all") {
      results = results.filter(
        (expense) => expense.category === categoryFilter,
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.id.toLowerCase().includes(query) ||
          expense.supplier.toLowerCase().includes(query) || // Changed from vendor
          expense.category.toLowerCase().includes(query),
      );
    }

    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredExpenses = results;
    totalPages = Math.ceil(results.length / itemsPerPage);

    // Reset to first page when filters change
    currentPage = 1;
  }

  function getPaginatedExpenses() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredExpenses.slice(start, end);
  }

  function viewExpenseDetails(expense) {
    dispatch("viewDetails", expense);
  }

  function createExpense() {
    dispatch("createExpense");
  }

  function getCategoryClass(category) {
    const classes = {
      Apparatuur:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Software:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Vervoer:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Marketing:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      "Props & Accessoires":
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      Onderhoud:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      Abonnementen:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
      Kantoorartikelen:
        "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      Verzekering:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Training:
        "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
      Telefoon:
        "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
      Printer:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };

    return (
      classes[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  }
</script>

<div class="space-y-6">
  <div
    class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
  >
    <h2 class="text-lg font-medium text-gray-900 dark:text-white">Kosten</h2>

    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Category Filter -->
      <div class="relative">
        <select
          bind:value={categoryFilter}
          on:change={applyExpenseFilters}
          class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none pr-8"
        >
          <option value="all">Alle categorieën</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
        <div
          class="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      <!-- Search and New Expense Button -->
      <div class="flex space-x-2">
        <div class="relative">
          <input
            type="text"
            placeholder="Zoek kosten..."
            bind:value={searchQuery}
            on:input={applyExpenseFilters}
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

        <button
          on:click={createExpense}
          class="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-colors shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v14m-7-7h14"
            />
          </svg>
          Nieuwe Uitgave
        </button>
      </div>
    </div>
  </div>

  <!-- Expenses List -->
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    {#if filteredExpenses.length === 0}
      <div
        class="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">
          Geen uitgaven gevonden
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
          Er zijn geen uitgaven die voldoen aan je zoekcriteria. Probeer andere
          filters of voeg een nieuwe uitgave toe.
        </p>
        <button
          on:click={createExpense}
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nieuwe uitgave toevoegen
        </button>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >ID</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Categorie</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Beschrijving</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Datum</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Bedrag</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Leverancier</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Actie</th
              >
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            {#each getPaginatedExpenses() as expense}
              <tr
                class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  {expense.id.substring(0, 8)}...
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    {getCategoryClass(expense.category)}"
                  >
                    {expense.category}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {expense.description}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {formatDate(expense.date)}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {formatCurrency(expense.amount)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {expense.supplier}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    on:click={() => viewExpenseDetails(expense)}
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Details
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      {#if totalPages > 1}
        <div
          class="bg-gray-50 dark:bg-gray-900/30 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6"
        >
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Resultaten <span class="font-medium"
                  >{(currentPage - 1) * itemsPerPage + 1}</span
                >
                tot
                <span class="font-medium"
                  >{Math.min(
                    currentPage * itemsPerPage,
                    filteredExpenses.length,
                  )}</span
                >
                van <span class="font-medium">{filteredExpenses.length}</span> uitgaven
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  on:click={() => (currentPage = Math.max(1, currentPage - 1))}
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={currentPage === 1}
                >
                  <span class="sr-only">Vorige</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                {#each Array(Math.min(5, totalPages)) as _, index}
                  {@const pageNum =
                    currentPage > 3 && totalPages > 5
                      ? currentPage -
                        3 +
                        index +
                        (currentPage + 2 > totalPages
                          ? totalPages - currentPage - 2
                          : 0)
                      : index + 1}
                  {#if pageNum <= totalPages}
                    <button
                      on:click={() => (currentPage = pageNum)}
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium
                      {currentPage === pageNum
                        ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
                    >
                      {pageNum}
                    </button>
                  {/if}
                {/each}
                <button
                  on:click={() =>
                    (currentPage = Math.min(totalPages, currentPage + 1))}
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={currentPage === totalPages}
                >
                  <span class="sr-only">Volgende</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

