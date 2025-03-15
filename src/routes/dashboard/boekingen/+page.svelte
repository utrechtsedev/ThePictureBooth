<script>
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    
    // State management
    let bookings = [];
    let filteredBookings = [];
    let isLoading = true;
    let selectedBooking = null;
    let showDetailsPanel = false;
    let showCreateForm = false;
    let selectedView = 'list'; // 'list' or 'calendar'
    let selectedFilter = 'all'; // 'all', 'upcoming', 'completed', 'cancelled'
    let searchQuery = '';
    let currentMonth = new Date();
    
    // Pagination state
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 1;
    
    // Initialize with mock data
    onMount(async () => {
      await loadBookings();
      isLoading = false;
    });
    
    async function loadBookings() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      bookings = [
        {
          id: 1,
          customer: {
            name: 'Laura van den Berg',
            email: 'laura@example.com',
            phone: '06-12345678'
          },
          eventType: 'Bruiloft',
          date: '2025-04-15',
          startTime: '16:00',
          endTime: '22:00',
          location: 'Landgoed Wolfslaar, Breda',
          package: 'Premium',
          price: 595,
          status: 'confirmed',
          notes: 'Speciale achtergrond gewenst voor de fotobooth.',
          paymentStatus: 'deposit_paid',
          created: '2025-02-10'
        },
        {
          id: 2,
          customer: {
            name: 'Bedrijf XYZ',
            email: 'events@xyz.com',
            phone: '06-87654321'
          },
          eventType: 'Bedrijfsfeest',
          date: '2025-04-05',
          startTime: '19:00',
          endTime: '23:00',
          location: 'Kantoor XYZ, Amsterdam',
          package: 'Basic',
          price: 395,
          status: 'confirmed',
          notes: 'Logo op de prints plaatsen',
          paymentStatus: 'paid',
          created: '2025-02-05'
        },
        {
          id: 3,
          customer: {
            name: 'Mark Jansen',
            email: 'mark@example.com',
            phone: '06-11223344'
          },
          eventType: 'Verjaardag',
          date: '2025-03-22',
          startTime: '20:00',
          endTime: '01:00',
          location: 'Café De Kroon, Utrecht',
          package: 'Standard',
          price: 450,
          status: 'pending',
          notes: '',
          paymentStatus: 'unpaid',
          created: '2025-02-15'
        },
        {
          id: 4,
          customer: {
            name: 'Emma de Vries',
            email: 'emma@example.com',
            phone: '06-99887766'
          },
          eventType: 'Bruiloft',
          date: '2025-05-10',
          startTime: '15:00',
          endTime: '23:00',
          location: 'Kasteel Maurick, Vught',
          package: 'Premium',
          price: 650,
          status: 'confirmed',
          notes: 'Gastenboek service toegevoegd',
          paymentStatus: 'deposit_paid',
          created: '2025-01-20'
        },
        {
          id: 5,
          customer: {
            name: 'Sophie Bakker',
            email: 'sophie@example.com',
            phone: '06-55443322'
          },
          eventType: 'Afstuderen',
          date: '2025-06-28',
          startTime: '17:00',
          endTime: '21:00',
          location: 'Thuis, Rotterdam',
          package: 'Basic',
          price: 375,
          status: 'confirmed',
          notes: '',
          paymentStatus: 'paid',
          created: '2025-02-28'
        }
      ];
      
      applyFilters();
    }
    
    function applyFilters() {
      let results = [...bookings];
      
      // Apply status filter
      if (selectedFilter === 'upcoming') {
        results = results.filter(booking => booking.status === 'confirmed' && new Date(booking.date) >= new Date());
      } else if (selectedFilter === 'completed') {
        results = results.filter(booking => booking.status === 'completed');
      } else if (selectedFilter === 'cancelled') {
        results = results.filter(booking => booking.status === 'cancelled');
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(booking => 
          booking.customer.name.toLowerCase().includes(query) ||
          booking.eventType.toLowerCase().includes(query) ||
          booking.location.toLowerCase().includes(query)
        );
      }
      
      // Sort by date
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      filteredBookings = results;
      totalPages = Math.ceil(results.length / itemsPerPage);
      
      // Reset to first page when filters change
      currentPage = 1;
    }
    
    function getPaginatedBookings() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredBookings.slice(start, end);
    }
    
    function viewBookingDetails(booking) {
      selectedBooking = booking;
      showDetailsPanel = true;
    }
    
    function closeDetails() {
      showDetailsPanel = false;
      setTimeout(() => {
        selectedBooking = null;
      }, 300);
    }
    
    function formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
    
    function getStatusClass(status) {
      switch(status) {
        case 'confirmed':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'cancelled':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'completed':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function getStatusLabel(status) {
      switch(status) {
        case 'confirmed': return 'Bevestigd';
        case 'pending': return 'In afwachting';
        case 'cancelled': return 'Geannuleerd';
        case 'completed': return 'Voltooid';
        default: return status;
      }
    }
    
    function getPaymentStatusLabel(status) {
      switch(status) {
        case 'paid': return 'Volledig betaald';
        case 'deposit_paid': return 'Aanbetaling';
        case 'unpaid': return 'Niet betaald';
        default: return status;
      }
    }
    
    function getPaymentStatusClass(status) {
      switch(status) {
        case 'paid':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'deposit_paid':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'unpaid':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function toggleCreateForm() {
      showCreateForm = !showCreateForm;
    }
  </script>
  
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Boekingen</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Bekijk en beheer al je foto booth reserveringen</p>
      </div>
      
      <button 
        on:click={toggleCreateForm}
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
        </svg>
        Nieuwe Boeking
      </button>
    </div>
    
    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- View Toggle -->
        <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button 
            class="px-4 py-2 text-sm font-medium flex items-center {selectedView === 'list' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
            on:click={() => selectedView = 'list'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
            </svg>
            Lijst
          </button>
          <button 
            class="px-4 py-2 text-sm font-medium flex items-center {selectedView === 'calendar' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
            on:click={() => selectedView = 'calendar'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 11h2v2H7v-2zm0 4h2v2H7v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
              <path fill="currentColor" d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"/>
            </svg>
            Kalender
          </button>
        </div>
        
        <!-- Status Filter -->
        <div class="flex space-x-2 overflow-x-auto pb-1 flex-wrap sm:flex-nowrap">
          <button 
            class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
            {selectedFilter === 'all' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
            on:click={() => { selectedFilter = 'all'; applyFilters(); }}
          >
            Alle boekingen
          </button>
          <button 
            class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
            {selectedFilter === 'upcoming' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
            on:click={() => { selectedFilter = 'upcoming'; applyFilters(); }}
          >
            Aankomend
          </button>
          <button 
            class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
            {selectedFilter === 'completed' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
            on:click={() => { selectedFilter = 'completed'; applyFilters(); }}
          >
            Voltooid
          </button>
          <button 
            class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
            {selectedFilter === 'cancelled' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
            on:click={() => { selectedFilter = 'cancelled'; applyFilters(); }}
          >
            Geannuleerd
          </button>
        </div>
        
        <!-- Search -->
        <div class="relative flex-grow max-w-md ml-auto">
          <input
            type="text"
            placeholder="Zoek op naam, type of locatie..."
            bind:value={searchQuery}
            on:input={applyFilters}
            class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <div class="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    {#if isLoading}
      <!-- Loading State -->
      <div class="flex justify-center items-center py-12">
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-l-transparent border-blue-600 animate-spin"></div>
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-r-transparent border-blue-400 animate-pulse absolute top-0 left-0" style="animation-duration: 1.5s;"></div>
        </div>
        <p class="ml-4 font-medium text-gray-500 dark:text-gray-400">Boekingen laden...</p>
      </div>
    {:else}
      {#if selectedView === 'list'}
        <!-- Bookings List View -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {#if filteredBookings.length === 0}
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1zm-2 14l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Geen boekingen gevonden</h3>
              <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Er zijn geen boekingen die voldoen aan je zoekcriteria. Probeer andere filters of maak een nieuwe boeking.
              </p>
              <button 
                on:click={toggleCreateForm}
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nieuwe boeking aanmaken
              </button>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/30">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Klant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Datum & Tijd</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prijs</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Betaling</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actie</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {#each getPaginatedBookings() as booking}
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium">
                            {booking.customer.name.split(' ').map(part => part[0]).join('')}
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{booking.customer.name}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{booking.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900 dark:text-white">{booking.eventType}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{booking.location}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">{formatDate(booking.date)}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{booking.startTime} - {booking.endTime}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusClass(booking.status)}">
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        €{booking.price.toFixed(2)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getPaymentStatusClass(booking.paymentStatus)}">
                          {getPaymentStatusLabel(booking.paymentStatus)}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          on:click={() => viewBookingDetails(booking)}
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        >
                          Details
                        </button>
                        <button class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          Bewerken
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
                      Resultaten <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> tot <span class="font-medium">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> van <span class="font-medium">{filteredBookings.length}</span> boekingen
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
                      {#each Array(totalPages) as _, index}
                        <button 
                          on:click={() => currentPage = index + 1}
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium
                          {currentPage === index + 1 
                            ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400' 
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
                        >
                          {index + 1}
                        </button>
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
      {:else}
        <!-- Calendar View -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(currentMonth)}
              </h2>
            </div>
            <div class="flex space-x-2">
              <button 
                on:click={() => {
                  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
                }}
                class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                on:click={() => {
                  currentMonth = new Date();
                }}
                class="p-1.5 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
              >
                Vandaag
              </button>
              <button 
                on:click={() => {
                  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
                }}
                class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
            {#each ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'] as day}
              <div class="bg-gray-50 dark:bg-gray-800 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            {/each}
          </div>
          
          <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            <!-- Calendar dates would go here - simplified for demo purposes -->
            {#each Array(35) as _, index}
              {@const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index - new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 1)}
              {@const isCurrentMonth = date.getMonth() === currentMonth.getMonth()}
              {@const isToday = new Date().toDateString() === date.toDateString()}
              {@const bookingsOnDay = filteredBookings.filter(b => new Date(b.date).toDateString() === date.toDateString())}
              
              <div class={`min-h-[100px] p-2 ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
                <div class={`text-right ${isToday ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 h-6 w-6 rounded-full flex items-center justify-center ml-auto' : ''} ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                  {date.getDate()}
                </div>
                
                <div class="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                  {#each bookingsOnDay as booking}
                    <div 
                      on:click={() => viewBookingDetails(booking)}
                      class="px-2 py-1 text-xs rounded-md truncate cursor-pointer
                      {booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}"
                    >
                      {booking.startTime} - {booking.eventType}
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  </div>
  
  <!-- Booking Details Panel -->
  {#if showDetailsPanel}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
      on:click={closeDetails}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'x' }}
        class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
        on:click|stopPropagation
      >
        {#if selectedBooking}
          <div class="p-6 space-y-6">
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Boeking Details</h2>
              <button 
                on:click={closeDetails}
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xl font-medium">
                {selectedBooking.customer.name.split(' ').map(part => part[0]).join('')}
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{selectedBooking.customer.name}</h3>
                <div class="text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                  <div class="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/>
                    </svg>
                    {selectedBooking.customer.email}
                  </div>
                  <div class="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                    </svg>
                    {selectedBooking.customer.phone}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Evenement</h4>
                  <p class="text-gray-900 dark:text-white">{selectedBooking.eventType}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Datum</h4>
                  <p class="text-gray-900 dark:text-white">{formatDate(selectedBooking.date)}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tijdstip</h4>
                  <p class="text-gray-900 dark:text-white">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pakket</h4>
                  <p class="text-gray-900 dark:text-white">{selectedBooking.package}</p>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Locatie</h4>
                <p class="text-gray-900 dark:text-white">{selectedBooking.location}</p>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h4>
                <div class="flex items-center">
                  <span class="px-2.5 py-0.5 rounded-full text-sm font-medium {getStatusClass(selectedBooking.status)}">
                    {getStatusLabel(selectedBooking.status)}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Betaling</h4>
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full text-sm font-medium {getPaymentStatusClass(selectedBooking.paymentStatus)}">
                    {getPaymentStatusLabel(selectedBooking.paymentStatus)}
                  </span>
                  <span class="text-gray-900 dark:text-white font-medium">€{selectedBooking.price.toFixed(2)}</span>
                </div>
              </div>
              
              {#if selectedBooking.notes}
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notities</h4>
                  <p class="text-gray-900 dark:text-white">{selectedBooking.notes}</p>
                </div>
              {/if}
            </div>
            
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Factureren
              </button>
              <div>
                <button class="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg mr-2 hover:bg-red-100 dark:hover:bg-red-900/30">
                  Annuleren
                </button>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Bewerken
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- New Booking Form Modal -->
  {#if showCreateForm}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
      on:click={toggleCreateForm}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'y' }}
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
        on:click|stopPropagation
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nieuwe Boeking Toevoegen</h2>
          <button 
            on:click={toggleCreateForm}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Booking Form -->
        <form class="space-y-6">
          <!-- Customer Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Klantgegevens</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="customer-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naam</label>
                <input
                  type="text"
                  id="customer-name"
                  placeholder="Volledige naam"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
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
              <div>
                <label for="customer-phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefoon</label>
                <input
                  type="tel"
                  id="customer-phone"
                  placeholder="06-12345678"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Event Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Evenement Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="event-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type Evenement</label>
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
                  <option value="Anders">Anders</option>
                </select>
              </div>
              <div>
                <label for="event-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Datum</label>
                <input
                  type="date"
                  id="event-date"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="start-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starttijd</label>
                <input
                  type="time"
                  id="start-time"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="end-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eindtijd</label>
                <input
                  type="time"
                  id="end-time"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="md:col-span-2">
                <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Locatie</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Adres of naam locatie"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Package & Payment -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Pakket & Betaling</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="package" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pakket</label>
                <select
                  id="package"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecteer pakket</option>
                  <option value="Basic">Basic (€395)</option>
                  <option value="Standard">Standard (€495)</option>
                  <option value="Premium">Premium (€595)</option>
                  <option value="Deluxe">Deluxe (€695)</option>
                </select>
              </div>
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prijs (€)</label>
                <input
                  type="number"
                  id="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="payment-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Betalingsstatus</label>
                <select
                  id="payment-status"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="unpaid">Niet betaald</option>
                  <option value="deposit_paid">Aanbetaling</option>
                  <option value="paid">Volledig betaald</option>
                </select>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  id="status"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">In afwachting</option>
                  <option value="confirmed">Bevestigd</option>
                  <option value="cancelled">Geannuleerd</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notities</label>
            <textarea
              id="notes"
              rows="3"
              placeholder="Eventuele opmerkingen of speciale wensen"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button" 
              on:click={toggleCreateForm}
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuleren
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Boeking Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}