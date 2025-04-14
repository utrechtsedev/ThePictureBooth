<!-- src/routes/dashboard/boekingen/+page.svelte -->
<script>
  import { onMount } from "svelte";
  export let data;
  import Table from "$lib/components/dashboard/bookings/Table.svelte";
  import Calendar from "$lib/components/dashboard/bookings/Calendar.svelte";
  import BookingForm from "$lib/components/dashboard/bookings/BookingForm.svelte";
  import BookingDetailsPanel from "$lib/components/dashboard/bookings/BookingDetailsPanel.svelte";
  import EditBooking from "$lib/components/dashboard/bookings/EditBooking.svelte";
  import BookingFilter from "$lib/components/dashboard/bookings/BookingFilter.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import NoBookings from "$lib/components/dashboard/bookings/NoBookings.svelte";
  import PageHeader from "$lib/components/dashboard/bookings/PageHeader.svelte";

  // State management
  let bookings = [];
  let filteredBookings = [];
  let isLoading = true;
  let selectedBooking = null;
  let editingBooking = null;
  let showDetailsPanel = false;
  let showCreateForm = false;
  let showEditForm = false;
  let selectedView = "list"; // 'list' or 'calendar'
  let selectedFilter = "all"; // 'all', 'upcoming', 'completed', 'cancelled'
  let searchQuery = "";
  let currentMonth = new Date();

  // Pagination state
  let currentPage = 1;
  let itemsPerPage = 10;

  // Initialize with data
  onMount(async () => {
    await loadBookings();
    isLoading = false;
  });

  async function loadBookings() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Data from server
    bookings = data.bookings;

    applyFilters();
  }

  function applyFilters() {
    let results = [...bookings];

    // Apply status filter
    if (selectedFilter === "upcoming") {
      results = results.filter(
        (booking) =>
          booking.status === "accepted" &&
          new Date(booking.event_date) >= new Date(),
      );
    } else if (selectedFilter === "completed") {
      results = results.filter((booking) => booking.status === "completed");
    } else if (selectedFilter === "cancelled") {
      results = results.filter((booking) => booking.status === "cancelled");
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (booking) =>
          booking.customer.name.toLowerCase().includes(query) ||
          booking.event_type.toLowerCase().includes(query) ||
          booking.event_location.toLowerCase().includes(query),
      );
    }

    // Sort by date
    results.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    filteredBookings = results;

    // Reset to first page when filters change
    currentPage = 1;
  }

  function handleViewChange(newView) {
    selectedView = newView;
  }

  function handleFilterChange(newFilter) {
    selectedFilter = newFilter;
    applyFilters();
  }

  function handleSearchChange(newQuery) {
    searchQuery = newQuery;
    applyFilters();
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

  function editBooking(booking) {
    editingBooking = booking;
    showEditForm = true;

    // Close details panel if it's open
    if (showDetailsPanel) {
      closeDetails();
    }
  }

  function closeEditForm() {
    showEditForm = false;
    setTimeout(() => {
      editingBooking = null;
    }, 300);
  }

  function handleSaveEdit(updatedBooking) {
    // Update the booking in the bookings array
    const index = bookings.findIndex((b) => b.id === updatedBooking.id);
    if (index !== -1) {
      bookings[index] = updatedBooking;
      // Re-apply filters to update the view
      applyFilters();
    }


    // Close the edit form
    closeEditForm();
  }

  function toggleCreateForm() {
    showCreateForm = !showCreateForm;
  }

  function handleFormSubmit(newBooking) {
    // If newBooking exists, add it to the bookings array
    if (newBooking) {
      // Create a defensive copy with guaranteed structure
      const formattedBooking = {
        ...newBooking,
        // Ensure total_price is a number
        total_price:
          typeof newBooking.total_price === "number"
            ? newBooking.total_price
            : parseFloat(newBooking.total_price || 0),

        // Ensure customer property exists and has required fields
        customer: {
          name: newBooking.customer?.name || "Onbekende Klant",
          email: newBooking.customer?.email || "",
          phone: newBooking.customer?.phone || "",
          id: newBooking.customer?.id || newBooking.customer_id || "",
        },
      };

      // Add to bookings array
      bookings = [...bookings, formattedBooking];

      // Re-apply filters to update the filtered bookings in the view
      applyFilters();

      // Log success message
    }

    // Close the form
    showCreateForm = false;
  }
</script>

<div class="space-y-6">
  <!-- Page Header Component -->
  <PageHeader
    title="Boekingen"
    subtitle="Bekijk en beheer al je foto booth reserveringen"
    buttonText="Nieuwe Boeking"
    onButtonClick={toggleCreateForm}
  />

  <!-- Filters Component -->
  <BookingFilter
    bind:selectedView
    bind:selectedFilter
    bind:searchQuery
    onViewChange={handleViewChange}
    onFilterChange={handleFilterChange}
    onSearchChange={handleSearchChange}
  />

  {#if isLoading}
    <LoadingSpinner />
  {:else if selectedView === "list"}
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {#if filteredBookings.length === 0}
        <NoBookings onCreateBooking={toggleCreateForm} />
      {:else}
        <Table
          {filteredBookings}
          {itemsPerPage}
          bind:currentPage
          {viewBookingDetails}
          {editBooking}
        />
      {/if}
    </div>
  {:else}
    <!-- Calendar View Component -->
    <Calendar {filteredBookings} bind:currentMonth {viewBookingDetails} />
  {/if}
</div>

<!-- Booking Details Panel Component -->
<BookingDetailsPanel
  show={showDetailsPanel}
  booking={selectedBooking}
  onClose={closeDetails}
/>

<!-- Edit Booking Form Component -->
<EditBooking
  show={showEditForm}
  booking={editingBooking}
  onClose={closeEditForm}
  onSave={handleSaveEdit}
/>

<!-- New Booking Form Component -->
<BookingForm
  show={showCreateForm}
  onClose={() => (showCreateForm = false)}
  onSubmit={handleFormSubmit}
/>

