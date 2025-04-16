<!-- src/routes/dashboard/klanten/+page.svelte -->
<script>
  import { onMount } from "svelte";
  import CustomerList from "$lib/components/dashboard/customers/CustomerList.svelte";
  import CustomerFilters from "$lib/components/dashboard/customers/CustomerFilters.svelte";
  import CustomerDetails from "$lib/components/dashboard/customers/CustomerDetails.svelte";
  import CustomerForm from "$lib/components/dashboard/customers/CustomerForm.svelte";
  import EmailComposer from "$lib/components/dashboard/customers/EmailComposer.svelte";
  import CustomerEditDrawer from "$lib/components/dashboard/customers/CustomerEditDrawer.svelte";
  import { fade } from "svelte/transition";
  // Props van SvelteKit
  export let data;
  export let form;
  // State management
  let isLoading = true;
  let customers = [];
  let filteredCustomers = [];
  let selectedCustomer = null;
  let showCustomerDetails = false;
  let showCreateCustomer = false;
  let showEditCustomer = false;
  let showEmailComposer = false;
  let selectedCustomers = []; // For bulk actions
  let searchQuery = "";
  let selectedFilter = "all";
  let selectedSort = "name_asc";

  onMount(async () => {
    // Als de data beschikbaar is van de server, deze gebruiken
    if (data.customers) {
      customers = data.customers;
      applyFilters();
    } else {
      await loadCustomers();
    }
    isLoading = false;
  });

  async function loadCustomers() {
    // Dit is een fallback als de server-side data niet beschikbaar is
    // In een echte implementatie zou je een API call maken
    customers = [];
    applyFilters();
  }

  function selectAllCustomers(event) {
    selectedCustomers = event.detail;
  }

  function deselectAllCustomers() {
    selectedCustomers = [];
  }

  function applyFilters() {
    let results = [...customers];

    // Apply type filter
    if (selectedFilter === "business") {
      results = results.filter((customer) => customer.company_name);
    } else if (selectedFilter === "individual") {
      results = results.filter((customer) => !customer.company_name);
    } else if (selectedFilter === "with_events") {
      results = results.filter(
        (customer) => customer.reservations && customer.reservations.length > 0,
      );
    } else if (selectedFilter === "no_events") {
      results = results.filter(
        (customer) =>
          !customer.reservations || customer.reservations.length === 0,
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (customer) =>
          `${customer.first_name} ${customer.last_name}`
            .toLowerCase()
            .includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          (customer.company_name &&
            customer.company_name.toLowerCase().includes(query)),
      );
    }

    // Apply sort
    switch (selectedSort) {
      case "name_asc":
        results.sort((a, b) =>
          `${a.last_name} ${a.first_name}`.localeCompare(
            `${b.last_name} ${b.first_name}`,
          ),
        );
        break;
      case "name_desc":
        results.sort((a, b) =>
          `${b.last_name} ${b.first_name}`.localeCompare(
            `${a.last_name} ${a.first_name}`,
          ),
        );
        break;
      case "date_asc":
        results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "date_desc":
        results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "value_asc":
        results.sort((a, b) => getTotalValue(a) - getTotalValue(b));
        break;
      case "value_desc":
        results.sort((a, b) => getTotalValue(b) - getTotalValue(a));
        break;
    }

    filteredCustomers = results;
  }

  function getTotalValue(customer) {
    return customer.reservations
      ? customer.reservations.reduce(
          (sum, res) => sum + Number(res.total_price),
          0,
        )
      : 0;
  }

  function viewCustomerDetails(customer) {
    // Wis alle selecties behalve de huidige klant
    deselectAllExcept(customer);
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

  function editCustomer(customer) {
    // Wis alle selecties behalve de huidige klant
    deselectAllExcept(customer);
    selectedCustomer = customer;
    showEditCustomer = true;
  }

  function closeEditCustomer() {
    showEditCustomer = false;
    setTimeout(() => {
      selectedCustomer = null;
    }, 300);
  }

  // Helper functie om alle klanten te deselecteren behalve de opgegeven klant
  function deselectAllExcept(customer) {
    // Als er geen klant is opgegeven, deselecteer alles
    if (!customer) {
      selectedCustomers = [];
      return;
    }

    // Anders, houd alleen de opgegeven klant geselecteerd
    selectedCustomers = [customer];
  }

  // Speciale functie voor de bulk email knop bovenaan
  function openEmailComposer() {
    if (selectedCustomers.length === 0) {
      alert("Selecteer eerst een of meerdere klanten");
      return;
    }

    // Toon de email composer
    showEmailComposer = true;
  }

  // Algemene functie voor email composer openen
  function toggleEmailComposer(isMultiple = false) {
    if (isMultiple) {
      if (selectedCustomers.length === 0) {
        alert("Selecteer eerst een of meerdere klanten");
        return;
      }
    } else {
      if (!selectedCustomer) {
        alert("Selecteer eerst een klant");
        return;
      }

      // Zorg ervoor dat alleen de huidige klant geselecteerd is
      if (!selectedCustomers.some((c) => c.id === selectedCustomer.id)) {
        deselectAllExcept(selectedCustomer);
      }
    }
    showEmailComposer = true;
  }

  function closeEmailComposer() {
    showEmailComposer = false;
  }

  function handleEmailSubmit(event) {
    const result = event.detail;

    if (result.success) {
      // Sluit de email composer
      closeEmailComposer();

      // Toon een notificatie
      alert(result.message || "E-mail succesvol verzonden!");
    }
  }

  function toggleCustomerSelection(customer) {
    const index = selectedCustomers.findIndex((c) => c.id === customer.id);
    if (index === -1) {
      selectedCustomers = [...selectedCustomers, customer];
    } else {
      selectedCustomers = selectedCustomers.filter((c) => c.id !== customer.id);
    }
  }

  function handleSearchChange(e) {
    searchQuery = e.target.value;
    applyFilters();
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

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Klanten</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        Beheer en analyseer al je klantrelaties
      </p>
    </div>

    <!-- Modified buttons container for full-width on mobile -->
    <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <button
        on:click={toggleCreateCustomer}
        class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-colors shadow-sm w-full sm:w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2 flex-shrink-0"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 5v14m-7-7h14"
          />
        </svg>
        <span class="whitespace-nowrap">Nieuwe Klant</span>
      </button>

      <!-- De bulk email knop - nu met een directe event handler -->
      <button
        on:click={openEmailComposer}
        disabled={selectedCustomers.length === 0}
        class="inline-flex items-center justify-center px-4 py-2 {selectedCustomers.length ===
        0
          ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
          : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'} font-medium rounded-lg
          border border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-colors shadow-sm w-full sm:w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2 flex-shrink-0"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z"
          />
        </svg>
        <span class="whitespace-nowrap">
          {selectedCustomers.length === 0
            ? "Selecteer klanten"
            : selectedCustomers.length === 1
              ? "E-mail versturen"
              : `Verstuur bulk e-mail (${selectedCustomers.length})`}
        </span>
      </button>
    </div>
  </div>

  <!-- Filters -->
  <CustomerFilters
    bind:searchQuery
    bind:selectedFilter
    bind:selectedSort
    on:search={applyFilters}
    on:filterChange={applyFilters}
    on:sortChange={applyFilters}
  />

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
        Klanten laden...
      </p>
    </div>
  {:else}
    <!-- Customer List -->
    <CustomerList
      customers={filteredCustomers}
      {selectedCustomers}
      on:viewDetails={(e) => viewCustomerDetails(e.detail)}
      on:toggleSelection={(e) => toggleCustomerSelection(e.detail)}
      on:selectAll={selectAllCustomers}
      on:deselectAll={deselectAllCustomers}
      on:emailCustomer={(e) => {
        // Wis alle selecties behalve de huidige klant
        deselectAllExcept(e.detail);
        selectedCustomer = e.detail;
        toggleEmailComposer();
      }}
      on:editCustomer={(e) => editCustomer(e.detail)}
      {formatCurrency}
      {formatDate}
    />
  {/if}
</div>

<!-- Customer Details Modal -->
{#if showCustomerDetails && selectedCustomer}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
    on:click={closeCustomerDetails}
  >
    <CustomerDetails
      customer={selectedCustomer}
      on:close={closeCustomerDetails}
      on:email={() => toggleEmailComposer()}
      {formatCurrency}
      {formatDate}
    />
  </div>
{/if}

<!-- Customer Edit Drawer -->
{#if showEditCustomer && selectedCustomer}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex"
    on:click={closeEditCustomer}
  >
    <CustomerEditDrawer
      customer={selectedCustomer}
      {form}
      on:close={closeEditCustomer}
    />
  </div>
{/if}

<!-- Create Customer Modal -->
{#if showCreateCustomer}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
    on:click={toggleCreateCustomer}
  >
    <CustomerForm on:close={toggleCreateCustomer} {form} />
  </div>
{/if}

<!-- Email Composer Modal -->
{#if showEmailComposer}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
    on:click={closeEmailComposer}
  >
    <EmailComposer
      recipients={selectedCustomers.length > 0
        ? selectedCustomers
        : [selectedCustomer]}
      on:close={closeEmailComposer}
      on:submit={handleEmailSubmit}
    />
  </div>
{/if}
