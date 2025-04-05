<!-- src/lib/components/dashboard/finances/SimpleReports.svelte -->
<script>
  import { onMount } from "svelte";

  export let financialData = {};
  export let invoices = [];
  export let expenses = [];
  export let formatCurrency;
  export let selectedDateRange = "year";

  // Chart data
  let revenueData = [];
  let profitData = [];
  let quarterlyData = [];
  let btw = { input: 0, output: 0, total: 0 };

  $: btwPercentage = 21;

  // Update calculations when data changes
  $: {
    calculateRevenueData();
    calculateQuarterlyData();
    calculateBTW();
  }

  onMount(() => {
    calculateRevenueData();
    calculateQuarterlyData();
    calculateBTW();
  });

  function calculateRevenueData() {
    // Create monthly revenue and profit data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    // Initialize array with all months
    revenueData = months.map((month) => ({
      month,
      revenue: 0,
      expenses: 0,
      profit: 0,
    }));

    // Add invoice amounts to revenue data
    invoices.forEach((invoice) => {
      const date = new Date(invoice.invoice_date);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        revenueData[monthIndex].revenue += parseFloat(invoice.amount);
      }
    });

    // Add expense amounts to expense data
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        revenueData[monthIndex].expenses += parseFloat(expense.amount);
      }
    });

    // Calculate profit
    revenueData.forEach((item) => {
      item.profit = item.revenue - item.expenses;
    });

    profitData = [...revenueData];
  }

  function calculateQuarterlyData() {
    // Initialize quarterly data
    quarterlyData = [
      { quarter: "Q1", revenue: 0, expenses: 0, profit: 0 },
      { quarter: "Q2", revenue: 0, expenses: 0, profit: 0 },
      { quarter: "Q3", revenue: 0, expenses: 0, profit: 0 },
      { quarter: "Q4", revenue: 0, expenses: 0, profit: 0 },
    ];

    // Aggregate monthly data into quarters
    revenueData.forEach((item, index) => {
      const quarterIndex = Math.floor(index / 3);
      quarterlyData[quarterIndex].revenue += item.revenue;
      quarterlyData[quarterIndex].expenses += item.expenses;
      quarterlyData[quarterIndex].profit += item.profit;
    });
  }

  function calculateBTW() {
    // Calculate BTW (VAT) based on invoices and expenses for the selected period
    const currentDate = new Date();
    let startDate = new Date();

    // Set start date based on selected range
    if (selectedDateRange === "month") {
      startDate.setMonth(currentDate.getMonth() - 1);
    } else if (selectedDateRange === "quarter") {
      startDate.setMonth(currentDate.getMonth() - 3);
    } else if (selectedDateRange === "year") {
      startDate.setFullYear(currentDate.getFullYear() - 1);
    } else {
      // 'all' - no filtering
      startDate = new Date(0); // epoch
    }

    // Filter invoices and expenses by date
    const periodInvoices = invoices.filter(
      (inv) => new Date(inv.invoice_date) >= startDate,
    );
    const periodExpenses = expenses.filter(
      (exp) => new Date(exp.date) >= startDate,
    );

    // Calculate BTW
    const totalRevenue = periodInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv.amount || 0),
      0,
    );
    const totalExpenses = periodExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount || 0),
      0,
    );

    // Assuming all amounts are excluding VAT and standard 21% rate
    btw.output = totalRevenue * (btwPercentage / 100);
    btw.input = totalExpenses * (btwPercentage / 100);
    btw.total = btw.output - btw.input;
  }

  function downloadReport(type) {
    // In a real application, this would generate and download a report
    alert(`Het ${type} rapport wordt gedownload.`);
  }

  function getBarWidth(value, maxValue) {
    if (maxValue === 0) return "0%";
    return `${(value / maxValue) * 100}%`;
  }

  function getMaxValue(data, key) {
    return Math.max(...data.map((item) => item[key] || 0));
  }
</script>

