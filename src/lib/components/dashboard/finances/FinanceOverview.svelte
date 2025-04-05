<!-- src/lib/components/dashboard/finances/FinanceOverview.svelte -->
<script>
  export let financialData = {};
  export let invoices = [];
  export let expenses = [];
  export let formatCurrency;
  export let formatDate;

  // Calculated metrics
  $: totalRevenue = financialData.totalRevenue || 0;
  $: totalExpenses = financialData.totalExpenses || 0;
  $: netProfit = financialData.netProfit || 0;
  $: profitMargin = financialData.profitMargin || 0;

  // Recent invoices, sort by invoice_date
  $: recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date))
    .slice(0, 5);

  // Recent expenses, sort by date
  $: recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Invoice statistics
  $: paidInvoices = invoices.filter((inv) => inv.payment_status === "paid");
  $: pendingInvoices = invoices.filter((inv) => {
    // Pending betekent: unpaid en due_date in de toekomst
    return (
      inv.payment_status === "unpaid" && new Date(inv.due_date) > new Date()
    );
  });
  $: overdueInvoices = invoices.filter((inv) => {
    // Overdue betekent: unpaid en due_date in het verleden
    return (
      inv.payment_status === "unpaid" && new Date(inv.due_date) < new Date()
    );
  });

  // Total values by status
  $: paidValue = paidInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.amount || 0),
    0,
  );
  $: pendingValue = pendingInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.amount || 0),
    0,
  );
  $: overdueValue = overdueInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.amount || 0),
    0,
  );

  // Expense categories
  $: expenseCategories = expenses.reduce((categories, expense) => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += parseFloat(expense.amount || 0);
    return categories;
  }, {});

  $: sortedExpenseCategories = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({ category, amount }));
</script>

<div class="space-y-6">
  <!-- Quick stats cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total revenue -->
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div class="flex justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Totale omzet
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg self-start">
          <svg
            class="w-6 h-6 text-blue-500 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Total expenses -->
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div class="flex justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Totale uitgaven
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg self-start">
          <svg
            class="w-6 h-6 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Net profit -->
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div class="flex justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Nettowinst
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(netProfit)}
          </p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg self-start">
          <svg
            class="w-6 h-6 text-green-500 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Winstmarge: <span class="font-medium text-gray-900 dark:text-white"
            >{profitMargin.toFixed(2)}%</span
          >
        </p>
      </div>
    </div>

    <!-- Outstanding invoices -->
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div class="flex justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Openstaande facturen
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(financialData.outstandingInvoices || 0)}
          </p>
        </div>
        <div
          class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg self-start"
        >
          <svg
            class="w-6 h-6 text-yellow-500 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent transactions (two columns on large screens) -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Recent Invoices -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Recente facturen
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Klant</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Datum</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Bedrag</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Status</th
              >
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each recentInvoices as invoice}
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {invoice.Customer
                    ? `${invoice.Customer.first_name} ${invoice.Customer.last_name}`
                    : "Onbekend"}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {formatDate(invoice.invoice_date)}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {formatCurrency(invoice.amount)}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    {invoice.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : new Date(invoice.due_date) > new Date()
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}"
                  >
                    {invoice.payment_status === "paid"
                      ? "Betaald"
                      : new Date(invoice.due_date) > new Date()
                        ? "In afwachting"
                        : "Te laat"}
                  </span>
                </td>
              </tr>
            {/each}
            {#if recentInvoices.length === 0}
              <tr>
                <td
                  colspan="4"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Geen recente facturen gevonden
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent Expenses -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Recente uitgaven
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Beschrijving</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Categorie</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Datum</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >Bedrag</th
              >
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each recentExpenses as expense}
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {expense.description}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    {expense.category === 'Apparatuur'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : expense.category === 'Software'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : expense.category === 'Vervoer'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}"
                  >
                    {expense.category}
                  </span>
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {formatDate(expense.date)}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            {/each}
            {#if recentExpenses.length === 0}
              <tr>
                <td
                  colspan="4"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Geen recente uitgaven gevonden
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Two-column layout for recent data -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Factuur Status Overview -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
    >
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Factuurstatus
      </h3>
      <div class="space-y-3">
        <!-- Paid Invoices -->
        <div>
          <div class="flex justify-between text-sm mb-1">
            <div class="flex items-center">
              <span class="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              <span class="font-medium text-gray-700 dark:text-gray-300"
                >Betaald ({paidInvoices.length})</span
              >
            </div>
            <span class="text-gray-500 dark:text-gray-400"
              >{formatCurrency(paidValue)}</span
            >
          </div>
          <div
            class="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-green-500 rounded-full"
              style="width: {totalRevenue
                ? (paidValue / totalRevenue) * 100
                : 0}%"
            ></div>
          </div>
        </div>

        <!-- Pending Invoices -->
        <div>
          <div class="flex justify-between text-sm mb-1">
            <div class="flex items-center">
              <span class="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
              <span class="font-medium text-gray-700 dark:text-gray-300"
                >In afwachting ({pendingInvoices.length})</span
              >
            </div>
            <span class="text-gray-500 dark:text-gray-400"
              >{formatCurrency(pendingValue)}</span
            >
          </div>
          <div
            class="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-yellow-500 rounded-full"
              style="width: {totalRevenue
                ? (pendingValue / totalRevenue) * 100
                : 0}%"
            ></div>
          </div>
        </div>

        <!-- Overdue Invoices -->
        <div>
          <div class="flex justify-between text-sm mb-1">
            <div class="flex items-center">
              <span class="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              <span class="font-medium text-gray-700 dark:text-gray-300"
                >Te laat ({overdueInvoices.length})</span
              >
            </div>
            <span class="text-gray-500 dark:text-gray-400"
              >{formatCurrency(overdueValue)}</span
            >
          </div>
          <div
            class="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-red-500 rounded-full"
              style="width: {totalRevenue
                ? (overdueValue / totalRevenue) * 100
                : 0}%"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expense Categories -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
    >
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Uitgaven per categorie
      </h3>
      <div class="space-y-3">
        {#each sortedExpenseCategories as category}
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-gray-700 dark:text-gray-300"
                >{category.category}</span
              >
              <span class="text-gray-500 dark:text-gray-400"
                >{formatCurrency(category.amount)}</span
              >
            </div>
            <div
              class="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-purple-500 rounded-full"
                style="width: {totalExpenses
                  ? (category.amount / totalExpenses) * 100
                  : 0}%"
              ></div>
            </div>
          </div>
        {/each}
        {#if sortedExpenseCategories.length === 0}
          <div class="py-6 text-center text-gray-500 dark:text-gray-400">
            Geen uitgaven categorieën gevonden
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

