<!-- src/routes/dashboard/financien/+page.svelte -->
<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import FinanceOverview from "$lib/components/dashboard/finances/FinanceOverview.svelte";
  import InvoicesList from "$lib/components/dashboard/finances/InvoicesList.svelte";
  import SimpleReports from "$lib/components/dashboard/finances/SimpleReports.svelte";
  import InvoiceDetails from "$lib/components/dashboard/finances/InvoiceDetails.svelte";
  import CreateInvoice from "$lib/components/dashboard/finances/CreateInvoice.svelte";
  import ExpensesList from "../../../lib/components/dashboard/finances/ExpensesList.svelte";
  import CreateExpense from "$lib/components/dashboard/finances/CreateExpense.svelte";
  import ExpenseDetails from "../../../lib/components/dashboard/finances/ExpensesDetails.svelte";
  export let data;
  console.log(data);

  // State management
  let isLoading = true;
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

  // Date range options
  const dateRanges = [
    { id: "month", label: "Deze maand" },
    { id: "quarter", label: "Dit kwartaal" },
    { id: "year", label: "Dit jaar" },
    { id: "all", label: "Alles" },
  ];

  // Initialize with mock data
  onMount(async () => {
    await loadFinancialData();
    isLoading = false;
  });

  async function loadFinancialData() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock financial metrics
    financialData = {
      totalRevenue: 28750,
      totalExpenses: 12350,
      netProfit: 16400,
      profitMargin: 57.04,
      averageBookingValue: 575,
      outstandingInvoices: 3210,
      invoicesPaidOnTime: 89,
    };

    // Mock invoices data
    invoices = [
      {
        id: "INV-2025-0001",
        customer: {
          name: "Laura van den Berg",
          email: "laura@example.com",
        },
        eventType: "Bruiloft",
        date: "2025-04-15",
        amount: 595,
        status: "paid",
        paidDate: "2025-03-10",
        dueDate: "2025-03-15",
      },
      {
        id: "INV-2025-0002",
        customer: {
          name: "Bedrijf XYZ",
          email: "events@xyz.com",
        },
        eventType: "Bedrijfsfeest",
        date: "2025-04-05",
        amount: 395,
        status: "paid",
        paidDate: "2025-02-28",
        dueDate: "2025-03-05",
      },
      {
        id: "INV-2025-0003",
        customer: {
          name: "Mark Jansen",
          email: "mark@example.com",
        },
        eventType: "Verjaardag",
        date: "2025-03-22",
        amount: 450,
        status: "pending",
        paidDate: null,
        dueDate: "2025-03-20",
      },
      {
        id: "INV-2025-0004",
        customer: {
          name: "Emma de Vries",
          email: "emma@example.com",
        },
        eventType: "Bruiloft",
        date: "2025-05-10",
        amount: 650,
        status: "pending",
        paidDate: null,
        dueDate: "2025-04-10",
      },
      {
        id: "INV-2025-0005",
        customer: {
          name: "Sophie Bakker",
          email: "sophie@example.com",
        },
        eventType: "Afstuderen",
        date: "2025-06-28",
        amount: 375,
        status: "overdue",
        paidDate: null,
        dueDate: "2025-03-01",
      },
      {
        id: "INV-2025-0006",
        customer: {
          name: "Dirk Visser",
          email: "dirk@example.com",
        },
        eventType: "Jubileum",
        date: "2025-03-30",
        amount: 525,
        status: "paid",
        paidDate: "2025-02-15",
        dueDate: "2025-03-01",
      },
      {
        id: "INV-2025-0007",
        customer: {
          name: "Café De Kroon",
          email: "info@dekroon.nl",
        },
        eventType: "Themafeest",
        date: "2025-04-20",
        amount: 475,
        status: "pending",
        paidDate: null,
        dueDate: "2025-04-05",
      },
    ];

    filteredInvoices = [...invoices];

    // Mock expenses data
    expenses = [
      {
        id: "EXP-2025-0001",
        category: "Apparatuur",
        description: "Nieuwe camera",
        date: "2025-02-15",
        amount: 899,
        vendor: "CameraShop",
        notes: "Nodig voor high-res fotografie bij grote evenementen",
        receiptUrl: "receipts/camera_receipt.pdf",
        paymentMethod: "Creditcard",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0002",
        category: "Software",
        description: "Adobe licentie (jaarlijks)",
        date: "2025-01-10",
        amount: 359.88,
        vendor: "Adobe",
        notes: "Creative Cloud jaarabonnement",
        receiptUrl: "receipts/adobe_invoice.pdf",
        paymentMethod: "Automatische incasso",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0003",
        category: "Vervoer",
        description: "Benzine",
        date: "2025-02-28",
        amount: 85.5,
        vendor: "Shell",
        notes: "Zakelijke kilometers naar evenement in Rotterdam",
        receiptUrl: "receipts/shell_receipt.jpg",
        paymentMethod: "Pinpas",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0004",
        category: "Marketing",
        description: "Facebook advertenties",
        date: "2025-03-05",
        amount: 150,
        vendor: "Facebook",
        notes: "Campagne voor bruiloftseizoen",
        receiptUrl: "receipts/facebook_invoice.pdf",
        paymentMethod: "Creditcard",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0005",
        category: "Props & Accessoires",
        description: "Nieuwe props voor bruiloft thema",
        date: "2025-03-10",
        amount: 235.75,
        vendor: "PartySupplies",
        notes: "Nieuwe set bruiloft-gerelateerde accessoires",
        receiptUrl: "receipts/party_supplies.pdf",
        paymentMethod: "Pinpas",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0006",
        category: "Onderhoud",
        description: "Reparatie printer",
        date: "2025-03-15",
        amount: 120,
        vendor: "PrintFix",
        notes: "Reparatie van fotoprinter die niet meer werkte",
        receiptUrl: "receipts/printer_repair.pdf",
        paymentMethod: "Pinpas",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0007",
        category: "Abonnementen",
        description: "Cloud Opslag",
        date: "2025-03-20",
        amount: 29.99,
        vendor: "Dropbox",
        notes: "Maandelijks opslagplan voor foto's",
        receiptUrl: "receipts/dropbox_invoice.pdf",
        paymentMethod: "Automatische incasso",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0008",
        category: "Apparatuur",
        description: "Vervangende lenzen",
        date: "2025-03-25",
        amount: 450,
        vendor: "CameraStore",
        notes: "Nieuwe lenzen voor portretfotografie",
        receiptUrl: "receipts/lenses_receipt.pdf",
        paymentMethod: "Creditcard",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0009",
        category: "Kantoorartikelen",
        description: "Printerpapier en inkt",
        date: "2025-04-01",
        amount: 85.25,
        vendor: "Office Supplies",
        notes: "Voorraad aanvulling voor kantoor",
        receiptUrl: "receipts/office_supplies.pdf",
        paymentMethod: "Pinpas",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0010",
        category: "Verzekering",
        description: "Apparatuurverzekering",
        date: "2025-04-05",
        amount: 275,
        vendor: "InsureCorp",
        notes: "Verzekering voor camera's en accessoires",
        receiptUrl: "receipts/insurance_policy.pdf",
        paymentMethod: "Automatische incasso",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0011",
        category: "Training",
        description: "Online cursus beeldbewerking",
        date: "2025-04-10",
        amount: 199.99,
        vendor: "SkillShare",
        notes: "Cursus voor geavanceerde fotobewerkingstechnieken",
        receiptUrl: "receipts/skillshare_invoice.pdf",
        paymentMethod: "Creditcard",
        taxDeductible: true,
      },
      {
        id: "EXP-2025-0012",
        category: "Telefoon",
        description: "Zakelijk abonnement",
        date: "2025-04-15",
        amount: 45.5,
        vendor: "TelCorp",
        notes: "Maandelijks telefoonabonnement",
        receiptUrl: "receipts/phone_bill.pdf",
        paymentMethod: "Automatische incasso",
        taxDeductible: true,
      },
    ];

    filteredExpenses = [...expenses];
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

  function closeExpenseDetails() {
    showExpenseDetails = false;
    setTimeout(() => {
      selectedExpense = null;
    }, 300);
  }

  function toggleCreateExpense() {
    showCreateExpense = !showCreateExpense;
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
    <div
      class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {#each dateRanges as range}
        <button
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {selectedDateRange === range.id
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => (selectedDateRange = range.id)}
        >
          {range.label}
        </button>
      {/each}
    </div>
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
      on:click={toggleCreateExpense}
    >
      <CreateExpense on:close={toggleCreateExpense} {formatCurrency} />
    </div>
  {/if}

  <!-- Floating Add Expense Button -->
  <button
    on:click={toggleCreateExpense}
    class="fixed right-8 bottom-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-colors z-30"
    title="Nieuwe uitgave toevoegen"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  </button>
</div>
