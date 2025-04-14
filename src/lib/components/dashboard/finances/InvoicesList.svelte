<!-- src/lib/components/dashboard/finances/InvoicesList.svelte -->
<script>
  import { createEventDispatcher } from "svelte";

  export let invoices = [];
  export let filteredInvoices = [];
  export let formatCurrency;
  export let formatDate;
  const dispatch = createEventDispatcher();

  // Component state
  let searchQuery = "";
  let invoiceFilter = "all";
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  $: {
    applyInvoiceFilters();
  }

  function applyInvoiceFilters() {
    let results = [...invoices];

    // Apply status filter
    if (invoiceFilter === "paid") {
      results = results.filter((invoice) => invoice.payment_status === "paid");
    } else if (invoiceFilter === "pending") {
      results = results.filter(
        (invoice) => invoice.payment_status === "pending",
      );
    } else if (invoiceFilter === "overdue") {
      results = results.filter(
        (invoice) => invoice.payment_status === "overdue",
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (invoice) =>
          (invoice.customer?.name || "").toLowerCase().includes(query) ||
          (invoice.id || "").toLowerCase().includes(query) ||
          (invoice.invoice_number || "").toLowerCase().includes(query) ||
          (invoice.eventType || "").toLowerCase().includes(query),
      );
    }

    // Sort by date (newest first)
    results.sort((a, b) => {
      // Safely get dates, using invoice_date or due_date as fallbacks
      const dateA = new Date(a.due_date || a.invoice_date || 0);
      const dateB = new Date(b.due_date || b.invoice_date || 0);
      return dateB - dateA;
    });

    filteredInvoices = results;
    totalPages = Math.ceil(results.length / itemsPerPage);

    // Reset to first page when filters change
    currentPage = 1;
  }

  function getPaginatedInvoices() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredInvoices.slice(start, end);
  }

  function viewInvoiceDetails(invoice) {
    dispatch("viewDetails", invoice);
  }

  function createInvoice() {
    dispatch("createInvoice");
  }

  // Safe date formatting function
  function safeFormatDate(dateString) {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "-";
      return formatDate(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  }

  function getInvoiceStatusClass(status) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  function getInvoiceStatusLabel(status) {
    switch (status) {
      case "paid":
        return "Betaald";
      case "pending":
        return "In afwachting";
      case "overdue":
        return "Te laat";
      case "unpaid":
        return "Niet betaald";
      default:
        return status || "Onbekend";
    }
  }
</script>

<div class="space-y-6">
  <div
    class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
  >
    <h2 class="text-lg font-medium text-gray-900 dark:text-white">Facturen</h2>

    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Invoice Filter -->
      <div
        class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <button
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {invoiceFilter === 'all'
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => {
            invoiceFilter = "all";
            applyInvoiceFilters();
          }}
        >
          Alle
        </button>
        <button
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {invoiceFilter === 'paid'
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => {
            invoiceFilter = "paid";
            applyInvoiceFilters();
          }}
        >
          Betaald
        </button>
        <button
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {invoiceFilter === 'pending'
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => {
            invoiceFilter = "pending";
            applyInvoiceFilters();
          }}
        >
          In afwachting
        </button>
        <button
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {invoiceFilter === 'overdue'
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => {
            invoiceFilter = "overdue";
            applyInvoiceFilters();
          }}
        >
          Te laat
        </button>
      </div>

      <!-- Search and New Invoice Button -->
      <div class="flex space-x-2">
        <div class="relative">
          <input
            type="text"
            placeholder="Zoek facturen..."
            bind:value={searchQuery}
            on:input={applyInvoiceFilters}
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
          on:click={createInvoice}
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
          Nieuwe Factuur
        </button>
      </div>
    </div>
  </div>

  <!-- Invoices List -->
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    {#if filteredInvoices.length === 0}
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
            d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m0 14H4v-6h16zm0-10H4V6h16z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">
          Geen facturen gevonden
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
          Er zijn geen facturen die voldoen aan je zoekcriteria. Probeer andere
          filters of maak een nieuwe factuur.
        </p>
        <button
          on:click={createInvoice}
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nieuwe factuur aanmaken
        </button>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Factuurnr.</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Klant</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Type</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Bedrag</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Uiterste datum</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Status</th
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
            {#each getPaginatedInvoices() as invoice}
              <tr
                class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  {invoice.invoice_number || invoice.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {invoice.Customer?.first_name +
                      " " +
                      invoice.Customer?.last_name || "Onbekende klant"}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {invoice.Customer?.email || ""}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    Eindfactuur
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {safeFormatDate(invoice.invoice_date)}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {formatCurrency(invoice.amount || 0)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {safeFormatDate(invoice.due_date)}
                  </div>
                  {#if invoice.payment_status === "paid"}
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {#if invoice.paid_date}
                        Betaald op {safeFormatDate(invoice.paid_date)}
                      {/if}
                    </div>
                  {/if}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getInvoiceStatusClass(
                      invoice.payment_status,
                    )}"
                  >
                    {getInvoiceStatusLabel(invoice.payment_status)}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    on:click={() => viewInvoiceDetails(invoice)}
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    Details
                  </button>
                  {#if invoice.pdf_path}
                    <a
                      href={invoice.pdf_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Downloaden
                    </a>
                  {:else}
                    <span class="text-gray-400 dark:text-gray-600"
                      >Downloaden</span
                    >
                  {/if}
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
                    filteredInvoices.length,
                  )}</span
                >
                van <span class="font-medium">{filteredInvoices.length}</span> facturen
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

