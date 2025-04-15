<!-- src/routes/dashboard/financien/+page.svelte -->
<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import FinanceOverview from "$lib/components/dashboard/finances/FinanceOverview.svelte";
  import InvoicesList from "$lib/components/dashboard/finances/InvoicesList.svelte";
  import SimpleReports from "$lib/components/dashboard/finances/SimpleReports.svelte";
  import InvoiceDetails from "$lib/components/dashboard/finances/InvoiceDetails.svelte";
  import CreateInvoice from "$lib/components/dashboard/finances/CreateInvoice.svelte";
  import ExpensesList from "$lib/components/dashboard/finances/ExpensesList.svelte";
  import CreateExpense from "$lib/components/dashboard/finances/CreateExpense.svelte";
  import ExpenseDetails from "$lib/components/dashboard/finances/ExpensesDetails.svelte";

  export let data;

  // State management
  let isLoading = true;
  let isUpdating = false;
  let financialData = {};
  let invoices = [];
  let filteredInvoices = [];
  let expenses = [];
  let filteredExpenses = [];
  let selectedDateRange = "year";
  let selectedTab = "overview";
  let selectedInvoice = null;
  let selectedExpense = null;
  let showInvoiceDetails = false;
  let showCreateInvoice = false;
  let showExpenseDetails = false;
  let showCreateExpense = false;

  // Calculate financial metrics from the data
  onMount(async () => {
    // Use actual data from the server
    invoices = data.invoices || [];
    expenses = data.expenses || [];
    filteredInvoices = [...invoices];
    filteredExpenses = [...expenses];

    // Calculate financial metrics
    calculateFinancialMetrics();

    isLoading = false;
  });

  // Function to refresh expenses without reloading the page
  async function refreshExpenses() {
    isUpdating = true;

    try {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const data = await response.json();
        expenses = data.expenses || [];
        filteredExpenses = [...expenses];

        // Recalculate financial metrics
        calculateFinancialMetrics();
      } else {
        console.error("Failed to refresh expenses data");
      }
    } catch (error) {
      console.error("Error refreshing expenses:", error);
    } finally {
      isUpdating = false;
    }
  }

  // Function to update a specific expense in the list
  function updateExpenseInList(updatedExpense) {
    expenses = expenses.map((exp) =>
      exp.id === updatedExpense.id ? updatedExpense : exp,
    );
    filteredExpenses = filteredExpenses.map((exp) =>
      exp.id === updatedExpense.id ? updatedExpense : exp,
    );

    // Recalculate financial metrics
    calculateFinancialMetrics();
  }

  // Function to remove an expense from the list
  function removeExpenseFromList(expenseId) {
    expenses = expenses.filter((exp) => exp.id !== expenseId);
    filteredExpenses = filteredExpenses.filter((exp) => exp.id !== expenseId);

    // Recalculate financial metrics
    calculateFinancialMetrics();
  }

  // Function to add a new expense to the list
  function addExpenseToList(newExpense) {
    expenses = [newExpense, ...expenses];
    filteredExpenses = [newExpense, ...filteredExpenses];

    // Recalculate financial metrics
    calculateFinancialMetrics();
  }

  function calculateFinancialMetrics() {
    // Convert string amounts to numbers for calculations
    const totalRevenue = invoices.reduce(
      (sum, inv) => sum + parseFloat(inv.amount || 0),
      0,
    );
    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount || 0),
      0,
    );
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Count unpaid invoices
    const unpaidInvoices = invoices
      .filter((inv) => inv.payment_status === "unpaid")
      .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

    // Calculate percentage of invoices paid on time (simplified estimate)
    const invoicesPaidOnTime = 0; // Deze data hebben we nog niet

    // Calculate average booking value
    const averageBookingValue =
      invoices.length > 0 ? totalRevenue / invoices.length : 0;

    // Update financial data
    financialData = {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      averageBookingValue,
      outstandingInvoices: unpaidInvoices,
      invoicesPaidOnTime,
    };
  }

  function viewInvoiceDetails(invoice) {
    selectedInvoice = invoice;
    showInvoiceDetails = true;
  }

  function closeInvoiceDetails() {
    showInvoiceDetails = false;
    setTimeout(() => {
      selectedInvoice = null;
    }, 300);
  }

  function toggleCreateInvoice() {
    showCreateInvoice = !showCreateInvoice;
  }

  function viewExpenseDetails(expense) {
    selectedExpense = expense;
    showExpenseDetails = true;
  }

  function closeExpenseDetails(event) {
    showExpenseDetails = false;

    // If the event includes details about what happened with the expense
    if (event?.detail?.refresh) {
      if (event.detail.action === "deleted" && event.detail.expenseId) {
        // Remove the expense from the list
        removeExpenseFromList(event.detail.expenseId);
      } else if (event.detail.action === "updated" && event.detail.expense) {
        // Update the expense in the list
        updateExpenseInList(event.detail.expense);
      } else {
        // If we don't have specific details, refresh all expenses
        refreshExpenses();
      }
    }

    setTimeout(() => {
      selectedExpense = null;
    }, 300);
  }

  function toggleCreateExpense() {
    showCreateExpense = !showCreateExpense;
  }

  function handleExpenseCreated(event) {
    showCreateExpense = false;

    // If the event includes a newly created expense
    if (event?.detail?.refresh) {
      if (event.detail.expense) {
        // Add the new expense to the list
        addExpenseToList(event.detail.expense);
      } else {
        // Fallback to refreshing all expenses if no expense detail is available
        refreshExpenses();
      }
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }
</script>

<div class="space-y-6 relative">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        Financiën
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        Beheer en analyseer je inkomsten en uitgaven
      </p>
    </div>

    <!-- Date Range Selector -->
  </div>

  <!-- Tab Navigation -->
  <div class="border-b border-gray-200 dark:border-gray-700">
    <nav class="flex space-x-6 overflow-x-auto" aria-label="Tabs">
      <button
        class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
        {selectedTab === 'overview'
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
        on:click={() => (selectedTab = "overview")}
      >
        Overzicht
      </button>
      <button
        class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
        {selectedTab === 'invoices'
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
        on:click={() => (selectedTab = "invoices")}
      >
        Facturen
      </button>
      <button
        class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
        {selectedTab === 'expenses'
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
        on:click={() => (selectedTab = "expenses")}
      >
        Kosten
      </button>
      <button
        class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
        {selectedTab === 'reports'
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
        on:click={() => (selectedTab = "reports")}
      >
        Rapporten
      </button>
    </nav>
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="flex justify-center items-center py-12">
      <div class="relative">
        <div
          class="w-12 h-12 rounded-full border-2 border-t-transparent border-l-transparent border-blue-600 animate-spin"
        ></div>
        <div
          class="w-12 h-12 rounded-full border-2 border-t-transparent border-r-transparent border-blue-400 animate-pulse absolute top-0 left-0"
          style="animation-duration: 1.5s;"
        ></div>
      </div>
      <p class="ml-4 font-medium text-gray-500 dark:text-gray-400">
        Financiële gegevens laden...
      </p>
    </div>
  {:else}
    <!-- Updating Overlay - only shown when data is being refreshed -->
    {#if isUpdating}
      <div
        class="absolute inset-0 bg-white/30 dark:bg-gray-800/30 flex items-center justify-center z-10 backdrop-blur-[1px]"
      >
        <div
          class="w-10 h-10 rounded-full border-2 border-t-transparent border-l-transparent border-blue-600 animate-spin"
        ></div>
      </div>
    {/if}

    <!-- Tab Contents -->
    {#if selectedTab === "overview"}
      <div in:fade={{ duration: 200 }}>
        <FinanceOverview
          {financialData}
          {invoices}
          {expenses}
          {formatCurrency}
          {formatDate}
        />
      </div>
    {:else if selectedTab === "invoices"}
      <div in:fade={{ duration: 200 }}>
        <InvoicesList
          {invoices}
          {filteredInvoices}
          {formatCurrency}
          {formatDate}
          on:viewDetails={(e) => viewInvoiceDetails(e.detail)}
          on:createInvoice={toggleCreateInvoice}
        />
      </div>
    {:else if selectedTab === "expenses"}
      <div in:fade={{ duration: 200 }}>
        <ExpensesList
          {expenses}
          {filteredExpenses}
          {formatCurrency}
          {formatDate}
          on:viewDetails={(e) => viewExpenseDetails(e.detail)}
          on:createExpense={toggleCreateExpense}
        />
      </div>
    {:else if selectedTab === "reports"}
      <div in:fade={{ duration: 200 }}>
        <SimpleReports
          {financialData}
          {invoices}
          {expenses}
          {formatCurrency}
          {selectedDateRange}
        />
      </div>
    {/if}
  {/if}

  <!-- Invoice Details Modal -->
  {#if showInvoiceDetails}
    <div
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
      on:click={closeInvoiceDetails}
    >
      <InvoiceDetails
        invoice={selectedInvoice}
        {formatCurrency}
        {formatDate}
        on:close={closeInvoiceDetails}
      />
    </div>
  {/if}

  <!-- Create Invoice Modal -->
  {#if showCreateInvoice}
    <div
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
      on:click={toggleCreateInvoice}
    >
      <CreateInvoice on:close={toggleCreateInvoice} {formatCurrency} />
    </div>
  {/if}

  <!-- Expense Details Drawer -->
  {#if showExpenseDetails}
    <div
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
      on:click={closeExpenseDetails}
    >
      <ExpenseDetails
        expense={selectedExpense}
        {formatCurrency}
        {formatDate}
        on:close={closeExpenseDetails}
      />
    </div>
  {/if}

  <!-- Create Expense Modal -->
  {#if showCreateExpense}
    <div
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
      on:click={handleExpenseCreated}
    >
      <CreateExpense on:close={handleExpenseCreated} {formatCurrency} />
    </div>
  {/if}

  <!-- Floating Add Expense Button -->
  <button
    on:click={toggleCreateExpense}
    class="fixed right-8 lg:bottom-8 bottom-20 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-colors z-30"
    title="Nieuwe uitgave toevoegen"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  </button>
</div>
