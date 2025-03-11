<script>
    import { onMount } from 'svelte';
    import { fade, slide, scale } from 'svelte/transition';
    
    // State management
    let isLoading = true;
    let currentDate = new Date();
    let selectedPeriod = 'month';
    let showWelcomeModal = false;
    
    // Dashboard data
    let dashboardData = {
      metrics: {
        totalRevenue: 0,
        totalBookings: 0,
        pendingBookings: 0,
        newCustomers: 0,
        averageRating: 0
      },
      revenueChart: [],
      upcomingEvents: [],
      recentActivity: [],
      tasks: [],
      notifications: []
    };
    
    // Initialize with mock data
    onMount(async () => {
      await loadDashboardData();
      
      // Check if first login of the day to show welcome message
      const lastLogin = localStorage.getItem('lastLogin');
      const today = new Date().toDateString();
      if (!lastLogin || lastLogin !== today) {
        localStorage.setItem('lastLogin', today);
        showWelcomeModal = true;
        setTimeout(() => {
          showWelcomeModal = false;
        }, 5000);
      }
      
      isLoading = false;
    });
    
    async function loadDashboardData() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock dashboard data
      dashboardData = {
        metrics: {
          totalRevenue: 28750,
          totalBookings: 42,
          pendingBookings: 8,
          newCustomers: 14,
          averageRating: 4.8
        },
        revenueChart: [
          { date: '1 Mar', revenue: 850 },
          { date: '8 Mar', revenue: 1200 },
          { date: '15 Mar', revenue: 950 },
          { date: '22 Mar', revenue: 1500 },
          { date: '29 Mar', revenue: 1750 },
          { date: '5 Apr', revenue: 1650 },
          { date: '12 Apr', revenue: 1250 }
        ],
        upcomingEvents: [
          {
            id: 1,
            title: 'Bruiloft Laura & Pieter',
            date: '2025-04-15',
            time: '16:00 - 22:00',
            location: 'Landgoed Wolfslaar, Breda',
            customer: 'Laura van den Berg',
            status: 'confirmed',
            package: 'Premium'
          },
          {
            id: 2,
            title: 'Bedrijfsfeest XYZ',
            date: '2025-04-05',
            time: '19:00 - 23:00',
            location: 'Kantoor XYZ, Amsterdam',
            customer: 'Bedrijf XYZ',
            status: 'confirmed',
            package: 'Basic'
          },
          {
            id: 3,
            title: 'Verjaardag Mark',
            date: '2025-03-22',
            time: '20:00 - 01:00',
            location: 'Café De Kroon, Utrecht',
            customer: 'Mark Jansen',
            status: 'pending',
            package: 'Standard'
          },
          {
            id: 4,
            title: 'Themafeest De Kroon',
            date: '2025-04-20',
            time: '21:00 - 02:00',
            location: 'Café De Kroon, Utrecht',
            customer: 'Café De Kroon',
            status: 'pending',
            package: 'Standard'
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'booking',
            title: 'Nieuwe boeking',
            description: 'Bruiloft Laura & Pieter is bevestigd',
            time: '2 uur geleden',
            icon: 'calendar'
          },
          {
            id: 2,
            type: 'payment',
            title: 'Betaling ontvangen',
            description: '€395 van Bedrijf XYZ',
            time: '5 uur geleden',
            icon: 'payment'
          },
          {
            id: 3,
            type: 'customer',
            title: 'Nieuwe klant',
            description: 'Mark Jansen heeft zich aangemeld',
            time: '1 dag geleden',
            icon: 'person'
          },
          {
            id: 4,
            type: 'review',
            title: 'Nieuwe recensie',
            description: '5-sterren recensie van Emma de Vries',
            time: '2 dagen geleden',
            icon: 'star'
          }
        ],
        tasks: [
          {
            id: 1,
            title: 'Bevestig boeking Verjaardag Mark',
            priority: 'high',
            dueDate: '2025-03-18',
            completed: false
          },
          {
            id: 2,
            title: 'Stuur factuur naar Café De Kroon',
            priority: 'medium',
            dueDate: '2025-03-20',
            completed: false
          },
          {
            id: 3,
            title: 'Bereid apparatuur voor - Bruiloft Laura',
            priority: 'low',
            dueDate: '2025-04-14',
            completed: false
          },
          {
            id: 4,
            title: 'Bestel nieuwe props voor themapakket',
            priority: 'medium',
            dueDate: '2025-03-28',
            completed: true
          }
        ],
        notifications: [
          {
            id: 1,
            title: 'Nieuwe boeking',
            message: 'Je hebt een nieuwe boeking voor 15 april',
            type: 'info',
            read: false,
            time: '2 uur geleden'
          },
          {
            id: 2,
            title: 'Boeking moet bevestigd worden',
            message: 'Verjaardag Mark wacht op bevestiging',
            type: 'warning',
            read: false,
            time: '1 dag geleden'
          },
          {
            id: 3,
            title: 'Betaling ontvangen',
            message: 'Betaling van €395 is ontvangen',
            type: 'success',
            read: true,
            time: '5 uur geleden'
          }
        ]
      };
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
    
    function getStatusClass(status) {
      switch(status) {
        case 'confirmed':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'cancelled':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function getStatusLabel(status) {
      switch(status) {
        case 'confirmed': return 'Bevestigd';
        case 'pending': return 'In afwachting';
        case 'cancelled': return 'Geannuleerd';
        default: return status;
      }
    }
    
    function getIconForActivityType(type) {
      switch(type) {
        case 'booking':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z" /><path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd" /></svg>';
        case 'payment':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z" /></svg>';
        case 'customer':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>';
        case 'review':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" /></svg>';
        default:
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M19 20H5V9h14m-3-7v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V2m-7 11h5v5h-5v-5z" /></svg>';
      }
    }
    
    function getNotificationTypeClass(type) {
      switch(type) {
        case 'info':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'success':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'error':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function getPriorityClass(priority) {
      switch(priority) {
        case 'high':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'low':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function getPriorityLabel(priority) {
      switch(priority) {
        case 'high': return 'Hoog';
        case 'medium': return 'Middel';
        case 'low': return 'Laag';
        default: return priority;
      }
    }
    
    function toggleTaskComplete(id) {
      dashboardData.tasks = dashboardData.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
    }
    
    function markNotificationAsRead(id) {
      dashboardData.notifications = dashboardData.notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
    }
    
    function getMaxRevenueValue() {
      return Math.max(...dashboardData.revenueChart.map(item => item.revenue)) * 1.1;
    }
    
    function getPercentage(value, max) {
      return (value / max) * 100;
    }
  </script>
  
  <div class="space-y-6">
    <!-- Welcome Message Modal -->
    {#if showWelcomeModal}
      <div 
        transition:fade={{duration: 400}}
        class="fixed inset-x-0 top-6 z-50 flex justify-center px-4"
      >
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl shadow-lg max-w-lg">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2.55 13.74c-.71.47-1.84 1.26-3.67 1.26c-1.36 0-2.33-.29-2.97-.74l.24-1.2c.63.44 1.5.73 2.73.73c1.38 0 2.14-.53 2.14-1.35c0-.79-.65-1.33-2.19-1.86c-2.09-.71-3.13-1.82-3.13-3.38C10.6 7.37 12 6 14.4 6c1.1 0 1.99.19 2.58.56l-.33 1.23c-.38-.22-1.08-.48-2.24-.48c-1.31 0-1.91.55-1.91 1.19c0 .75.67 1.17 2.38 1.77c2.04.74 2.97 1.76 2.97 3.56c0 1.62-1.22 2.86-3.4 2.91zM9.5 9H8V5h1.5zm-2 6H6V5h1.5zm-5-3h2v1.5H4.5zm0-3h2v1.5H4.5zm0 6h2v1.5H4.5z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-xl font-bold">Welkom terug!</h3>
              <p class="mt-1">Je hebt 2 openstaande boekingen die bevestiging nodig hebben. Vandaag staan er 3 taken gepland.</p>
            </div>
            <button 
              class="flex-shrink-0 ml-2"
              on:click={() => showWelcomeModal = false}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Overzicht van je fotobooth business</p>
      </div>
      
      <!-- Period Selector -->
      <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button 
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {selectedPeriod === 'week' 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => selectedPeriod = 'week'}
        >
          Week
        </button>
        <button 
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {selectedPeriod === 'month' 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => selectedPeriod = 'month'}
        >
          Maand
        </button>
        <button 
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {selectedPeriod === 'quarter' 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => selectedPeriod = 'quarter'}
        >
          Kwartaal
        </button>
        <button 
          class="px-3 py-2 text-sm font-medium whitespace-nowrap
          {selectedPeriod === 'year' 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          on:click={() => selectedPeriod = 'year'}
        >
          Jaar
        </button>
      </div>
    </div>
    
    {#if isLoading}
      <!-- Loading State -->
      <div class="flex justify-center items-center py-12">
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-l-transparent border-blue-600 animate-spin"></div>
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-r-transparent border-blue-400 animate-pulse absolute top-0 left-0" style="animation-duration: 1.5s;"></div>
        </div>
        <p class="ml-4 font-medium text-gray-500 dark:text-gray-400">Dashboard laden...</p>
      </div>
    {:else}
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Revenue Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Omzet</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(dashboardData.metrics.totalRevenue)}</h3>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                </svg>
                8.5% t.o.v. vorige periode
              </p>
            </div>
            <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Total Bookings Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Totaal boekingen</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{dashboardData.metrics.totalBookings}</h3>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                </svg>
                12% t.o.v. vorige periode
              </p>
            </div>
            <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Pending Bookings Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Te bevestigen</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{dashboardData.metrics.pendingBookings}</h3>
              <p class="text-sm text-yellow-600 dark:text-yellow-400 flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Actie vereist
              </p>
            </div>
            <div class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24">
                <path fill="currentColor" d="M13 2.03v2.02c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97m-2 .03c-1.95.19-3.81.94-5.33 2.2L7.1 5.74c1.12-.9 2.47-1.48 3.9-1.68v-2M4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9L4.26 5.67M2.06 13c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13h-2m5.04 5.37l-1.43 1.37A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63M12.5 7v5.25l4.5 2.67l-.75 1.23L11 13V7h1.5z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- New Customers Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nieuwe klanten</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{dashboardData.metrics.newCustomers}</h3>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                </svg>
                3 meer dan vorige periode
              </p>
            </div>
            <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Average Rating Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Gem. beoordeling</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{dashboardData.metrics.averageRating}</h3>
              <div class="flex items-center mt-2">
                {#each Array(5) as _, i}
                  <svg class="w-4 h-4 {i < Math.floor(dashboardData.metrics.averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                {/each}
              </div>
            </div>
            <div class="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-600 dark:text-pink-400" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="space-y-6 lg:col-span-2">
          <!-- Revenue Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Omzet Trend</h3>
              <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                Details bekijken
              </button>
            </div>
            
            <div class="h-64">
              <!-- Simple line chart visualization -->
              <div class="flex items-end h-full space-x-2">
                {#each dashboardData.revenueChart as item, i}
                  {@const max = getMaxRevenueValue()}
                  <div class="flex-1 flex flex-col justify-end h-full">
                    <div class="bg-blue-500 dark:bg-blue-400 rounded-t-sm relative" style="height: {getPercentage(item.revenue, max)}%">
                      <div class="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                    <div class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">{item.date}</div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
          
          <!-- Upcoming Events -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aankomende Evenementen</h3>
              <a href="/dashboard/boekingen" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                Alle bekijken
              </a>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              {#each dashboardData.upcomingEvents as event}
                <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <div class="flex justify-between">
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                      <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                          <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
                        </svg>
                        {formatDate(event.date)} · {event.time}
                      </div>
                      <div class="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"/>
                        </svg>
                        {event.location}
                      </div>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 {getStatusClass(event.status)}">
                        {getStatusLabel(event.status)}
                      </span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{event.package} pakket</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Snelle Acties</h3>
            <div class="grid grid-cols-2 gap-3">
              <a href="/dashboard/boekingen" class="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                  <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
                </svg>
                Nieuwe boeking
              </a>
              <a href="/dashboard/klanten" class="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8zm0 10c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4"/>
                </svg>
                Nieuwe klant
              </a>
              <a href="/dashboard/financien" class="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16zm0-10H4V6h16z"/>
                </svg>
                Maak factuur
              </a>
              <a href="/dashboard/boekingen" class="flex flex-col items-center justify-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"/>
                </svg>
                Voeg apparatuur toe
              </a>
            </div>
          </div>
          
          <!-- Notifications Panel -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notificaties</h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {dashboardData.notifications.filter(n => !n.read).length} Nieuw
              </span>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              {#if dashboardData.notifications.length === 0}
                <div class="p-5 text-center">
                  <p class="text-gray-500 dark:text-gray-400">Geen notificaties</p>
                </div>
              {:else}
                {#each dashboardData.notifications as notification}
                  <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors {notification.read ? 'opacity-70' : ''}" on:click={() => markNotificationAsRead(notification.id)}>
                    <div class="flex">
                      <div class="{getNotificationTypeClass(notification.type)} p-2 rounded-lg flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d={
                            notification.type === 'info' 
                              ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                              : notification.type === 'warning'
                              ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                              : notification.type === 'success'
                              ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z'
                              : 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                          } />
                        </svg>
                      </div>
                      <div class="ml-3 flex-1">
                        <div class="flex justify-between">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                      </div>
                      {#if !notification.read}
                        <div class="flex-shrink-0 ml-2">
                          <div class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
          
          <!-- Tasks -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Taken</h3>
              <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                Nieuwe taak
              </button>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              {#if dashboardData.tasks.length === 0}
                <div class="p-5 text-center">
                  <p class="text-gray-500 dark:text-gray-400">Geen taken</p>
                </div>
              {:else}
                {#each dashboardData.tasks.filter(t => !t.completed).slice(0, 3) as task}
                  <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <div class="flex items-start">
                      <input 
                        type="checkbox" 
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 mt-1"
                        checked={task.completed}
                        on:change={() => toggleTaskComplete(task.id)}
                      />
                      <div class="ml-3 flex-1">
                        <div class="flex justify-between">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                          <span class="px-2 py-0.5 rounded text-xs font-medium {getPriorityClass(task.priority)}">
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Deadline: {formatDate(task.dueDate)}</p>
                      </div>
                    </div>
                  </div>
                {/each}
                
                {#if dashboardData.tasks.some(t => t.completed)}
                  <div class="p-4 bg-gray-50 dark:bg-gray-900/20">
                    <button class="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      Toon voltooide taken ({dashboardData.tasks.filter(t => t.completed).length})
                    </button>
                  </div>
                {/if}
              {/if}
            </div>
          </div>
          
          <!-- Recent Activity -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recente Activiteit</h3>
              <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                Alles bekijken
              </button>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              {#if dashboardData.recentActivity.length === 0}
                <div class="p-5 text-center">
                  <p class="text-gray-500 dark:text-gray-400">Geen recente activiteit</p>
                </div>
              {:else}
                {#each dashboardData.recentActivity as activity}
                  <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <div class="flex">
                      <div class="p-2 rounded-lg flex-shrink-0 
                        {activity.type === 'booking' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' : 
                         activity.type === 'payment' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 
                         activity.type === 'customer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 
                         activity.type === 'review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' : 
                         'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'}"
                      >
                        {@html getIconForActivityType(activity.type)}
                      </div>
                      <div class="ml-3 flex-1">
                        <div class="flex justify-between">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>