<div class="space-y-6">
  <!-- Report Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- BTW Report Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
    >
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            BTW Overzicht
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Voor de geselecteerde periode
          </p>

          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400"
                >BTW uit (verkoop)</span
              >
              <span class="text-gray-900 dark:text-white font-medium"
                >{formatCurrency(btw.output)}</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400"
                >BTW in (inkoop)</span
              >
              <span class="text-gray-900 dark:text-white font-medium"
                >{formatCurrency(btw.input)}</span
              >
            </div>
            <div
              class="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm font-medium"
            >
              <span class="text-gray-900 dark:text-white">Te betalen BTW</span>
              <span class="text-gray-900 dark:text-white"
                >{formatCurrency(btw.total)}</span
              >
            </div>
          </div>
        </div>

        <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-blue-600 dark:text-blue-400"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m0 14H4v-6h16zm0-10H4V6h16z"
            />
          </svg>
        </div>
      </div>

      <button
        on:click={() => downloadReport("BTW")}
        class="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
          />
        </svg>
        Downloaden
      </button>
    </div>

    <!-- Omzet Report Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
    >
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Omzetoverzicht
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Jaar tot op heden
          </p>

          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Totale omzet</span>
              <span class="text-gray-900 dark:text-white font-medium"
                >{formatCurrency(financialData.totalRevenue)}</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400"
                >Totale uitgaven</span
              >
              <span class="text-gray-900 dark:text-white font-medium"
                >{formatCurrency(financialData.totalExpenses)}</span
              >
            </div>
            <div
              class="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm font-medium"
            >
              <span class="text-gray-900 dark:text-white">Nettowinst</span>
              <span class="text-gray-900 dark:text-white"
                >{formatCurrency(financialData.netProfit)}</span
              >
            </div>
          </div>
        </div>

        <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-green-600 dark:text-green-400"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M16 6l2.29 2.29l-4.88 4.88l-4-4L2 16.59L3.41 18l6-6l4 4l6.3-6.29L22 12V6z"
            />
          </svg>
        </div>
      </div>

      <button
        on:click={() => downloadReport("Omzet")}
        class="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
          />
        </svg>
        Downloaden
      </button>
    </div>

    <!-- Winst per kwartaal Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
    >
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Winst per kwartaal
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Huidige jaar
          </p>

          <div class="mt-4 space-y-2">
            {#each quarterlyData as quarter}
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400"
                  >{quarter.quarter}</span
                >
                <span class="text-gray-900 dark:text-white font-medium"
                  >{formatCurrency(quarter.profit)}</span
                >
              </div>
            {/each}
          </div>
        </div>

        <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-purple-600 dark:text-purple-400"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14zm-7-5h5v5h-5z"
            />
          </svg>
        </div>
      </div>

      <button
        on:click={() => downloadReport("Kwartaal")}
        class="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
          />
        </svg>
        Downloaden
      </button>
    </div>
  </div>

  <!-- Revenue & Profit Chart -->
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
  >
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Omzet & Winst per maand
    </h3>

    <div class="space-y-4">
      {#each profitData.slice(0, 6) as item, index}
        {@const maxRevenue = getMaxValue(profitData, "revenue")}
        {@const maxExpenses = getMaxValue(profitData, "expenses")}
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium text-gray-700 dark:text-gray-300"
              >{item.month}</span
            >
            <span class="text-gray-500 dark:text-gray-400">
              {formatCurrency(item.revenue)} | {formatCurrency(item.profit)}
            </span>
          </div>
          <!-- Revenue bar -->
          <div
            class="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
              style="width: {getBarWidth(item.revenue, maxRevenue)}"
            ></div>
          </div>
          <!-- Profit bar -->
          <div
            class="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1"
          >
            <div
              class="h-full bg-green-500 dark:bg-green-400 rounded-full"
              style="width: {getBarWidth(item.profit, maxRevenue)}"
            ></div>
          </div>
          <div class="flex justify-between text-xs mt-1">
            <span class="text-blue-600 dark:text-blue-400">Omzet</span>
            <span class="text-green-600 dark:text-green-400">Winst</span>
          </div>
        </div>
      {/each}
    </div>

    <button
      on:click={() => downloadReport("Maandelijks")}
      class="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 mr-1"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
        />
      </svg>
      Volledige rapportage downloaden
    </button>
  </div>

  <!-- Jaaroverzicht voor belasting -->
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
  >
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Jaaroverzicht voor belastingaangifte
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Inkomsten
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300"
              >Totale omzet (excl. BTW)</span
            >
            <span class="text-gray-900 dark:text-white font-medium"
              >{formatCurrency(financialData.totalRevenue)}</span
            >
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300">Aantal facturen</span
            >
            <span class="text-gray-900 dark:text-white font-medium"
              >{invoices.length}</span
            >
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300"
              >Gemiddelde factuur</span
            >
            <span class="text-gray-900 dark:text-white font-medium"
              >{formatCurrency(financialData.averageBookingValue)}</span
            >
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Uitgaven
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300"
              >Totale kosten (excl. BTW)</span
            >
            <span class="text-gray-900 dark:text-white font-medium"
              >{formatCurrency(financialData.totalExpenses)}</span
            >
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300">Aantal uitgaven</span
            >
            <span class="text-gray-900 dark:text-white font-medium"
              >{expenses.length}</span
            >
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300"
              >Grootste kostenpost</span
            >
            <span class="text-gray-900 dark:text-white font-medium">
              {#if expenses.length > 0}
                {expenses.reduce(
                  (max, expense) => {
                    const category = expenses
                      .filter((e) => e.category === expense.category)
                      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
                    return category > max.amount
                      ? { category: expense.category, amount: category }
                      : max;
                  },
                  { category: "Onbekend", amount: 0 },
                ).category}
              {:else}
                Onbekend
              {/if}
            </span>
          </div>
        </div>
      </div>
    </div>

    <button
      on:click={() => downloadReport("Belastingaangifte")}
      class="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 mr-2"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
        />
      </svg>
      Jaaroverzicht downloaden
    </button>
  </div>
</div>

