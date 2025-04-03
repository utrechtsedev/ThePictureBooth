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

  // Recent invoices
  $: recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Recent expenses
  $: recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Invoice statistics
  $: paidInvoices = invoices.filter((inv) => inv.status === "paid");
  $: pendingInvoices = invoices.filter((inv) => inv.status === "pending");
  $: overdueInvoices = invoices.filter((inv) => inv.status === "overdue");

  // Total values by status
  $: paidValue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  $: pendingValue = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  $: overdueValue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Expense categories
  $: expenseCategories = expenses.reduce((categories, expense) => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
    return categories;
  }, {});

  $: sortedExpenseCategories = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({ category, amount }));
</script>

<div class="space-y-6">
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
                  {invoice.customer.name}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {formatDate(invoice.date)}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {formatCurrency(invoice.amount)}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    {invoice.status === 'paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : invoice.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}"
                  >
                    {invoice.status === "paid"
                      ? "Betaald"
                      : invoice.status === "pending"
                        ? "In afwachting"
                        : "Te laat"}
                  </span>
                </td>
              </tr>
            {/each}
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
      </div>
    </div>
  </div>
</div>

