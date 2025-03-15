<script>
    import { onMount } from 'svelte';
    import { fade, slide, scale } from 'svelte/transition';
    
    // State management
    let isLoading = true;
    let financialData = {};
    let invoices = [];
    let filteredInvoices = [];
    let expenses = [];
    let selectedDateRange = 'year';
    let selectedTab = 'overview';
    let selectedInvoice = null;
    let showInvoiceDetails = false;
    let showCreateInvoice = false;
    let searchQuery = '';
    let invoiceFilter = 'all';
    
    // Chart data
    let revenueChartData = [];
    let profitChartData = [];
    let expensesByCategoryData = [];
    let revenueByServiceData = [];
    
    // Financial metrics
    let totalRevenue = 0;
    let totalExpenses = 0;
    let netProfit = 0;
    let averageBookingValue = 0;
    let outstandingInvoices = 0;
    let invoicesPaidOnTime = 0;
    
    // Date range options
    const dateRanges = [
      { id: 'month', label: 'Deze maand' },
      { id: 'quarter', label: 'Dit kwartaal' },
      { id: 'year', label: 'Dit jaar' },
      { id: 'all', label: 'Alles' }
    ];
    
    // Pagination state for invoices
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 1;
    
    // Initialize with mock data
    onMount(async () => {
      await loadFinancialData();
      isLoading = false;
    });
    
    async function loadFinancialData() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock financial metrics
      financialData = {
        totalRevenue: 28750,
        totalExpenses: 12350,
        netProfit: 16400,
        profitMargin: 57.04,
        averageBookingValue: 575,
        outstandingInvoices: 3210,
        invoicesPaidOnTime: 89
      };
      
      // Extract values for easier access
      totalRevenue = financialData.totalRevenue;
      totalExpenses = financialData.totalExpenses;
      netProfit = financialData.netProfit;
      averageBookingValue = financialData.averageBookingValue;
      outstandingInvoices = financialData.outstandingInvoices;
      invoicesPaidOnTime = financialData.invoicesPaidOnTime;
      
      // Mock chart data
      revenueChartData = [
        { month: 'Jan', revenue: 1050 },
        { month: 'Feb', revenue: 1850 },
        { month: 'Mar', revenue: 2100 },
        { month: 'Apr', revenue: 3200 },
        { month: 'Mei', revenue: 2800 },
        { month: 'Jun', revenue: 3600 },
        { month: 'Jul', revenue: 4150 },
        { month: 'Aug', revenue: 4500 },
        { month: 'Sep', revenue: 2650 },
        { month: 'Okt', revenue: 1850 },
        { month: 'Nov', revenue: 1500 },
        { month: 'Dec', revenue: 1500 }
      ];
      
      profitChartData = [
        { month: 'Jan', revenue: 1050, expenses: 480, profit: 570 },
        { month: 'Feb', revenue: 1850, expenses: 690, profit: 1160 },
        { month: 'Mar', revenue: 2100, expenses: 820, profit: 1280 },
        { month: 'Apr', revenue: 3200, expenses: 1250, profit: 1950 },
        { month: 'Mei', revenue: 2800, expenses: 1140, profit: 1660 },
        { month: 'Jun', revenue: 3600, expenses: 1450, profit: 2150 },
        { month: 'Jul', revenue: 4150, expenses: 1680, profit: 2470 },
        { month: 'Aug', revenue: 4500, expenses: 1780, profit: 2720 },
        { month: 'Sep', revenue: 2650, expenses: 1100, profit: 1550 },
        { month: 'Okt', revenue: 1850, expenses: 780, profit: 1070 },
        { month: 'Nov', revenue: 1500, expenses: 650, profit: 850 },
        { month: 'Dec', revenue: 1500, expenses: 650, profit: 850 }
      ];
      
      expensesByCategoryData = [
        { category: 'Apparatuur', value: 4850 },
        { category: 'Software', value: 950 },
        { category: 'Vervoer', value: 2450 },
        { category: 'Marketing', value: 1850 },
        { category: 'Props & Accessoires', value: 1250 },
        { category: 'Verzekering', value: 550 },
        { category: 'Overig', value: 450 }
      ];
      
      revenueByServiceData = [
        { service: 'Standard Booth', value: 14500 },
        { service: 'Premium Booth', value: 8500 },
        { service: 'Deluxe Booth', value: 3800 },
        { service: 'Extra uren', value: 1200 },
        { service: 'Accessoires', value: 750 }
      ];
      
      // Mock invoices data
      invoices = [
        {
          id: 'INV-2025-0001',
          customer: {
            name: 'Laura van den Berg',
            email: 'laura@example.com'
          },
          eventType: 'Bruiloft',
          date: '2025-04-15',
          amount: 595,
          status: 'paid',
          paidDate: '2025-03-10',
          dueDate: '2025-03-15'
        },
        {
          id: 'INV-2025-0002',
          customer: {
            name: 'Bedrijf XYZ',
            email: 'events@xyz.com'
          },
          eventType: 'Bedrijfsfeest',
          date: '2025-04-05',
          amount: 395,
          status: 'paid',
          paidDate: '2025-02-28',
          dueDate: '2025-03-05'
        },
        {
          id: 'INV-2025-0003',
          customer: {
            name: 'Mark Jansen',
            email: 'mark@example.com'
          },
          eventType: 'Verjaardag',
          date: '2025-03-22',
          amount: 450,
          status: 'pending',
          paidDate: null,
          dueDate: '2025-03-20'
        },
        {
          id: 'INV-2025-0004',
          customer: {
            name: 'Emma de Vries',
            email: 'emma@example.com'
          },
          eventType: 'Bruiloft',
          date: '2025-05-10',
          amount: 650,
          status: 'pending',
          paidDate: null,
          dueDate: '2025-04-10'
        },
        {
          id: 'INV-2025-0005',
          customer: {
            name: 'Sophie Bakker',
            email: 'sophie@example.com'
          },
          eventType: 'Afstuderen',
          date: '2025-06-28',
          amount: 375,
          status: 'overdue',
          paidDate: null,
          dueDate: '2025-03-01'
        },
        {
          id: 'INV-2025-0006',
          customer: {
            name: 'Dirk Visser',
            email: 'dirk@example.com'
          },
          eventType: 'Jubileum',
          date: '2025-03-30',
          amount: 525,
          status: 'paid',
          paidDate: '2025-02-15',
          dueDate: '2025-03-01'
        },
        {
          id: 'INV-2025-0007',
          customer: {
            name: 'Café De Kroon',
            email: 'info@dekroon.nl'
          },
          eventType: 'Themafeest',
          date: '2025-04-20',
          amount: 475,
          status: 'pending',
          paidDate: null,
          dueDate: '2025-04-05'
        }
      ];
      
      // Mock expenses data
      expenses = [
        {
          id: 'EXP-2025-0001',
          category: 'Apparatuur',
          description: 'Nieuwe camera',
          date: '2025-02-15',
          amount: 899,
          vendor: 'CameraShop'
        },
        {
          id: 'EXP-2025-0002',
          category: 'Software',
          description: 'Adobe licentie (jaarlijks)',
          date: '2025-01-10',
          amount: 359.88,
          vendor: 'Adobe'
        },
        {
          id: 'EXP-2025-0003',
          category: 'Vervoer',
          description: 'Benzine',
          date: '2025-02-28',
          amount: 85.50,
          vendor: 'Shell'
        },
        {
          id: 'EXP-2025-0004',
          category: 'Marketing',
          description: 'Facebook advertenties',
          date: '2025-03-05',
          amount: 150,
          vendor: 'Facebook'
        },
        {
          id: 'EXP-2025-0005',
          category: 'Props & Accessoires',
          description: 'Nieuwe props voor bruiloft thema',
          date: '2025-03-10',
          amount: 235.75,
          vendor: 'PartySupplies'
        }
      ];
      
      applyInvoiceFilters();
    }
    
    function applyInvoiceFilters() {
      let results = [...invoices];
      
      // Apply status filter
      if (invoiceFilter === 'paid') {
        results = results.filter(invoice => invoice.status === 'paid');
      } else if (invoiceFilter === 'pending') {
        results = results.filter(invoice => invoice.status === 'pending');
      } else if (invoiceFilter === 'overdue') {
        results = results.filter(invoice => invoice.status === 'overdue');
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(invoice => 
          invoice.customer.name.toLowerCase().includes(query) ||
          invoice.id.toLowerCase().includes(query) ||
          invoice.eventType.toLowerCase().includes(query)
        );
      }
      
      // Sort by date (newest first)
      results.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      
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
    
    function formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
    
    function formatCurrency(amount) {
      return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    }
    
    function getInvoiceStatusClass(status) {
      switch(status) {
        case 'paid':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'overdue':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function getInvoiceStatusLabel(status) {
      switch(status) {
        case 'paid': return 'Betaald';
        case 'pending': return 'In afwachting';
        case 'overdue': return 'Te laat';
        default: return status;
      }
    }
    
    function isOverdue(dueDate) {
      return new Date(dueDate) < new Date() && status !== 'paid';
    }
    
    // Chart helpers for visualization
    function getMaxValue(data, key) {
      return Math.max(...data.map(item => item[key])) * 1.1;
    }
    
    function getBarWidth(value, maxValue) {
      return `${(value / maxValue) * 100}%`;
    }
  </script>
  
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Financiën</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Beheer en analyseer je inkomsten en uitgaven</p>
      </div>
      
      <!-- Date Range Selector -->
      <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {#each dateRanges as range}
          <button 
            class="px-3 py-2 text-sm font-medium whitespace-nowrap
            {selectedDateRange === range.id 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
            on:click={() => selectedDateRange = range.id}
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
          on:click={() => selectedTab = 'overview'}
        >
          Overzicht
        </button>
        <button 
          class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
          {selectedTab === 'invoices' 
            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
          on:click={() => selectedTab = 'invoices'}
        >
          Facturen
        </button>
        <button 
          class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
          {selectedTab === 'expenses' 
            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
          on:click={() => selectedTab = 'expenses'}
        >
          Uitgaven
        </button>
        <button 
          class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
          {selectedTab === 'reports' 
            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
          on:click={() => selectedTab = 'reports'}
        >
          Rapporten
        </button>
      </nav>
    </div>
    
    {#if isLoading}
      <!-- Loading State -->
      <div class="flex justify-center items-center py-12">
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-l-transparent border-blue-600 animate-spin"></div>
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-r-transparent border-blue-400 animate-pulse absolute top-0 left-0" style="animation-duration: 1.5s;"></div>
        </div>
        <p class="ml-4 font-medium text-gray-500 dark:text-gray-400">Financiële gegevens laden...</p>
      </div>
    {:else}
      <!-- Tab Contents -->
      {#if selectedTab === 'overview'}
        <!-- Overview Tab -->
        <div in:fade={{duration: 200}}>
          <!-- Financial Metrics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <!-- Total Revenue Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Totale omzet</p>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</h3>
                  <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                    8.5% t.o.v. vorig jaar
                  </p>
                </div>
                <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8m.5-13h-1v5.41l4.71 2.8l.53-.91l-4.24-2.53z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Total Expenses Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Totale uitgaven</p>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalExpenses)}</h3>
                  <p class="text-sm text-red-600 dark:text-red-400 flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                    </svg>
                    4.2% t.o.v. vorig jaar
                  </p>
                </div>
                <div class="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8m1-12.5v5l3.15 1.85l-.75 1.3L12 14V7.5z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Net Profit Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nettowinst</p>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(netProfit)}</h3>
                  <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                    11.2% t.o.v. vorig jaar
                  </p>
                </div>
                <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8m-1.05-4.95l5.005-5.005l-1.414-1.414L10 13.172L7.91 11.086L6.5 12.5z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Profit Margin Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Winstmarge</p>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{financialData.profitMargin.toFixed(1)}%</h3>
                  <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                    2.3% t.o.v. vorig jaar
                  </p>
                </div>
                <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8m-1-13h2v7h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Secondary Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- Average Booking Value -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div class="flex items-center">
                <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 21c-.5 0-1-.2-1.4-.6S3 19.5 3 19V5c0-.5.2-1 .6-1.4S4.5 3 5 3h14c.5 0 1 .2 1.4.6S21 4.5 21 5v14c0 .5-.2 1-.6 1.4s-.9.6-1.4.6zm1-16v12h12V5zm10 9h-3v-1h3zm-5-1.5c-.4 0-.8-.1-1.1-.4s-.4-.7-.4-1.1.1-.8.4-1.1.7-.4 1.1-.4.8.1 1.1.4.4.7.4 1.1-.1.8-.4 1.1-.7.4-1.1.4"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Gem. boeking waarde</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(averageBookingValue)}</p>
                </div>
              </div>
            </div>
            
            <!-- Outstanding Invoices -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div class="flex items-center">
                <div class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m0 14H4v-6h16zm0-10H4V6h16z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Openstaande facturen</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(outstandingInvoices)}</p>
                </div>
              </div>
            </div>
            
            <!-- Invoices Paid On Time -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div class="flex items-center">
                <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Op tijd betaald</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{invoicesPaidOnTime}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Monthly Revenue Chart -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Maandelijkse omzet</h3>
              <div class="h-64">
                <!-- Simple bar chart visualization -->
                <div class="flex h-full items-end space-x-2">
                  {#each revenueChartData as item}
                    {@const maxValue = getMaxValue(revenueChartData, 'revenue')}
                    <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative" style="height: {(item.revenue / maxValue) * 100}%">
                        <div class="absolute inset-0 bg-blue-500 dark:bg-blue-400 opacity-30 rounded-t-sm"></div>
                        <div class="absolute bottom-0 left-0 right-0 bg-blue-500 dark:bg-blue-400 h-1"></div>
                        <div class="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {formatCurrency(item.revenue).replace('€', '')}
                        </div>
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.month}</div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
            
            <!-- Revenue vs Expenses -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Omzet vs. Uitgaven</h3>
              <div class="space-y-4">
                {#each profitChartData.slice(0, 6) as item}
                  {@const maxValue = Math.max(getMaxValue(profitChartData, 'revenue'), getMaxValue(profitChartData, 'expenses'))}
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="font-medium text-gray-700 dark:text-gray-300">{item.month}</span>
                      <span class="text-gray-500 dark:text-gray-400">{formatCurrency(item.revenue)} / {formatCurrency(item.expenses)}</span>
                    </div>
                    <div class="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500 dark:bg-blue-400 rounded-full" style="width: {getBarWidth(item.revenue, maxValue)}"></div>
                    </div>
                    <div class="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                      <div class="h-full bg-red-500 dark:bg-red-400 rounded-full" style="width: {getBarWidth(item.expenses, maxValue)}"></div>
                    </div>
                    <div class="flex justify-between text-xs mt-1">
                      <span class="text-blue-600 dark:text-blue-400">Omzet</span>
                      <span class="text-red-600 dark:text-red-400">Uitgaven</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
          
          <!-- Distribution Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Expenses by Category -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Uitgaven per categorie</h3>
              <div class="space-y-3">
                {#each expensesByCategoryData as item}
                  {@const maxValue = getMaxValue(expensesByCategoryData, 'value')}
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                      <span class="text-gray-500 dark:text-gray-400">{formatCurrency(item.value)}</span>
                    </div>
                    <div class="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-purple-500 dark:bg-purple-400 rounded-full" style="width: {getBarWidth(item.value, maxValue)}"></div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
            
            <!-- Revenue by Service -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Omzet per dienst</h3>
              <div class="space-y-3">
                {#each revenueByServiceData as item}
                  {@const maxValue = getMaxValue(revenueByServiceData, 'value')}
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="font-medium text-gray-700 dark:text-gray-300">{item.service}</span>
                      <span class="text-gray-500 dark:text-gray-400">{formatCurrency(item.value)}</span>
                    </div>
                    <div class="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-green-500 dark:bg-green-400 rounded-full" style="width: {getBarWidth(item.value, maxValue)}"></div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {:else if selectedTab === 'invoices'}
        <!-- Invoices Tab -->
        <div in:fade={{duration: 200}} class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Facturen</h2>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Invoice Filter -->
              <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button 
                  class="px-3 py-2 text-sm font-medium whitespace-nowrap
                  {invoiceFilter === 'all' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
                  on:click={() => { invoiceFilter = 'all'; applyInvoiceFilters(); }}
                >
                  Alle
                </button>
                <button 
                  class="px-3 py-2 text-sm font-medium whitespace-nowrap
                  {invoiceFilter === 'paid' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
                  on:click={() => { invoiceFilter = 'paid'; applyInvoiceFilters(); }}
                >
                  Betaald
                </button>
                <button 
                  class="px-3 py-2 text-sm font-medium whitespace-nowrap
                  {invoiceFilter === 'pending' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
                  on:click={() => { invoiceFilter = 'pending'; applyInvoiceFilters(); }}
                >
                  In afwachting
                </button>
                <button 
                  class="px-3 py-2 text-sm font-medium whitespace-nowrap
                  {invoiceFilter === 'overdue' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
                  on:click={() => { invoiceFilter = 'overdue'; applyInvoiceFilters(); }}
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"/>
                    </svg>
                  </div>
                </div>
                
                <button 
                  on:click={toggleCreateInvoice}
                  class="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
                  </svg>
                  Nieuwe Factuur
                </button>
              </div>
            </div>
          </div>
          
          <!-- Invoices List -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {#if filteredInvoices.length === 0}
              <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m0 14H4v-6h16zm0-10H4V6h16z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Geen facturen gevonden</h3>
                <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  Er zijn geen facturen die voldoen aan je zoekcriteria. Probeer andere filters of maak een nieuwe factuur.
                </p>
                <button 
                  on:click={toggleCreateInvoice}
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
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Factuurnr.</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Klant</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bedrag</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uiterste datum</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actie</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {#each getPaginatedInvoices() as invoice}
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                          {invoice.id}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{invoice.customer.name}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{invoice.customer.email}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900 dark:text-white">{invoice.eventType}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{formatDate(invoice.date)}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900 dark:text-white">{formatDate(invoice.dueDate)}</div>
                          {#if invoice.status === 'paid'}
                            <div class="text-sm text-gray-500 dark:text-gray-400">Betaald op {formatDate(invoice.paidDate)}</div>
                          {/if}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getInvoiceStatusClass(invoice.status)}">
                            {getInvoiceStatusLabel(invoice.status)}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            on:click={() => viewInvoiceDetails(invoice)}
                            class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            Details
                          </button>
                          <button class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                            Downloaden
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              {#if totalPages > 1}
                <div class="bg-gray-50 dark:bg-gray-900/30 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        Resultaten <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> tot <span class="font-medium">{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</span> van <span class="font-medium">{filteredInvoices.length}</span> facturen
                      </p>
                    </div>
                    <div>
                      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button 
                          on:click={() => currentPage = Math.max(1, currentPage - 1)}
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={currentPage === 1}
                        >
                          <span class="sr-only">Vorige</span>
                          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        {#each Array(Math.min(5, totalPages)) as _, index}
                          {@const pageNum = currentPage > 3 && totalPages > 5 
                            ? currentPage - 3 + index + (currentPage + 2 > totalPages ? totalPages - currentPage - 2 : 0) 
                            : index + 1}
                          {#if pageNum <= totalPages}
                            <button 
                              on:click={() => currentPage = pageNum}
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
                          on:click={() => currentPage = Math.min(totalPages, currentPage + 1)}
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={currentPage === totalPages}
                        >
                          <span class="sr-only">Volgende</span>
                          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
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
      {:else if selectedTab === 'expenses'}
        <!-- Expenses Tab -->
        <div in:fade={{duration: 200}} class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Uitgaven</h2>
            
            <div class="flex space-x-2">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Zoek uitgaven..."
                  class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div class="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"/>
                  </svg>
                </div>
              </div>
              
              <button class="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
                </svg>
                Nieuwe Uitgave
              </button>
            </div>
          </div>
          
          <!-- Expense Categories -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {#each expensesByCategoryData.slice(0, 3) as category}
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{category.category}</p>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(category.value)}</h3>
                  </div>
                  <div class="p-2 rounded-lg {
                    category.category === 'Apparatuur' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                    category.category === 'Software' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                    'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d={
                        category.category === 'Apparatuur' ? 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z' :
                        category.category === 'Software' ? 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z' :
                        'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'
                      } />
                    </svg>
                  </div>
                </div>
              </div>
            {/each}
          </div>
          
          <!-- Expenses List -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/30">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categorie</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Beschrijving</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Datum</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bedrag</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leverancier</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actie</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {#each expenses as expense}
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        {expense.id}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          {expense.category === 'Apparatuur' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                          expense.category === 'Software' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          expense.category === 'Vervoer' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          expense.category === 'Marketing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}"
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900 dark:text-white">{expense.description}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">{formatDate(expense.date)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">{expense.vendor}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          Bewerken
                        </button>
                        <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Verwijderen
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {:else if selectedTab === 'reports'}
        <!-- Reports Tab -->
        <div in:fade={{duration: 200}} class="space-y-6">
          <div class="mb-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Financiële rapporten</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <!-- Profit & Loss Report Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01L12.01 11z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Winst- en verliesrekening</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Een overzicht van inkomsten, uitgaven en nettowinst voor de geselecteerde periode.</p>
                    <div class="flex mt-3">
                      <button class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Bekijken
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                        </svg>
                      </button>
                      <button class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 ml-4">
                        Downloaden
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Revenue by Client Report Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Omzet per klant</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyse van inkomsten uitgesplitst per klant, inclusief frequentie en gemiddelde waarde.</p>
                    <div class="flex mt-3">
                      <button class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Bekijken
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                        </svg>
                      </button>
                      <button class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 ml-4">
                        Downloaden
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Expense Analysis Report Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM9.03 17.07L8 16.04 6.97 17.07 8 18.1l1.03-1.03zm-2.55-5.51l-1.3 1.3L6.21 14 8 12.21l-.69-.69-2.07-2.07L4 10.69l2.48 2.48zM18 17.07l-1.03-1.03-1.03 1.03 1.03 1.03L18 17.07zm-4.01-3.38l-2.31-2.31-1.03 1.03 2.31 2.31 1.03-1.03z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Uitgavenanalyse</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gedetailleerde uitsplitsing van uitgaven per categorie met trends en vergelijkingen.</p>
                    <div class="flex mt-3">
                      <button class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Bekijken
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                        </svg>
                      </button>
                      <button class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 ml-4">
                        Downloaden
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Monthly Comparison Report Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14zm-7-5h5v5h-5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Maandelijkse vergelijking</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Vergelijk financiële prestaties tussen maanden om groei en trends te identificeren.</p>
                    <div class="flex mt-3">
                      <button class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Bekijken
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                        </svg>
                      </button>
                      <button class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 ml-4">
                        Downloaden
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Tax Preparation Report Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6l9-4.91V17h2V9L12 3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Belastingvoorbereiding</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Overzichten van inkomsten, uitgaven en BTW voor belastingdoeleinden.</p>
                    <div class="flex mt-3">
                      <button class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Bekijken
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                        </svg>
                      </button>
                      <button class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 ml-4">
                        Downloaden
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Cash Flow Report Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Cashflow</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyse van geldstromen en liquiditeit over verschillende periodes.</p>
                    <div class="flex mt-3">
                      <button class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Bekijken
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                        </svg>
                      </button>
                      <button class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 ml-4">
                        Downloaden
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Custom Reports Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aangepast rapport genereren</h3>
            </div>
            <div class="p-5">
              <form class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="report-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type rapport</label>
                    <select
                      id="report-type"
                      class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Selecteer type rapport</option>
                      <option value="profit-loss">Winst- en verliesrekening</option>
                      <option value="revenue-client">Omzet per klant</option>
                      <option value="expenses">Uitgavenanalyse</option>
                      <option value="monthly">Maandelijkse vergelijking</option>
                      <option value="tax">Belastingvoorbereiding</option>
                      <option value="cashflow">Cashflow</option>
                    </select>
                  </div>
                  <div>
                    <label for="date-range" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periode</label>
                    <select
                      id="date-range"
                      class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="current-month">Huidige maand</option>
                      <option value="previous-month">Vorige maand</option>
                      <option value="current-quarter">Huidig kwartaal</option>
                      <option value="previous-quarter">Vorig kwartaal</option>
                      <option value="current-year">Huidig jaar</option>
                      <option value="previous-year">Vorig jaar</option>
                      <option value="custom">Aangepaste periode</option>
                    </select>
                  </div>
                  <div class="md:col-span-2" id="custom-date-range">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label for="start-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Startdatum</label>
                        <input
                          type="date"
                          id="start-date"
                          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label for="end-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Einddatum</label>
                        <input
                          type="date"
                          id="end-date"
                          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label for="format" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Formaat</label>
                    <select
                      id="format"
                      class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="additional-options" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aanvullende opties</label>
                    <div class="space-y-2">
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          id="include-charts"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label for="include-charts" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Grafieken opnemen</label>
                      </div>
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          id="show-comparison"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label for="show-comparison" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Vergelijking met vorige periode weergeven</label>
                      </div>
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          id="include-tax"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label for="include-tax" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">BTW-informatie opnemen</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    type="button" 
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Annuleren
                  </button>
                  <button 
                    type="submit" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Rapport genereren
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Scheduled Reports -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Geplande rapporten</h3>
              <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
                </svg>
                Nieuw gepland rapport
              </button>
            </div>
            <div class="p-5">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-900/30">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rapport</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frequentie</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Volgende verzending</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ontvangers</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actie</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">Maandelijks financieel overzicht</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">PDF-bestand met grafieken</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Maandelijks
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        1 april 2025
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        3 ontvangers
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          Bewerken
                        </button>
                        <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Verwijderen
                        </button>
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">Kwartaal BTW-overzicht</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Excel-bestand</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          Elk kwartaal
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        1 juli 2025
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        2 ontvangers
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          Bewerken
                        </button>
                        <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Verwijderen
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
  
  <!-- Invoice Details Modal -->
  {#if showInvoiceDetails}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
      on:click={closeInvoiceDetails}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'x' }}
        class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
        on:click|stopPropagation
      >
        {#if selectedInvoice}
          <div class="p-6 space-y-6">
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Factuurdetails</h2>
              <button 
                on:click={closeInvoiceDetails}
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex justify-between items-center">
              <div>
                <div class="text-sm text-blue-700 dark:text-blue-300 font-medium">Factuurnummer</div>
                <div class="text-xl text-blue-800 dark:text-blue-200 font-bold">{selectedInvoice.id}</div>
              </div>
              <span class="px-4 py-1.5 rounded-full text-sm font-semibold {getInvoiceStatusClass(selectedInvoice.status)}">
                {getInvoiceStatusLabel(selectedInvoice.status)}
              </span>
            </div>
            
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Klant</h3>
                  <p class="text-lg font-medium text-gray-900 dark:text-white mt-1">{selectedInvoice.customer.name}</p>
                  <p class="text-gray-600 dark:text-gray-300">{selectedInvoice.customer.email}</p>
                </div>
                <div class="text-right">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Evenement</h3>
                  <p class="text-lg font-medium text-gray-900 dark:text-white mt-1">{selectedInvoice.eventType}</p>
                  <p class="text-gray-600 dark:text-gray-300">{formatDate(selectedInvoice.date)}</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Factuurbedrag</h3>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(selectedInvoice.amount)}</p>
              </div>
              
              <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Datum verzonden</h3>
                <p class="text-gray-700 dark:text-gray-300">{formatDate(selectedInvoice.dueDate)}</p>
              </div>
              
              <div class="flex justify-between">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Uiterste betaaldatum</h3>
                <p class="text-gray-700 dark:text-gray-300">{formatDate(selectedInvoice.dueDate)}</p>
              </div>
              
              {#if selectedInvoice.status === 'paid'}
                <div class="flex justify-between">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Betaald op</h3>
                  <p class="text-green-600 dark:text-green-400">{formatDate(selectedInvoice.paidDate)}</p>
                </div>
              {:else}
                <div class="flex justify-between">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Dagen tot uiterste datum</h3>
                  <p class="{isOverdue(selectedInvoice.dueDate) ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}">
                    {Math.ceil((new Date(selectedInvoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} dagen
                  </p>
                </div>
              {/if}
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Factuurregels</h3>
              <div class="space-y-2">
                <div class="flex justify-between py-2">
                  <span class="text-gray-700 dark:text-gray-300">Foto Booth Package - {selectedInvoice.eventType}</span>
                  <span class="text-gray-900 dark:text-white font-medium">{formatCurrency(selectedInvoice.amount * 0.85)}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-gray-700 dark:text-gray-300">Extra uren (2)</span>
                  <span class="text-gray-900 dark:text-white font-medium">{formatCurrency(selectedInvoice.amount * 0.15)}</span>
                </div>
                <div class="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-gray-700 dark:text-gray-300 font-medium">Subtotaal</span>
                  <span class="text-gray-900 dark:text-white font-medium">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-gray-700 dark:text-gray-300">BTW (21%)</span>
                  <span class="text-gray-900 dark:text-white">{formatCurrency(selectedInvoice.amount * 0.21)}</span>
                </div>
                <div class="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                  <span class="text-gray-900 dark:text-white">Totaal</span>
                  <span class="text-gray-900 dark:text-white">{formatCurrency(selectedInvoice.amount * 1.21)}</span>
                </div>
              </div>
            </div>
            
            <div class="pt-4 flex justify-between">
              <button class="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Downloaden
              </button>
              <div>
                {#if selectedInvoice.status !== 'paid'}
                  <button class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg mr-2 hover:bg-blue-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"/>
                    </svg>
                    Als betaald markeren
                  </button>
                  <button class="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z"/>
                    </svg>
                    Herinneringsmail versturen
                  </button>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Create Invoice Modal -->
  {#if showCreateInvoice}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
      on:click={toggleCreateInvoice}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'y' }}
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
        on:click|stopPropagation
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nieuwe Factuur Aanmaken</h2>
          <button 
            on:click={toggleCreateInvoice}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Invoice Form -->
        <form class="space-y-6">
          <!-- Customer Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Klantgegevens</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="customer-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Klant selecteren</label>
                <select
                  id="customer-select"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecteer klant</option>
                  <option value="1">Laura van den Berg</option>
                  <option value="2">Bedrijf XYZ</option>
                  <option value="3">Mark Jansen</option>
                  <option value="4">Emma de Vries</option>
                </select>
              </div>
              <div>
                <label for="customer-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                <input
                  type="email"
                  id="customer-email"
                  placeholder="email@voorbeeld.nl"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Invoice Details -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Factuurgegevens</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="invoice-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Factuurnummer</label>
                <input
                  type="text"
                  id="invoice-number"
                  placeholder="INV-2025-0008"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="invoice-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Factuurdatum</label>
                <input
                  type="date"
                  id="invoice-date"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="due-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vervaldatum</label>
                <input
                  type="date"
                  id="due-date"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="event-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type evenement</label>
                <select
                  id="event-type"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecteer type</option>
                  <option value="Bruiloft">Bruiloft</option>
                  <option value="Bedrijfsfeest">Bedrijfsfeest</option>
                  <option value="Verjaardag">Verjaardag</option>
                  <option value="Jubileum">Jubileum</option>
                  <option value="Afstuderen">Afstuderen</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Invoice Items -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Factuurregels</h3>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/30">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Omschrijving</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aantal</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prijs</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Totaal</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Omschrijving"
                        class="w-full px-2 py-1 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white rounded"
                      />
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value="1"
                        class="w-16 px-2 py-1 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white rounded"
                      />
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-gray-500 dark:text-gray-400 mr-1">€</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-24 px-2 py-1 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white rounded"
                        />
                      </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      €0.00
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-right">
                      <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <button 
              type="button"
              class="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Regel toevoegen
            </button>
            
            <div class="mt-4 flex justify-end">
              <div class="w-64 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Subtotaal</span>
                  <span class="text-gray-900 dark:text-white">€0.00</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-700 dark:text-gray-300">BTW (21%)</span>
                  <span class="text-gray-900 dark:text-white">€0.00</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span class="font-bold text-gray-900 dark:text-white">Totaal</span>
                  <span class="font-bold text-gray-900 dark:text-white">€0.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Additional Options -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Aanvullende opties</h3>
            <div class="space-y-4">
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Factuurnotities</label>
                <textarea
                  id="notes"
                  rows="2"
                  placeholder="Notities voor op de factuur"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="send-email"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                />
                <label for="send-email" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Factuur direct per e-mail versturen
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button" 
              on:click={toggleCreateInvoice}
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuleren
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Factuur opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}