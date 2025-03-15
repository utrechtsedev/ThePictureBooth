<script>
    import { onMount } from 'svelte';
    import { fade, slide, scale } from 'svelte/transition';
    
    // State management
    let isLoading = true;
    let selectedTab = 'equipment';
    let searchQuery = '';
    let showAddEquipment = false;
    let showAddSupply = false;
    let showMaintenanceForm = false;
    let selectedEquipment = null;
    let selectedSupply = null;
    
    // Data states
    let equipment = [];
    let supplies = [];
    let maintenanceHistory = [];
    let upcomingMaintenance = [];
    let bookedEquipment = [];
    
    // Equipment and supply categories
    const equipmentCategories = ['Fotobooth', 'Camera', 'Printer', 'Verlichting', 'Achtergrond', 'Computer', 'Accessoires'];
    const supplyCategories = ['Papier', 'Inkt', 'Props', 'USB Sticks', 'Batterijen', 'Kabels'];
    
    // Equipment statuses
    const statuses = ['Beschikbaar', 'In gebruik', 'Onderhoud nodig', 'In onderhoud', 'Buiten gebruik'];
    
    // Filter states
    let statusFilter = 'all';
    let categoryFilter = 'all';
    let lowStockOnly = false;
    
    // Initialize with mock data
    onMount(async () => {
      await loadData();
      isLoading = false;
    });
    
    async function loadData() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock equipment data
      equipment = [
        {
          id: 1,
          name: 'Fotobooth Premium',
          category: 'Fotobooth',
          model: 'Ring Booth Pro',
          purchaseDate: '2022-08-15',
          purchasePrice: 2299,
          status: 'Beschikbaar',
          location: 'Hoofdkantoor',
          nextMaintenance: '2025-05-10',
          image: null,
          serialNumber: 'RB-2023-089743',
          notes: 'Nieuwste model met touchscreen en ring flitser'
        },
        {
          id: 2,
          name: 'Fotobooth Standard',
          category: 'Fotobooth',
          model: 'Classic Booth',
          purchaseDate: '2021-04-22',
          purchasePrice: 1799,
          status: 'In gebruik',
          location: 'Evenement - Bruiloft Laura',
          nextMaintenance: '2025-04-25',
          image: null,
          serialNumber: 'CB-2021-045621',
          notes: 'Nieuwe printer geïnstalleerd op 15 februari 2025'
        },
        {
          id: 3,
          name: 'Camera Sony Alpha',
          category: 'Camera',
          model: 'Sony A7 III',
          purchaseDate: '2022-10-05',
          purchasePrice: 1899,
          status: 'Beschikbaar',
          location: 'Hoofdkantoor',
          nextMaintenance: '2025-10-05',
          image: null,
          serialNumber: 'SA7-8976543',
          notes: 'Met 24-70mm lens'
        },
        {
          id: 4,
          name: 'Printer DNP',
          category: 'Printer',
          model: 'DNP DS-RX1HS',
          purchaseDate: '2023-01-10',
          purchasePrice: 1249,
          status: 'Onderhoud nodig',
          location: 'Hoofdkantoor',
          nextMaintenance: '2025-04-01',
          image: null,
          serialNumber: 'DNP-2023-567234',
          notes: 'Papier loopt soms vast, onderhoud inplannen'
        },
        {
          id: 5,
          name: 'Ring Flitser',
          category: 'Verlichting',
          model: 'Neewer Ring Light',
          purchaseDate: '2023-05-20',
          purchasePrice: 129.99,
          status: 'Beschikbaar',
          location: 'Hoofdkantoor',
          nextMaintenance: '2025-11-20',
          image: null,
          serialNumber: 'NRL-234567',
          notes: '18 inch, verstelbare helderheid'
        },
        {
          id: 6,
          name: 'Green Screen',
          category: 'Achtergrond',
          model: 'Chroma Key Backdrop',
          purchaseDate: '2023-03-15',
          purchasePrice: 89.99,
          status: 'Beschikbaar',
          location: 'Hoofdkantoor',
          nextMaintenance: null,
          image: null,
          serialNumber: 'N/A',
          notes: '3 x 5 meter, opvouwbaar'
        },
        {
          id: 7,
          name: 'Fotobooth Deluxe',
          category: 'Fotobooth',
          model: 'Mirror Booth X',
          purchaseDate: '2023-11-01',
          purchasePrice: 3499,
          status: 'In onderhoud',
          location: 'Servicecentrum',
          nextMaintenance: '2025-03-20',
          image: null,
          serialNumber: 'MBX-2023-12345',
          notes: 'Touchscreen reageert soms niet goed, in reparatie'
        }
      ];
      
      // Mock supplies data
      supplies = [
        {
          id: 1,
          name: 'Fotopapier 10x15',
          category: 'Papier',
          model: 'DNP DS620 10x15cm',
          currentStock: 1200,
          minStockLevel: 500,
          unit: 'Prints',
          location: 'Opslagruimte',
          lastRestockDate: '2025-02-10',
          expiryDate: '2026-02-10',
          supplierInfo: 'Fotogigant B.V.',
          purchasePrice: 0.21,
          notes: '2 rolls per pak, 400 prints per rol'
        },
        {
          id: 2,
          name: 'Inktcartridge',
          category: 'Inkt',
          model: 'DNP DS620 Ribbon',
          currentStock: 3,
          minStockLevel: 5,
          unit: 'Stuks',
          location: 'Opslagruimte',
          lastRestockDate: '2025-01-15',
          expiryDate: '2026-01-15',
          supplierInfo: 'Fotogigant B.V.',
          purchasePrice: 79.99,
          notes: '800 prints per cartridge'
        },
        {
          id: 3,
          name: 'Bruiloft Props',
          category: 'Props',
          model: 'Wedding Collection',
          currentStock: 4,
          minStockLevel: 2,
          unit: 'Sets',
          location: 'Prop kastje',
          lastRestockDate: '2024-12-05',
          expiryDate: null,
          supplierInfo: 'Party Props',
          purchasePrice: 29.99,
          notes: '20 accessoires per set'
        },
        {
          id: 4,
          name: 'USB Sticks 32GB',
          category: 'USB Sticks',
          model: 'SanDisk Ultra',
          currentStock: 45,
          minStockLevel: 20,
          unit: 'Stuks',
          location: 'Kantoorlade',
          lastRestockDate: '2025-01-20',
          expiryDate: null,
          supplierInfo: 'MediaMarkt',
          purchasePrice: 9.99,
          notes: 'Voor evenementfoto\'s'
        },
        {
          id: 5,
          name: 'AA Batterijen',
          category: 'Batterijen',
          model: 'Duracell',
          currentStock: 24,
          minStockLevel: 48,
          unit: 'Stuks',
          location: 'Kantoorlade',
          lastRestockDate: '2025-02-01',
          expiryDate: '2028-01-01',
          supplierInfo: 'MediaMarkt',
          purchasePrice: 0.75,
          notes: 'Voor draadloze apparatuur'
        },
        {
          id: 6,
          name: 'HDMI Kabels',
          category: 'Kabels',
          model: '2m HDMI 2.0',
          currentStock: 8,
          minStockLevel: 5,
          unit: 'Stuks',
          location: 'Kabelbox',
          lastRestockDate: '2024-11-10',
          expiryDate: null,
          supplierInfo: 'MediaMarkt',
          purchasePrice: 12.99,
          notes: 'Voor externe monitoren'
        }
      ];
      
      // Mock maintenance history
      maintenanceHistory = [
        {
          id: 1,
          equipmentId: 7,
          equipmentName: 'Fotobooth Deluxe',
          date: '2025-03-15',
          description: 'Touchscreen vervangen en systeem opnieuw gekalibreerd',
          technician: 'Technico B.V.',
          cost: 349.99,
          status: 'Voltooid'
        },
        {
          id: 2,
          equipmentId: 4,
          equipmentName: 'Printer DNP',
          date: '2025-01-20',
          description: 'Routine onderhoud en reiniging printkop',
          technician: 'Intern - Mark',
          cost: 0,
          status: 'Voltooid'
        },
        {
          id: 3,
          equipmentId: 2,
          equipmentName: 'Fotobooth Standard',
          date: '2025-02-15',
          description: 'Vervanging printer na papierstoringen',
          technician: 'Intern - Mark',
          cost: 35,
          status: 'Voltooid'
        }
      ];
      
      // Mock upcoming maintenance
      upcomingMaintenance = [
        {
          id: 1,
          equipmentId: 4,
          equipmentName: 'Printer DNP',
          scheduledDate: '2025-04-01',
          description: 'Check papierstoringen en reinig printkop',
          technician: 'Intern - Mark',
          estimatedCost: 0,
          priority: 'Hoog'
        },
        {
          id: 2,
          equipmentId: 2,
          equipmentName: 'Fotobooth Standard',
          scheduledDate: '2025-04-25',
          description: 'Halfjaarlijkse controle en software-update',
          technician: 'Intern - Mark',
          estimatedCost: 0,
          priority: 'Medium'
        },
        {
          id: 3,
          equipmentId: 1,
          equipmentName: 'Fotobooth Premium',
          scheduledDate: '2025-05-10',
          description: 'Halfjaarlijkse controle en software-update',
          technician: 'Intern - Mark',
          estimatedCost: 0,
          priority: 'Medium'
        }
      ];
      
      // Mock booked equipment
      bookedEquipment = [
        {
          id: 1,
          equipmentId: 2,
          equipmentName: 'Fotobooth Standard',
          eventName: 'Bruiloft Laura & Pieter',
          startDate: '2025-04-15',
          endDate: '2025-04-15',
          location: 'Landgoed Wolfslaar, Breda',
          customer: 'Laura van den Berg',
          notes: 'Setup tijd: 15:00'
        },
        {
          id: 2,
          equipmentId: 1,
          equipmentName: 'Fotobooth Premium',
          eventName: 'Bedrijfsfeest XYZ',
          startDate: '2025-04-05',
          endDate: '2025-04-05',
          location: 'Kantoor XYZ, Amsterdam',
          customer: 'Bedrijf XYZ',
          notes: 'Extra verlichting meenemen'
        }
      ];
    }
    
    function filteredEquipment() {
      let filtered = [...equipment];
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(item => item.status === statusFilter);
      }
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }
      
      // Apply search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.model.toLowerCase().includes(query) ||
          item.serialNumber.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    }
    
    function filteredSupplies() {
      let filtered = [...supplies];
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }
      
      // Apply low stock filter
      if (lowStockOnly) {
        filtered = filtered.filter(item => item.currentStock <= item.minStockLevel);
      }
      
      // Apply search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.model.toLowerCase().includes(query) ||
          item.supplierInfo?.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    }
    
    function getStockStatus(supply) {
      if (supply.currentStock <= 0) {
        return { class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Geen voorraad' };
      } else if (supply.currentStock <= supply.minStockLevel) {
        return { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Lage voorraad' };
      } else {
        return { class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Voldoende' };
      }
    }
    
    function getStatusClass(status) {
      switch(status) {
        case 'Beschikbaar':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'In gebruik':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Onderhoud nodig':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'In onderhoud':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        case 'Buiten gebruik':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function getPriorityClass(priority) {
      switch(priority) {
        case 'Hoog':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'Medium':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'Laag':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function formatDate(dateString) {
      if (!dateString) return '-';
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
    
    function viewEquipmentDetails(item) {
      selectedEquipment = item;
    }
    
    function closeEquipmentDetails() {
      selectedEquipment = null;
    }
    
    function viewSupplyDetails(item) {
      selectedSupply = item;
    }
    
    function closeSupplyDetails() {
      selectedSupply = null;
    }
    
    function toggleAddEquipment() {
      showAddEquipment = !showAddEquipment;
    }
    
    function toggleAddSupply() {
      showAddSupply = !showAddSupply;
    }
    
    function toggleMaintenanceForm() {
      showMaintenanceForm = !showMaintenanceForm;
    }
    
    function getMissingMaintenance() {
      const today = new Date();
      return equipment.filter(item => {
        if (!item.nextMaintenance) return false;
        return new Date(item.nextMaintenance) < today && item.status !== 'In onderhoud';
      });
    }
    
    function getLowStockSupplies() {
      return supplies.filter(item => item.currentStock <= item.minStockLevel);
    }
  </script>
  
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Apparatuur & Voorraad</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Beheer je fotobooths, camera's, en supplies</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-3">
        {#if selectedTab === 'equipment'}
          <button 
            on:click={toggleAddEquipment}
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
            </svg>
            Nieuwe Apparatuur
          </button>
        {:else if selectedTab === 'supplies'}
          <button 
            on:click={toggleAddSupply}
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
            </svg>
            Nieuwe Voorraad
          </button>
        {:else if selectedTab === 'maintenance'}
          <button 
            on:click={toggleMaintenanceForm}
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
            </svg>
            Plan Onderhoud
          </button>
        {/if}
      </div>
    </div>
    
    <!-- Alert Section for Low Stock and Maintenance -->
    {#if getLowStockSupplies().length > 0 || getMissingMaintenance().length > 0}
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-amber-800 dark:text-amber-300">Let op</h3>
            <div class="mt-2 text-sm text-amber-700 dark:text-amber-200">
              <ul class="list-disc pl-5 space-y-1">
                {#if getLowStockSupplies().length > 0}
                  <li>{getLowStockSupplies().length} artikelen hebben een lage voorraad</li>
                {/if}
                {#if getMissingMaintenance().length > 0}
                  <li>{getMissingMaintenance().length} apparaten hebben gepland onderhoud nodig</li>
                {/if}
              </ul>
            </div>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="flex space-x-6 overflow-x-auto" aria-label="Tabs">
        <button 
          class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
          {selectedTab === 'equipment' 
            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
          on:click={() => selectedTab = 'equipment'}
        >
          Apparatuur
        </button>
        <button 
          class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
          {selectedTab === 'supplies' 
            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
          on:click={() => selectedTab = 'supplies'}
        >
          Voorraad
        </button>
        <button 
          class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
          {selectedTab === 'maintenance' 
            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
          on:click={() => selectedTab = 'maintenance'}
        >
          Onderhoud
        </button>
        <button 
          class="py-3 text-gray-500 dark:text-gray-400 border-b-2 font-medium text-sm whitespace-nowrap
          {selectedTab === 'availability' 
            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
          on:click={() => selectedTab = 'availability'}
        >
          Beschikbaarheid
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
        <p class="ml-4 font-medium text-gray-500 dark:text-gray-400">Gegevens laden...</p>
      </div>
    {:else}
      <!-- Equipment Tab -->
      {#if selectedTab === 'equipment'}
        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Status Filter -->
            <div class="flex-1 min-w-0">
              <label for="status-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select 
                id="status-filter"
                bind:value={statusFilter}
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Alle statussen</option>
                {#each statuses as status}
                  <option value={status}>{status}</option>
                {/each}
              </select>
            </div>
            
            <!-- Category Filter -->
            <div class="flex-1 min-w-0">
              <label for="category-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
              <select 
                id="category-filter"
                bind:value={categoryFilter}
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Alle categorieën</option>
                {#each equipmentCategories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
            
            <!-- Search -->
            <div class="flex-1 min-w-0">
              <label for="search-equipment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zoeken</label>
              <div class="relative">
                <input
                  id="search-equipment"
                  type="text"
                  placeholder="Zoek op naam, model, serienummer..."
                  bind:value={searchQuery}
                  class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600
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
        </div>
        
        <!-- Equipment Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each filteredEquipment() as item}
            <div 
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              on:click={() => viewEquipmentDetails(item)}
            >
              <div class="p-5">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{item.model}</p>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusClass(item.status)}">
                    {item.status}
                  </span>
                </div>
                
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400">Categorie:</span>
                    <span class="text-gray-900 dark:text-white font-medium">{item.category}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400">Locatie:</span>
                    <span class="text-gray-900 dark:text-white font-medium">{item.location}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400">Volgende onderhoud:</span>
                    <span class="text-gray-900 dark:text-white font-medium">{formatDate(item.nextMaintenance)}</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 dark:bg-gray-900/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    Aanschaf: {formatDate(item.purchaseDate)}
                  </div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(item.purchasePrice)}
                  </div>
                </div>
              </div>
            </div>
          {/each}
          
          {#if filteredEquipment().length === 0}
            <div class="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <div class="flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M9 4h2v5l-1-.75L9 9zm9 16H6V4h1v9l3-2.25L13 13V4h5z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Geen apparatuur gevonden</h3>
                <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  Er is geen apparatuur die voldoet aan je zoekcriteria. Probeer andere filters of voeg nieuwe apparatuur toe.
                </p>
                <button 
                  on:click={toggleAddEquipment}
                  class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apparatuur toevoegen
                </button>
              </div>
            </div>
          {/if}
        </div>
      
      <!-- Supplies Tab -->
      {:else if selectedTab === 'supplies'}
        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Category Filter -->
            <div class="flex-1 min-w-0">
              <label for="supply-category-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
              <select 
                id="supply-category-filter"
                bind:value={categoryFilter}
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Alle categorieën</option>
                {#each supplyCategories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
            
            <!-- Low Stock Filter -->
            <div class="flex-1 min-w-0 flex items-end pb-2">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  bind:checked={lowStockOnly}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Alleen lage voorraad tonen</span>
              </label>
            </div>
            
            <!-- Search -->
            <div class="flex-1 min-w-0">
              <label for="search-supplies" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zoeken</label>
              <div class="relative">
                <input
                  id="search-supplies"
                  type="text"
                  placeholder="Zoek op naam, model, leverancier..."
                  bind:value={searchQuery}
                  class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600
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
        </div>
        
        <!-- Supplies Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900/30">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Naam</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categorie</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Huidige voorraad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Minimale voorraad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Locatie</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actie</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {#each filteredSupplies() as item}
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{item.model}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-white">{item.category}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.currentStock} {item.unit}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.minStockLevel} {item.unit}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStockStatus(item).class}">
                        {getStockStatus(item).label}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.location}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        on:click={() => viewSupplyDetails(item)}
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      >
                        Details
                      </button>
                      <button class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                        Voorraad aanpassen
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          
          {#if filteredSupplies().length === 0}
            <div class="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2V7h-4v2h2z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Geen voorraad gevonden</h3>
              <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                Er zijn geen voorraaditems die voldoen aan je zoekcriteria. Probeer andere filters of voeg nieuwe voorraad toe.
              </p>
              <button 
                on:click={toggleAddSupply}
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voorraad toevoegen
              </button>
            </div>
          {/if}
        </div>
      
      <!-- Maintenance Tab -->
      {:else if selectedTab === 'maintenance'}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Upcoming Maintenance -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Gepland Onderhoud</h3>
              <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                Alles bekijken
              </button>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              {#if upcomingMaintenance.length === 0}
                <div class="p-5 text-center">
                  <p class="text-gray-500 dark:text-gray-400">Geen gepland onderhoud</p>
                </div>
              {:else}
                {#each upcomingMaintenance as maintenance}
                  <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <div class="flex justify-between">
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">{maintenance.equipmentName}</h4>
                        <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {maintenance.description}
                        </div>
                        <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                            <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
                          </svg>
                          Gepland: {formatDate(maintenance.scheduledDate)}
                        </div>
                        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Technicus: {maintenance.technician}
                        </div>
                      </div>
                      <div>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 {getPriorityClass(maintenance.priority)}">
                          {maintenance.priority}
                        </span>
                        {#if maintenance.estimatedCost > 0}
                          <div class="mt-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                            Geschatte kosten: {formatCurrency(maintenance.estimatedCost)}
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
          
          <!-- Maintenance History -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Onderhoudsgeschiedenis</h3>
              <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                Alles bekijken
              </button>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              {#if maintenanceHistory.length === 0}
                <div class="p-5 text-center">
                  <p class="text-gray-500 dark:text-gray-400">Geen onderhoudsgeschiedenis</p>
                </div>
              {:else}
                {#each maintenanceHistory as maintenance}
                  <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <div class="flex justify-between">
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">{maintenance.equipmentName}</h4>
                        <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {maintenance.description}
                        </div>
                        <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                            <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
                          </svg>
                          Datum: {formatDate(maintenance.date)}
                        </div>
                        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Technicus: {maintenance.technician}
                        </div>
                      </div>
                      <div>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          {maintenance.status}
                        </span>
                        <div class="mt-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                          Kosten: {formatCurrency(maintenance.cost)}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Equipment Needing Maintenance -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Apparatuur die onderhoud nodig heeft</h3>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            {#if getMissingMaintenance().length === 0}
              <div class="p-5 text-center">
                <p class="text-gray-500 dark:text-gray-400">Alle apparatuur is up-to-date met onderhoud</p>
              </div>
            {:else}
              {#each getMissingMaintenance() as item}
                <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <div class="flex justify-between">
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                      <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {item.model} • {item.category}
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                          <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
                          </svg>
                        Gepland onderhoud: {formatDate(item.nextMaintenance)}
                      </div>
                    </div>
                    <div>
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 {getStatusClass(item.status)}">
                        {item.status}
                      </span>
                      <div class="mt-2 flex space-x-2">
                        <button 
                          on:click={() => viewEquipmentDetails(item)}
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Details
                        </button>
                        <button 
                          on:click={toggleMaintenanceForm}
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                        >
                          Plan onderhoud
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      
      <!-- Availability Tab -->
      {:else if selectedTab === 'availability'}
        <!-- Calendar legend and filters would go here -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <div class="flex flex-wrap gap-4 justify-between items-center">
            <div class="flex flex-wrap gap-4 items-center">
              <h3 class="text-md font-medium text-gray-900 dark:text-white">Legenda:</h3>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-200 dark:bg-green-900/50 rounded-sm mr-2"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">Beschikbaar</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-200 dark:bg-red-900/50 rounded-sm mr-2"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">Geboekt</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-purple-200 dark:bg-purple-900/50 rounded-sm mr-2"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">Onderhoud</span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button class="p-1.5 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm">
                April 2025
              </button>
              <button class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Equipment Availability Calendar (simplified for this example) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Beschikbaarheid apparatuur</h3>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <!-- Equipment row headers -->
            <div class="grid grid-cols-8 bg-gray-50 dark:bg-gray-900/30 p-2">
              <div class="col-span-1 pl-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Apparatuur</div>
              <div class="col-span-7 grid grid-cols-7 gap-1">
                <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">Ma</div>
                <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">Di</div>
                <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">Wo</div>
                <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">Do</div>
                <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">Vr</div>
                <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">Za</div>
                <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">Zo</div>
              </div>
            </div>
            
            <!-- Equipment rows -->
<!-- Equipment rows -->
{#each equipment as item}
  <div class="grid grid-cols-8 p-2">
    <div class="col-span-1 pl-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
    <div class="col-span-7 grid grid-cols-7 gap-1">
      {#each Array(7) as _, i}
        <div 
          class="h-10 rounded {
            bookedEquipment.some(b => 
              b.equipmentId === item.id && 
              new Date(b.startDate).getDay() === (i + 1) % 7
            )
              ? 'bg-red-200 dark:bg-red-900/50 cursor-pointer relative group' 
              : item.status === 'In onderhoud'
                ? 'bg-purple-200 dark:bg-purple-900/50' 
                : 'bg-green-200 dark:bg-green-900/50'
          }"
        >
          {#if bookedEquipment.some(b => b.equipmentId === item.id && new Date(b.startDate).getDay() === (i + 1) % 7)}
            <div class="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {bookedEquipment.find(b => 
                b.equipmentId === item.id && 
                new Date(b.startDate).getDay() === (i + 1) % 7
              ).eventName}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/each}
          </div>
        </div>
        
        <!-- Booked Equipment List -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Geboekte apparatuur</h3>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            {#if bookedEquipment.length === 0}
              <div class="p-5 text-center">
                <p class="text-gray-500 dark:text-gray-400">Geen geboekte apparatuur</p>
              </div>
            {:else}
              {#each bookedEquipment as booking}
                <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <div class="flex justify-between">
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{booking.equipmentName}</h4>
                      <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {booking.eventName}
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                          <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
                          </svg>
                        Datum: {formatDate(booking.startDate)}
                      </div>
                      <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Locatie: {booking.location}
                      </div>
                      {#if booking.notes}
                        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Notities: {booking.notes}
                        </div>
                      {/if}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        Klant: {booking.customer}
                      </div>
                      <div class="mt-2 flex space-x-2">
                        <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                          Boeking bekijken
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      {/if}
    {/if}
  </div>
  
  <!-- Equipment Details Modal -->
  {#if selectedEquipment}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
      on:click={closeEquipmentDetails}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'x' }}
        class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
        on:click|stopPropagation
      >
        <div class="p-6 space-y-6">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Apparatuur Details</h2>
            <button 
              on:click={closeEquipmentDetails}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{selectedEquipment.name}</h3>
              <p class="text-gray-600 dark:text-gray-400">{selectedEquipment.model}</p>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-sm font-medium {getStatusClass(selectedEquipment.status)}">
              {selectedEquipment.status}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categorie</h4>
              <p class="text-gray-900 dark:text-white">{selectedEquipment.category}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Serienummer</h4>
              <p class="text-gray-900 dark:text-white">{selectedEquipment.serialNumber}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aankoopdatum</h4>
              <p class="text-gray-900 dark:text-white">{formatDate(selectedEquipment.purchaseDate)}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aankoopprijs</h4>
              <p class="text-gray-900 dark:text-white">{formatCurrency(selectedEquipment.purchasePrice)}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Locatie</h4>
              <p class="text-gray-900 dark:text-white">{selectedEquipment.location}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Volgend onderhoud</h4>
              <p class="text-gray-900 dark:text-white">{formatDate(selectedEquipment.nextMaintenance)}</p>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notities</h4>
            <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/30 p-3 rounded">
              {selectedEquipment.notes || 'Geen notities'}
            </p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Onderhoudsgeschiedenis</h4>
            <div class="space-y-3">
              {#each maintenanceHistory.filter(m => m.equipmentId === selectedEquipment.id) as maintenance}
                <div class="bg-gray-50 dark:bg-gray-900/30 p-3 rounded">
                  <div class="flex justify-between">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{formatDate(maintenance.date)}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(maintenance.cost)}</p>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{maintenance.description}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Technicus: {maintenance.technician}</p>
                </div>
              {:else}
                <p class="text-sm text-gray-500 dark:text-gray-400">Geen onderhoudsgeschiedenis beschikbaar</p>
              {/each}
            </div>
          </div>
          
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
            <button class="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium">
              Bewerken
            </button>
            <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Plan onderhoud
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Supply Details Modal -->
  {#if selectedSupply}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
      on:click={closeSupplyDetails}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'x' }}
        class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
        on:click|stopPropagation
      >
        <div class="p-6 space-y-6">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Voorraad Details</h2>
            <button 
              on:click={closeSupplyDetails}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{selectedSupply.name}</h3>
              <p class="text-gray-600 dark:text-gray-400">{selectedSupply.model}</p>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-sm font-medium {getStockStatus(selectedSupply).class}">
              {getStockStatus(selectedSupply).label}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categorie</h4>
              <p class="text-gray-900 dark:text-white">{selectedSupply.category}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Huidige voorraad</h4>
              <p class="text-gray-900 dark:text-white">{selectedSupply.currentStock} {selectedSupply.unit}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Minimale voorraad</h4>
              <p class="text-gray-900 dark:text-white">{selectedSupply.minStockLevel} {selectedSupply.unit}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Locatie</h4>
              <p class="text-gray-900 dark:text-white">{selectedSupply.location}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Laatste aanvulling</h4>
              <p class="text-gray-900 dark:text-white">{formatDate(selectedSupply.lastRestockDate)}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Houdbaarheidsdatum</h4>
              <p class="text-gray-900 dark:text-white">{formatDate(selectedSupply.expiryDate)}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Leverancier</h4>
              <p class="text-gray-900 dark:text-white">{selectedSupply.supplierInfo || 'Onbekend'}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Inkoopprijs per eenheid</h4>
              <p class="text-gray-900 dark:text-white">{formatCurrency(selectedSupply.purchasePrice)}</p>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notities</h4>
            <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/30 p-3 rounded">
              {selectedSupply.notes || 'Geen notities'}
            </p>
          </div>
          
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
            <button class="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium">
              Bewerken
            </button>
            <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Voorraad bijwerken
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Add Equipment Modal -->
  {#if showAddEquipment}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
      on:click={toggleAddEquipment}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'y' }}
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
        on:click|stopPropagation
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nieuwe Apparatuur Toevoegen</h2>
          <button 
            on:click={toggleAddEquipment}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Equipment Form -->
        <form class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Basisinformatie</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="equipment-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naam</label>
                <input
                  type="text"
                  id="equipment-name"
                  placeholder="Naam van de apparatuur"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="equipment-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
                <select
                  id="equipment-category"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecteer categorie</option>
                  {#each equipmentCategories as category}
                    <option value={category}>{category}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="equipment-model" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                <input
                  type="text"
                  id="equipment-model"
                  placeholder="Model of type"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="equipment-serial" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serienummer</label>
                <input
                  type="text"
                  id="equipment-serial"
                  placeholder="Serienummer"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Purchase Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Aankoopgegevens</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="purchase-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aankoopdatum</label>
                <input
                  type="date"
                  id="purchase-date"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="purchase-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aankoopprijs (€)</label>
                <input
                  type="number"
                  id="purchase-price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Status and Location -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Status en locatie</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="equipment-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  id="equipment-status"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {#each statuses as status}
                    <option value={status}>{status}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="equipment-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Locatie</label>
                <input
                type="text"
                id="equipment-location"
                placeholder="Waar bevindt de apparatuur zich"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="next-maintenance" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volgend onderhoud</label>
              <input
                type="date"
                id="next-maintenance"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <!-- Notes -->
        <div>
          <label for="equipment-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notities</label>
          <textarea
            id="equipment-notes"
            rows="3"
            placeholder="Extra informatie over de apparatuur"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          ></textarea>
        </div>
        
        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 dark:text-gray-400">
                <label for="file-upload" class="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload een bestand</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                </label>
                <p class="pl-1">of sleep het hierheen</p>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF tot 10MB
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button"
            on:click={toggleAddEquipment}
            class="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Annuleren
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apparatuur toevoegen
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Add Supply Modal -->
{#if showAddSupply}
  <div 
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
    on:click={toggleAddSupply}
  >
    <div 
      transition:slide={{ duration: 300, axis: 'y' }}
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
      on:click|stopPropagation
    >
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nieuwe Voorraad Toevoegen</h2>
        <button 
          on:click={toggleAddSupply}
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Supply Form -->
      <form class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Basisinformatie</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="supply-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naam</label>
              <input
                type="text"
                id="supply-name"
                placeholder="Naam van het artikel"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="supply-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
              <select
                id="supply-category"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecteer categorie</option>
                {#each supplyCategories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="supply-model" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model of specificatie</label>
              <input
                type="text"
                id="supply-model"
                placeholder="Model of specifiek type"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="supply-unit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eenheid</label>
              <input
                type="text"
                id="supply-unit"
                placeholder="bv. Stuks, Meters, Prints"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <!-- Stock Information -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Voorraadgegevens</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="current-stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Huidige voorraad</label>
              <input
                type="number"
                id="current-stock"
                placeholder="0"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="min-stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimale voorraad</label>
              <input
                type="number"
                id="min-stock"
                placeholder="0"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="supply-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opslaglocatie</label>
              <input
                type="text"
                id="supply-location"
                placeholder="Waar wordt het opgeslagen"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="restock-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Laatste aanvulling</label>
              <input
                type="date"
                id="restock-date"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="expiry-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Houdbaarheidsdatum</label>
              <input
                type="date"
                id="expiry-date"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="purchase-price-unit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inkoopprijs per eenheid (€)</label>
              <input
                type="number"
                id="purchase-price-unit"
                placeholder="0.00"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <!-- Supplier Information -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Leveranciersinformatie</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="supplier-info" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leverancier</label>
              <input
                type="text"
                id="supplier-info"
                placeholder="Naam van de leverancier"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <!-- Notes -->
        <div>
          <label for="supply-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notities</label>
          <textarea
            id="supply-notes"
            rows="3"
            placeholder="Extra informatie over het artikel"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button"
            on:click={toggleAddSupply}
            class="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Annuleren
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voorraad toevoegen
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Maintenance Form Modal -->
{#if showMaintenanceForm}
  <div 
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
    on:click={toggleMaintenanceForm}
  >
    <div 
      transition:slide={{ duration: 300, axis: 'y' }}
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
      on:click|stopPropagation
    >
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Onderhoud Inplannen</h2>
        <button 
          on:click={toggleMaintenanceForm}
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Maintenance Form -->
      <form class="space-y-6">
        <!-- Equipment Selection -->
        <div>
          <label for="maintenance-equipment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecteer apparatuur</label>
          <select
            id="maintenance-equipment"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Selecteer apparatuur</option>
            {#each equipment as item}
              <option value={item.id}>{item.name} ({item.model})</option>
            {/each}
          </select>
        </div>
        
        <!-- Maintenance Details -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="scheduled-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Geplande datum</label>
              <input
                type="date"
                id="scheduled-date"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="maintenance-priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioriteit</label>
              <select
                id="maintenance-priority"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Laag">Laag</option>
                <option value="Medium">Medium</option>
                <option value="Hoog">Hoog</option>
              </select>
            </div>
            <div>
              <label for="maintenance-technician" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technicus</label>
              <input
                type="text"
                id="maintenance-technician"
                placeholder="Wie voert het onderhoud uit"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="estimated-cost" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Geschatte kosten (€)</label>
              <input
                type="number"
                id="estimated-cost"
                placeholder="0.00"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <!-- Description -->
        <div>
          <label for="maintenance-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beschrijving van het onderhoud</label>
          <textarea
            id="maintenance-description"
            rows="3"
            placeholder="Beschrijf welk onderhoud er uitgevoerd moet worden"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          ></textarea>
        </div>
        
        <!-- Update Equipment Status -->
        <div>
          <div class="flex items-start space-x-2">
            <input
              type="checkbox"
              id="update-equipment-status"
              class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            />
            <label for="update-equipment-status" class="text-sm text-gray-700 dark:text-gray-300">
              Markeer apparatuur automatisch als "In onderhoud" op de geplande datum
            </label>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button"
            on:click={toggleMaintenanceForm}
            class="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Annuleren
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Onderhoud inplannen
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}