<script>
    import { onMount } from 'svelte';
    import { fade, slide, scale } from 'svelte/transition';
    
    // State management
    let isLoading = true;
    let customers = [];
    let filteredCustomers = [];
    let selectedCustomer = null;
    let showCustomerDetails = false;
    let showCreateCustomer = false;
    let showEmailComposer = false;
    let searchQuery = '';
    let selectedView = 'grid';
    let selectedFilter = 'all';
    let selectedSort = 'name_asc';
    let currentPage = 1;
    let itemsPerPage = 12;
    let emailTemplate = '';
    let tags = ['VIP', 'Bruiloft', 'Bedrijfsfeest', 'Verjaardag', 'Terugkerende klant', 'Potentieel', 'Inactief'];
    let selectedTags = [];
    
    // Analytics data
    let customerAnalytics = {
      customersByType: [],
      customerGrowth: [],
      customerRetention: 0,
      totalCustomers: 0,
      activeCustomers: 0,
      newCustomersThisMonth: 0,
      averageEventValue: 0
    };
    
    // Pagination state for customers
    let totalPages = 1;
    
    // Email templates
    let emailTemplates = [
      { id: 'welcome', name: 'Welkomstmail', subject: 'Welkom bij The Picture Booth!' },
      { id: 'follow_up', name: 'Opvolging na evenement', subject: 'Bedankt voor je boeking bij The Picture Booth' },
      { id: 'discount', name: 'Kortingsaanbieding', subject: 'Speciale aanbieding voor jou' },
      { id: 'newsletter', name: 'Nieuwsbrief', subject: 'Nieuws en updates van The Picture Booth' }
    ];
    
    // Initialize with mock data
    onMount(async () => {
      await loadCustomers();
      await loadAnalytics();
      isLoading = false;
    });
    
    async function loadCustomers() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock customers data
      customers = [
        {
          id: 1,
          name: 'Laura van den Berg',
          email: 'laura@example.com',
          phone: '06-12345678',
          company: '',
          type: 'individual',
          address: 'Dorpstraat 123, Amsterdam',
          events: [
            { id: 1, type: 'Bruiloft', date: '2025-04-15', amount: 595, status: 'confirmed' }
          ],
          notes: 'Eerste boeking via Instagram advertentie',
          tags: ['Bruiloft'],
          lastContact: '2025-02-10',
          totalSpent: 595,
          created: '2025-01-15',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 2,
          name: 'Bedrijf XYZ',
          email: 'events@xyz.com',
          phone: '06-87654321',
          company: 'XYZ Corporation',
          type: 'business',
          address: 'Businessweg 45, Amsterdam',
          events: [
            { id: 2, type: 'Bedrijfsfeest', date: '2025-04-05', amount: 395, status: 'confirmed' },
            { id: 7, type: 'Jubileum', date: '2024-10-12', amount: 450, status: 'completed' }
          ],
          notes: 'Contact: Mark de Vries (Evenementencoördinator)',
          tags: ['Bedrijfsfeest', 'Terugkerende klant', 'VIP'],
          lastContact: '2025-02-05',
          totalSpent: 845,
          created: '2024-09-20',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 3,
          name: 'Mark Jansen',
          email: 'mark@example.com',
          phone: '06-11223344',
          company: '',
          type: 'individual',
          address: 'Kerkplein 7, Utrecht',
          events: [
            { id: 3, type: 'Verjaardag', date: '2025-03-22', amount: 450, status: 'pending' }
          ],
          notes: 'Heeft interesse in het premium pakket getoond',
          tags: ['Verjaardag'],
          lastContact: '2025-02-15',
          totalSpent: 0,
          created: '2025-02-01',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 4,
          name: 'Emma de Vries',
          email: 'emma@example.com',
          phone: '06-99887766',
          company: '',
          type: 'individual',
          address: 'Tulpenstraat 28, Vught',
          events: [
            { id: 4, type: 'Bruiloft', date: '2025-05-10', amount: 650, status: 'confirmed' }
          ],
          notes: 'Aanbevolen door Laura van den Berg',
          tags: ['Bruiloft'],
          lastContact: '2025-01-20',
          totalSpent: 0,
          created: '2025-01-10',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 5,
          name: 'Sophie Bakker',
          email: 'sophie@example.com',
          phone: '06-55443322',
          company: '',
          type: 'individual',
          address: 'Zeeweg 42, Rotterdam',
          events: [
            { id: 5, type: 'Afstuderen', date: '2025-06-28', amount: 375, status: 'confirmed' }
          ],
          notes: 'Wil mogelijk een extra uur boeken',
          tags: ['Verjaardag'],
          lastContact: '2025-02-28',
          totalSpent: 0,
          created: '2025-02-20',
          marketingConsent: false,
          profileImage: null
        },
        {
          id: 6,
          name: 'Café De Kroon',
          email: 'info@dekroon.nl',
          phone: '030-5566778',
          company: 'Café De Kroon',
          type: 'business',
          address: 'Markt 12, Utrecht',
          events: [
            { id: 6, type: 'Themafeest', date: '2025-04-20', amount: 475, status: 'pending' }
          ],
          notes: 'Mogelijkheid tot vaste samenwerking voor maandelijkse themafeesten',
          tags: ['Bedrijfsfeest', 'Potentieel'],
          lastContact: '2025-03-01',
          totalSpent: 0,
          created: '2025-02-25',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 7,
          name: 'Jordi van Dijk',
          email: 'jordi@example.com',
          phone: '06-12398745',
          company: '',
          type: 'individual',
          address: 'Boomstraat 5, Groningen',
          events: [
            { id: 8, type: 'Verjaardag', date: '2024-11-15', amount: 425, status: 'completed' }
          ],
          notes: 'Heeft interesse getoond in herboeken voor volgende verjaardag',
          tags: ['Verjaardag', 'Terugkerende klant'],
          lastContact: '2024-11-16',
          totalSpent: 425,
          created: '2024-10-10',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 8,
          name: 'Lotte Meyer',
          email: 'lotte@example.com',
          phone: '06-44338899',
          company: 'Yoga Studio Lotus',
          type: 'business',
          address: 'Vredestraat 8, Den Haag',
          events: [],
          notes: 'Heeft informatie aangevraagd voor openingsevenement in juli',
          tags: ['Potentieel'],
          lastContact: '2025-03-05',
          totalSpent: 0,
          created: '2025-03-05',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 9,
          name: 'Thomas Vermeer',
          email: 'thomas@example.com',
          phone: '06-76512398',
          company: '',
          type: 'individual',
          address: 'Violierstraat 22, Maastricht',
          events: [
            { id: 9, type: 'Bruiloft', date: '2024-08-05', amount: 595, status: 'completed' }
          ],
          notes: 'Was zeer tevreden, mogelijk doorverwijzingen',
          tags: ['Bruiloft', 'Inactief'],
          lastContact: '2024-08-06',
          totalSpent: 595,
          created: '2024-06-15',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 10,
          name: 'Bouwbedrijf Jansen',
          email: 'info@bouwjansen.nl',
          phone: '045-5678901',
          company: 'Bouwbedrijf Jansen BV',
          type: 'business',
          address: 'Industrieweg 78, Eindhoven',
          events: [
            { id: 10, type: 'Jubileum', date: '2025-09-15', amount: 750, status: 'confirmed' }
          ],
          notes: '25-jarig jubileum, VIP-behandeling gewenst',
          tags: ['Bedrijfsfeest', 'VIP'],
          lastContact: '2025-02-20',
          totalSpent: 0,
          created: '2025-01-25',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 11,
          name: 'Anne Jacobs',
          email: 'anne@example.com',
          phone: '06-22446688',
          company: '',
          type: 'individual',
          address: 'Lindenlaan 17, Breda',
          events: [
            { id: 11, type: 'Babyshower', date: '2025-04-30', amount: 325, status: 'confirmed' }
          ],
          notes: 'Speciale wensen: blauwe achtergrond en accessoires',
          tags: [],
          lastContact: '2025-03-10',
          totalSpent: 0,
          created: '2025-03-01',
          marketingConsent: true,
          profileImage: null
        },
        {
          id: 12,
          name: 'Robert de Boer',
          email: 'robert@example.com',
          phone: '06-33557799',
          company: 'De Boer Advocaten',
          type: 'business',
          address: 'Stationsplein 9, Amsterdam',
          events: [
            { id: 12, type: 'Netwerkborrel', date: '2024-05-22', amount: 475, status: 'completed' },
            { id: 13, type: 'Kerstborrel', date: '2024-12-18', amount: 525, status: 'completed' }
          ],
          notes: 'Jaarlijkse kerstborrel potentieel',
          tags: ['Bedrijfsfeest', 'Terugkerende klant'],
          lastContact: '2024-12-19',
          totalSpent: 1000,
          created: '2024-04-10',
          marketingConsent: true,
          profileImage: null
        }
      ];
      
      applyFilters();
    }
    
    async function loadAnalytics() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock analytics data
      customerAnalytics = {
        totalCustomers: 12,
        activeCustomers: 9,
        newCustomersThisMonth: 3,
        averageEventValue: 485,
        customersByType: [
          { type: 'Bruiloft', count: 4, percentage: 33 },
          { type: 'Bedrijfsfeest', count: 4, percentage: 33 },
          { type: 'Verjaardag', count: 2, percentage: 17 },
          { type: 'Overig', count: 2, percentage: 17 }
        ],
        customerGrowth: [
          { month: 'Jan', count: 3 },
          { month: 'Feb', count: 5 },
          { month: 'Mar', count: 3 },
          { month: 'Apr', count: 0 },
          { month: 'May', count: 0 },
          { month: 'Jun', count: 0 },
          { month: 'Jul', count: 0 },
          { month: 'Aug', count: 0 },
          { month: 'Sep', count: 0 },
          { month: 'Oct', count: 0 },
          { month: 'Nov', count: 0 },
          { month: 'Dec', count: 0 }
        ],
        customerRetention: 74
      };
    }
    
    function applyFilters() {
      let results = [...customers];
      
      // Apply type filter
      if (selectedFilter === 'individual') {
        results = results.filter(customer => customer.type === 'individual');
      } else if (selectedFilter === 'business') {
        results = results.filter(customer => customer.type === 'business');
      } else if (selectedFilter === 'with_events') {
        results = results.filter(customer => customer.events && customer.events.length > 0);
      } else if (selectedFilter === 'no_events') {
        results = results.filter(customer => !customer.events || customer.events.length === 0);
      }
      
      // Apply tag filter
      if (selectedTags.length > 0) {
        results = results.filter(customer => 
          customer.tags && selectedTags.some(tag => customer.tags.includes(tag))
        );
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(customer => 
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          (customer.company && customer.company.toLowerCase().includes(query))
        );
      }
      
      // Apply sort
      switch (selectedSort) {
        case 'name_asc':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          results.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'date_asc':
          results.sort((a, b) => new Date(a.created) - new Date(b.created));
          break;
        case 'date_desc':
          results.sort((a, b) => new Date(b.created) - new Date(a.created));
          break;
        case 'value_asc':
          results.sort((a, b) => a.totalSpent - b.totalSpent);
          break;
        case 'value_desc':
          results.sort((a, b) => b.totalSpent - a.totalSpent);
          break;
      }
      
      filteredCustomers = results;
      totalPages = Math.ceil(results.length / itemsPerPage);
      
      // Reset to first page when filters change
      currentPage = 1;
    }
    
    function getPaginatedCustomers() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredCustomers.slice(start, end);
    }
    
    function viewCustomerDetails(customer) {
      selectedCustomer = customer;
      showCustomerDetails = true;
    }
    
    function closeCustomerDetails() {
      showCustomerDetails = false;
      setTimeout(() => {
        selectedCustomer = null;
      }, 300);
    }
    
    function toggleCreateCustomer() {
      showCreateCustomer = !showCreateCustomer;
    }
    
    function toggleEmailComposer(customer) {
      selectedCustomer = customer;
      showEmailComposer = true;
    }
    
    function closeEmailComposer() {
      showEmailComposer = false;
      setTimeout(() => {
        emailTemplate = '';
      }, 300);
    }
    
    function loadEmailTemplate(templateId) {
      const template = emailTemplates.find(t => t.id === templateId);
      if (template) {
        emailTemplate = `Beste ${selectedCustomer.name},
  
  ${template.id === 'welcome' ? 
  `Hartelijk welkom bij The Picture Booth! 
  
  Wij zijn verheugd dat je hebt gekozen voor onze fotobooth diensten voor je aankomende evenement. We kijken ernaar uit om je speciale dag nog onvergetelijker te maken met leuke foto's en herinneringen.
  
  Mocht je nog vragen hebben of extra informatie nodig hebben, aarzel dan niet om contact met ons op te nemen.` : 
  
  template.id === 'follow_up' ? 
  `Bedankt voor het boeken van The Picture Booth voor je recente evenement! 
  
  We hopen dat jij en je gasten hebben genoten van de fotobooth en de mooie herinneringen die jullie hebben vastgelegd. We waarderen je vertrouwen in ons en hopen je in de toekomst weer van dienst te mogen zijn.
  
  Als je een moment hebt, zouden we het op prijs stellen als je je ervaring met ons wilt delen door een korte recensie achter te laten.` : 
  
  template.id === 'discount' ? 
  `Als waardering voor je vertrouwen in The Picture Booth, willen we je graag een speciale aanbieding doen!
  
  Bij je volgende boeking ontvang je 10% korting op het totaalbedrag. Deze aanbieding is geldig voor evenementen die binnen 6 maanden plaatsvinden.
  
  Gebruik kortingscode: LOYALTY10 bij het maken van je reservering.` : 
  
  `We willen je graag op de hoogte houden van de nieuwste ontwikkelingen bij The Picture Booth!
  
  - Nieuwe achtergrondopties toegevoegd
  - Speciale thema-pakketten voor feestdagen
  - Uitgebreide prop-collectie
  
  Bekijk onze website voor meer informatie en neem gerust contact op bij vragen.`}
  
  Met vriendelijke groet,
  
  The Picture Booth Team
  info@thepicturebooth.nl
  06-12345678`;
      }
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
    
    function getInitials(name) {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    
    function getCustomerTypeIcon(type) {
      return type === 'business' ? 
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7V3H2v18h20V7zm-2 12H4v-2h6zm0-4H4v-2h6zm0-4H4V9h6zm0-4H4V5h6zm10 12h-8V9h8z"/></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    }
    
    function getRandomColor(name) {
      // Generate a consistent color based on the name
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const colors = [
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
        'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
        'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
      ];
      
      return colors[Math.abs(hash) % colors.length];
    }
  </script>
  
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Klanten</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Beheer en analyseer al je klantrelaties</p>
      </div>
      
      <button 
        on:click={toggleCreateCustomer}
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
        </svg>
        Nieuwe Klant
      </button>
    </div>
    
    <!-- Customer Analytics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Customers Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Totaal aantal klanten</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{customerAnalytics.totalCustomers}</h3>
            <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
              </svg>
              {customerAnalytics.newCustomersThisMonth} nieuwe deze maand
            </p>
          </div>
          <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Active Customers Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Actieve klanten</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{customerAnalytics.activeCustomers}</h3>
            <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
              </svg>
              {Math.round(customerAnalytics.activeCustomers / customerAnalytics.totalCustomers * 100)}% van totaal
            </p>
          </div>
          <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5S5.5 6.57 5.5 8.5S7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm.05 10H4.77c.99-.5 2.7-1 4.23-1c.11 0 .23.01.34.01c.34-.73.93-1.33 1.64-1.81c-.73-.13-1.42-.2-1.98-.2c-2.34 0-7 1.17-7 3.5V19h7v-1.5c0-.17.02-.34.05-.5zm7.45-2.5c-1.84 0-5.5 1.01-5.5 3V19h11v-1.5c0-1.99-3.66-3-5.5-3zm1.21-1.82c.76-.43 1.29-1.24 1.29-2.18a2.5 2.5 0 0 0-5 0c0 .94.53 1.75 1.29 2.18c.36.2.77.32 1.21.32s.85-.12 1.21-.32z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Customer Retention Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Klantbehoud</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{customerAnalytics.customerRetention}%</h3>
            <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
              </svg>
              5.2% t.o.v. vorig jaar
            </p>
          </div>
          <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="M18 13h-5v5h-2v-5H6v-2h5V6h2v5h5z"/>
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Average Event Value Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Gem. boekingswaarde</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(customerAnalytics.averageEventValue)}</h3>
            <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
              </svg>
              3.7% t.o.v. vorig jaar
            </p>
          </div>
          <div class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Customer Filter, Search and View Toggle -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex flex-col sm:flex-row gap-4 flex-grow">
          <!-- View Toggle -->
          <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button 
              class="px-4 py-2 text-sm font-medium flex items-center {selectedView === 'grid' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
              on:click={() => selectedView = 'grid'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 3v8h8V3zm10 0v8h8V3zM3 13v8h8v-8zm10 0v8h8v-8z"/>
              </svg>
              Grid
            </button>
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
          </div>
          
          <!-- Customer Filter -->
          <div class="flex space-x-2 overflow-x-auto pb-1">
            <button 
              class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
              {selectedFilter === 'all' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
              on:click={() => { selectedFilter = 'all'; applyFilters(); }}
            >
              Alle klanten
            </button>
            <button 
              class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
              {selectedFilter === 'individual' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
              on:click={() => { selectedFilter = 'individual'; applyFilters(); }}
            >
              Particulieren
            </button>
            <button 
              class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
              {selectedFilter === 'business' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
              on:click={() => { selectedFilter = 'business'; applyFilters(); }}
            >
              Bedrijven
            </button>
            <button 
              class="px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap
              {selectedFilter === 'with_events' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
              on:click={() => { selectedFilter = 'with_events'; applyFilters(); }}
            >
              Met boekingen
            </button>
          </div>
        </div>
        
        <!-- Search and Sort -->
        <div class="flex space-x-2">
          <div class="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Zoek op naam, e-mail, telefoon..."
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
          
          <select 
            bind:value={selectedSort}
            on:change={applyFilters}
            class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          >
            <option value="name_asc">Naam (A-Z)</option>
            <option value="name_desc">Naam (Z-A)</option>
            <option value="date_asc">Datum (oudste eerst)</option>
            <option value="date_desc">Datum (nieuwste eerst)</option>
            <option value="value_asc">Waarde (laag-hoog)</option>
            <option value="value_desc">Waarde (hoog-laag)</option>
          </select>
        </div>
      </div>
      
      <!-- Tags Filter -->
      <div class="mt-3 flex flex-wrap gap-2">
        {#each tags as tag}
          <button 
            class="px-3 py-1 text-xs font-medium rounded-full border 
            {selectedTags.includes(tag) 
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50' 
              : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'} 
            hover:bg-gray-50 dark:hover:bg-gray-700"
            on:click={() => {
              if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
              } else {
                selectedTags = [...selectedTags, tag];
              }
              applyFilters();
            }}
          >
            {tag}
          </button>
        {/each}
        {#if selectedTags.length > 0}
          <button 
            class="px-3 py-1 text-xs font-medium rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            on:click={() => {
              selectedTags = [];
              applyFilters();
            }}
          >
            Wis filters
          </button>
        {/if}
      </div>
    </div>
    
    {#if isLoading}
      <!-- Loading State -->
      <div class="flex justify-center items-center py-12">
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-l-transparent border-blue-600 animate-spin"></div>
          <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-r-transparent border-blue-400 animate-pulse absolute top-0 left-0" style="animation-duration: 1.5s;"></div>
        </div>
        <p class="ml-4 font-medium text-gray-500 dark:text-gray-400">Klanten laden...</p>
      </div>
    {:else}
      <!-- Customer List -->
      {#if filteredCustomers.length === 0}
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div class="flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5S5.5 6.57 5.5 8.5S7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm.05 10H4.77c.99-.5 2.7-1 4.23-1c.11 0 .23.01.34.01c.34-.73.93-1.33 1.64-1.81c-.73-.13-1.42-.2-1.98-.2c-2.34 0-7 1.17-7 3.5V19h7v-1.5c0-.17.02-.34.05-.5zm7.45-2.5c-1.84 0-5.5 1.01-5.5 3V19h11v-1.5c0-1.99-3.66-3-5.5-3zm1.21-1.82c.76-.43 1.29-1.24 1.29-2.18a2.5 2.5 0 0 0-5 0c0 .94.53 1.75 1.29 2.18c.36.2.77.32 1.21.32s.85-.12 1.21-.32z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Geen klanten gevonden</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              Er zijn geen klanten die voldoen aan je zoekcriteria. Probeer andere filters of voeg een nieuwe klant toe.
            </p>
            <button 
              on:click={toggleCreateCustomer}
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nieuwe klant toevoegen
            </button>
          </div>
        </div>
      {:else}
        {#if selectedView === 'grid'}
          <!-- Grid View -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each getPaginatedCustomers() as customer}
              <div 
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                on:click={() => viewCustomerDetails(customer)}
              >
                <div class="p-5">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-12 w-12 rounded-full {getRandomColor(customer.name)} flex items-center justify-center text-lg font-medium">
                        {getInitials(customer.name)}
                      </div>
                      <div class="ml-3">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{customer.name}</h3>
                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {@html getCustomerTypeIcon(customer.type)}
                          <span class="ml-1">{customer.type === 'business' ? 'Bedrijf' : 'Particulier'}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      on:click|stopPropagation={() => toggleEmailComposer(customer)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/>
                      </svg>
                      {customer.email}
                    </div>
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                      </svg>
                      {customer.phone}
                    </div>
                    {#if customer.company}
                      <div class="flex items-center text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 7V3H2v18h20V7zm-2 12H4v-2h6zm0-4H4v-2h6zm0-4H4V9h6zm0-4H4V5h6zm10 12h-8V9h8z"/>
                        </svg>
                        {customer.company}
                      </div>
                    {/if}
                  </div>
                  
                  <div class="mt-4 flex flex-wrap gap-1">
                    {#each customer.tags as tag}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {tag}
                      </span>
                    {/each}
                  </div>
                </div>
                
                <div class="bg-gray-50 dark:bg-gray-900/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-medium text-gray-900 dark:text-white">{customer.events?.length || 0}</span> boekingen
                    </div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <!-- List View -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/30">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Klant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Boekingen</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waarde</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actie</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {#each getPaginatedCustomers() as customer}
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10 rounded-full {getRandomColor(customer.name)} flex items-center justify-center text-sm font-medium">
                            {getInitials(customer.name)}
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                            {#if customer.company}
                              <div class="text-sm text-gray-500 dark:text-gray-400">{customer.company}</div>
                            {/if}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900 dark:text-white">{customer.email}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {customer.type === 'business' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}">
                          {customer.type === 'business' ? 'Bedrijf' : 'Particulier'}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex flex-wrap gap-1">
                          {#each customer.tags as tag}
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {tag}
                            </span>
                          {/each}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {customer.events?.length || 0}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          on:click={() => toggleEmailComposer(customer)}
                          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mr-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z"/>
                          </svg>
                        </button>
                        <button 
                          on:click={() => viewCustomerDetails(customer)}
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
          </div>
        {/if}
        
        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="flex justify-center mt-6">
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
        {/if}
      {/if}
    {/if}
  </div>
  
  <!-- Customer Details Sidebar -->
  {#if showCustomerDetails}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
      on:click={closeCustomerDetails}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'x' }}
        class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-2xl h-full overflow-y-auto z-50"
        on:click|stopPropagation
      >
        {#if selectedCustomer}
          <div class="p-6">
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Klantgegevens</h2>
              <button 
                on:click={closeCustomerDetails}
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Customer Profile -->
            <div class="mt-6 flex flex-col sm:flex-row sm:items-center">
              <div class="flex-shrink-0 h-24 w-24 rounded-full {getRandomColor(selectedCustomer.name)} flex items-center justify-center text-3xl font-medium">
                {getInitials(selectedCustomer.name)}
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h3>
                <div class="mt-1 flex items-center flex-wrap gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {selectedCustomer.type === 'business' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}">
                    {selectedCustomer.type === 'business' ? 'Bedrijf' : 'Particulier'}
                  </span>
                  {#if selectedCustomer.marketingConsent}
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Marketing opt-in
                    </span>
                  {/if}
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Klant sinds {formatDate(selectedCustomer.created)}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Quick Action Buttons -->
            <div class="mt-6 flex flex-wrap gap-3">
              <button 
                on:click={() => toggleEmailComposer(selectedCustomer)}
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z"/>
                </svg>
                E-mail versturen
              </button>
              <button class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3m3-10H5V5h10z"/>
                </svg>
                Nieuwe boeking
              </button>
              <button class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/>
                </svg>
                Bewerken
              </button>
            </div>
            
            <!-- Customer Info Tabs -->
            <div class="mt-8">
              <div class="border-b border-gray-200 dark:border-gray-700">
                <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                  <button 
                    class="py-3 border-b-2 font-medium text-sm whitespace-nowrap 
                    border-blue-500 text-blue-600 dark:text-blue-400" 
                  >
                    Overzicht
                  </button>
                  <button 
                    class="py-3 border-b-2 font-medium text-sm whitespace-nowrap 
                    border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 
                    dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600" 
                  >
                    Boekingen
                  </button>
                  <button 
                    class="py-3 border-b-2 font-medium text-sm whitespace-nowrap 
                    border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 
                    dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600" 
                  >
                    Communicatie
                  </button>
                  <button 
                    class="py-3 border-b-2 font-medium text-sm whitespace-nowrap 
                    border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 
                    dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600" 
                  >
                    Notities
                  </button>
                </nav>
              </div>
              
              <!-- Overview Tab -->
              <div class="mt-6 space-y-6">
                <!-- Contact Information -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Contactinformatie</h3>
                  <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 space-y-3">
                    <div class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">E-mail</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">Telefoon</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    {#if selectedCustomer.company}
                      <div class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 7V3H2v18h20V7zm-2 12H4v-2h6zm0-4H4v-2h6zm0-4H4V9h6zm0-4H4V5h6zm10 12h-8V9h8z"/>
                        </svg>
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">Bedrijf</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.company}</p>
                        </div>
                      </div>
                    {/if}
                    <div class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/>
                        <path fill="currentColor" d="M12 11.5a2.5 2.5 0 0 0 0-5a2.5 2.5 0 0 0 0 5z"/>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">Adres</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Tags -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
                  <div class="flex flex-wrap gap-2">
                    {#each selectedCustomer.tags as tag}
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {tag}
                      </span>
                    {/each}
                    <button class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Tag toevoegen
                    </button>
                  </div>
                </div>
                
                <!-- Recent Bookings -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recente boekingen</h3>
                    <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      Alle bekijken
                    </button>
                  </div>
                  
                  {#if !selectedCustomer.events || selectedCustomer.events.length === 0}
                    <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 text-center">
                      <p class="text-gray-600 dark:text-gray-400">Nog geen boekingen voor deze klant.</p>
                      <button class="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Nieuwe boeking aanmaken
                      </button>
                    </div>
                  {:else}
                    <div class="space-y-3">
                      {#each selectedCustomer.events.slice(0, 3) as event}
                        <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-sm font-medium text-gray-900 dark:text-white">{event.type}</p>
                              <p class="text-sm text-gray-600 dark:text-gray-400">{formatDate(event.date)}</p>
                            </div>
                            <div>
                              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium 
                                {event.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                                event.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}"
                              >
                                {event.status === 'confirmed' ? 'Bevestigd' : 
                                 event.status === 'pending' ? 'In afwachting' : 
                                 event.status === 'completed' ? 'Voltooid' : event.status}
                              </span>
                              <p class="text-sm font-medium text-gray-900 dark:text-white mt-1 text-right">{formatCurrency(event.amount)}</p>
                            </div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
                
                <!-- Notes -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Notities</h3>
                  <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                    {#if selectedCustomer.notes}
                      <p class="text-gray-600 dark:text-gray-400">{selectedCustomer.notes}</p>
                    {:else}
                      <p class="text-gray-500 dark:text-gray-500 italic">Geen notities beschikbaar.</p>
                    {/if}
                  </div>
                  <div class="mt-3">
                    <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      Notitie toevoegen
                    </button>
                  </div>
                </div>
                
                <!-- Communication History -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Communicatiegeschiedenis</h3>
                    <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      Alles bekijken
                    </button>
                  </div>
                  
                  <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Laatste contact: {formatDate(selectedCustomer.lastContact)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Create Customer Modal -->
  {#if showCreateCustomer}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
      on:click={toggleCreateCustomer}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'y' }}
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
        on:click|stopPropagation
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nieuwe Klant Toevoegen</h2>
          <button 
            on:click={toggleCreateCustomer}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Customer Form -->
        <form class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Basisinformatie</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="customer-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type klant</label>
                <select
                  id="customer-type"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="individual">Particulier</option>
                  <option value="business">Bedrijf</option>
                </select>
              </div>
              <div>
                <label for="customer-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naam</label>
                <input
                  type="text"
                  id="customer-name"
                  placeholder="Volledige naam of bedrijfsnaam"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="md:col-span-2">
                <label for="company-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrijfsnaam (indien van toepassing)</label>
                <input
                  type="text"
                  id="company-name"
                  placeholder="Bedrijfsnaam"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Contactgegevens</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div class="md:col-span-2">
              <label for="customer-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adres</label>
              <input
                type="text"
                id="customer-address"
                placeholder="Straat, huisnummer, postcode, stad"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <!-- Tags -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-md font-medium text-gray-900 dark:text-white">Tags</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Selecteer relevante tags</p>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each tags as tag}
              <label class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium 
                border cursor-pointer transition-colors
                {selectedTags.includes(tag) 
                  ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'}"
              >
                <input type="checkbox" class="sr-only" value={tag} on:change={(e) => {
                  if (e.target.checked) {
                    selectedTags = [...selectedTags, tag];
                  } else {
                    selectedTags = selectedTags.filter(t => t !== tag);
                  }
                }} />
                {tag}
              </label>
            {/each}
            <button class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Nieuwe tag
            </button>
          </div>
        </div>
        
        <!-- Additional Information -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Aanvullende informatie</h3>
          <div class="space-y-4">
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notities</label>
              <textarea
                id="notes"
                rows="3"
                placeholder="Belangrijke informatie over deze klant"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                id="marketing-consent"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label for="marketing-consent" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Deze klant heeft toestemming gegeven voor marketing communicatie
              </label>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            on:click={toggleCreateCustomer}
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuleren
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Klant opslaan
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Email Composer Modal -->
{#if showEmailComposer}
  <div 
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
    on:click={closeEmailComposer}
  >
    <div 
      transition:slide={{ duration: 300, axis: 'y' }}
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
      on:click|stopPropagation
    >
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">E-mail naar {selectedCustomer?.name || ''}</h2>
        <button 
          on:click={closeEmailComposer}
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Email Form -->
      <form class="space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email-to" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aan</label>
            <input
              type="email"
              id="email-to"
              value={selectedCustomer?.email || ''}
              readonly
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
          
          <div>
            <label for="email-subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Onderwerp</label>
            <input
              type="text"
              id="email-subject"
              placeholder="Onderwerp van de e-mail"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="email-template" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Template</label>
              <button 
                type="button" 
                class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                on:click={() => emailTemplate = ''}
              >
                Wissen
              </button>
            </div>
            <select
              id="email-template"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-2"
              on:change={(e) => loadEmailTemplate(e.target.value)}
            >
              <option value="">Selecteer een template</option>
              {#each emailTemplates as template}
                <option value={template.id}>{template.name} - {template.subject}</option>
              {/each}
            </select>
          </div>
          
          <div>
            <label for="email-body" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bericht</label>
            <textarea
              id="email-body"
              rows="10"
              bind:value={emailTemplate}
              placeholder="Typ hier je bericht..."
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input
              type="checkbox"
              id="send-copy"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            />
            <label for="send-copy" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Stuur een kopie naar mijzelf
            </label>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            class="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Opslaan als concept
          </button>
          <button 
            type="submit" 
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"/>
            </svg>
            Versturen
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Customer Analytics Section (Expandable) -->
<button class="w-full mt-8 flex justify-between items-center text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
  <h2 class="text-lg font-medium text-gray-900 dark:text-white">Klantanalyse en -inzichten</h2>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24">
    <path fill="currentColor" d="M16.59 8.59L12 13.17L7.41 8.59L6 10l6 6l6-6z"/>
  </svg>
</button>

<div class="mt-4 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
  <!-- Customer by Type Chart -->
  <div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Klanten per type</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pie Chart Visualization -->
      <div class="flex items-center justify-center">
        <div class="relative w-48 h-48">
          <!-- Simple pie chart visualization, would use a real chart library in production -->
          <div class="absolute inset-0 rounded-full overflow-hidden">
            <div class="absolute inset-0 bg-blue-500 dark:bg-blue-400"></div>
            <div class="absolute inset-0 origin-center rotate-[120deg] bg-purple-500 dark:bg-purple-400"></div>
            <div class="absolute inset-0 origin-center rotate-[300deg] bg-yellow-500 dark:bg-yellow-400"></div>
            <div class="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 scale-[0.7]"></div>
          </div>
        </div>
      </div>
      
      <!-- Legend and Stats -->
      <div class="space-y-3">
        {#each customerAnalytics.customersByType as item}
          <div class="flex items-center">
            <div class="w-4 h-4 rounded-full mr-3 
              {item.type === 'Bruiloft' ? 'bg-blue-500 dark:bg-blue-400' : 
               item.type === 'Bedrijfsfeest' ? 'bg-purple-500 dark:bg-purple-400' : 
               item.type === 'Verjaardag' ? 'bg-yellow-500 dark:bg-yellow-400' : 
               'bg-green-500 dark:bg-green-400'}"
            ></div>
            <div class="flex-1">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{item.type}</span>
                <span class="text-sm text-gray-700 dark:text-gray-300">{item.count} klanten</span>
              </div>
              <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                <div class="h-full rounded-full 
                  {item.type === 'Bruiloft' ? 'bg-blue-500 dark:bg-blue-400' : 
                   item.type === 'Bedrijfsfeest' ? 'bg-purple-500 dark:bg-purple-400' : 
                   item.type === 'Verjaardag' ? 'bg-yellow-500 dark:bg-yellow-400' : 
                   'bg-green-500 dark:bg-green-400'}"
                  style="width: {item.percentage}%"
                ></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <!-- Customer Growth Chart -->
  <div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Klantengroei</h3>
    <div class="h-64">
      <!-- Simple bar chart visualization -->
      <div class="flex h-full items-end space-x-2">
        {#each customerAnalytics.customerGrowth as item}
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative" style="height: {(item.count / Math.max(...customerAnalytics.customerGrowth.map(i => i.count))) * 100}%">
              <div class="absolute inset-0 bg-blue-500 dark:bg-blue-400 opacity-30 rounded-t-sm"></div>
              <div class="absolute bottom-0 left-0 right-0 bg-blue-500 dark:bg-blue-400 h-1"></div>
              <div class="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                {item.count}
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.month}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <!-- Customer Insights -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Customer Suggestions -->
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5">
      <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">Klantinzichten</h3>
      <ul class="space-y-3">
        <li class="flex items-start">
          <div class="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center text-white dark:text-blue-900 text-xs font-bold">
            !
          </div>
          <p class="ml-3 text-sm text-blue-800 dark:text-blue-200">3 klanten hebben binnenkort hun verjaardag. Stuur een felicitatie en kortingsbon.</p>
        </li>
        <li class="flex items-start">
          <div class="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center text-white dark:text-blue-900 text-xs font-bold">
            !
          </div>
          <p class="ml-3 text-sm text-blue-800 dark:text-blue-200">5 klanten hebben meer dan 6 maanden geen boeking geplaatst. Overweeg een heractivatie campagne.</p>
        </li>
        <li class="flex items-start">
          <div class="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center text-white dark:text-blue-900 text-xs font-bold">
            !
          </div>
          <p class="ml-3 text-sm text-blue-800 dark:text-blue-200">Bedrijfsklanten geven gemiddeld 35% meer uit dan particulieren. Focus op het aantrekken van meer zakelijke evenementen.</p>
        </li>
      </ul>
    </div>
    
    <!-- Customer Satisfaction -->
    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-5">
      <h3 class="text-lg font-medium text-green-900 dark:text-green-100 mb-3">Klanttevredenheid</h3>
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-green-800 dark:text-green-200">Gemiddelde beoordeling</span>
        <div class="flex">
          {#each Array(5) as _, i}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          {/each}
          <span class="ml-2 text-sm font-medium text-green-800 dark:text-green-200">4.3/5</span>
        </div>
      </div>
      <div class="space-y-2">
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-green-800 dark:text-green-200">5 sterren</span>
            <span class="text-green-800 dark:text-green-200">62%</span>
          </div>
          <div class="h-2 w-full bg-green-200 dark:bg-green-800 rounded-full">
            <div class="h-full bg-yellow-400 rounded-full" style="width: 62%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-green-800 dark:text-green-200">4 sterren</span>
            <span class="text-green-800 dark:text-green-200">25%</span>
          </div>
          <div class="h-2 w-full bg-green-200 dark:bg-green-800 rounded-full">
            <div class="h-full bg-yellow-400 rounded-full" style="width: 25%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-green-800 dark:text-green-200">3 sterren</span>
            <span class="text-green-800 dark:text-green-200">10%</span>
          </div>
          <div class="h-2 w-full bg-green-200 dark:bg-green-800 rounded-full">
            <div class="h-full bg-yellow-400 rounded-full" style="width: 10%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-green-800 dark:text-green-200">2 sterren</span>
            <span class="text-green-800 dark:text-green-200">3%</span>
          </div>
          <div class="h-2 w-full bg-green-200 dark:bg-green-800 rounded-full">
            <div class="h-full bg-yellow-400 rounded-full" style="width: 3%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-green-800 dark:text-green-200">1 ster</span>
            <span class="text-green-800 dark:text-green-200">0%</span>
          </div>
          <div class="h-2 w-full bg-green-200 dark:bg-green-800 rounded-full">
            <div class="h-full bg-yellow-400 rounded-full" style="width: 0%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>