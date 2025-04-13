<!-- src/lib/components/dashboard/bookings/Table.svelte -->
<script>
  export let filteredBookings = [];
  export let itemsPerPage = 10;
  export let currentPage = 1;
  export let viewBookingDetails;
  export let editBooking;

  console.log(filteredBookings);
  // Calculate total pages based on filtered bookings
  $: totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Get the current page of bookings
  $: paginatedBookings = getPaginatedBookings(
    filteredBookings,
    currentPage,
    itemsPerPage,
  );

  function getPaginatedBookings(bookings, page, perPage) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return bookings.slice(start, end);
  }

  // Format date to Dutch locale if valid date
  function formatDate(date) {
    try {
      if (!date) return "Onbekend";
      
      // If it's already a Date object, use it directly
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) return "Ongeldige datum";

      return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Date formatting error:", error, "for date:", date);
      return "Fout bij formatteren";
    }
  }

  // Format time from a date object
  function formatTime(date) {
    try {
      if (!date) return "?";
      
      // If it's already a Date object, use it directly
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) return "?";

      return new Intl.DateTimeFormat("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error("Time formatting error:", error, "for date:", date);
      return "?";
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "accepted":
        return "Bevestigd";
      case "pending":
        return "In afwachting";
      case "cancelled":
        return "Geannuleerd";
      case "completed":
        return "Voltooid";
      default:
        return status;
    }
  }

  function getPaymentStatusClass(status) {
    switch (status) {
      case "final_paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "not_paid":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "final_pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  function getPaymentStatusLabel(status) {
    switch (status) {
      case "final_paid":
        return "Volledig betaald";
      case "not_paid":
        return "Niet betaald";
      case "final_pending":
        return "Aanbetaling voldaan";
      default:
        return status;
    }
  }

  // Calculate end time based on start time and duration
  function calculateEndTime(eventDate, duration) {
    try {
      console.log("event Date:" + eventDate + " Duration: " + duration)
      if (!eventDate || !duration) return "?";
      
      const date = new Date(eventDate);
      if (isNaN(date.getTime())) return "?";
      
      // Extract duration hours (e.g., "3u" → 3)
      const durationMatch = duration.match(/(\d+)u/);
      if (!durationMatch || !durationMatch[1]) return "?";
      
      const durationHours = parseInt(durationMatch[1], 10);
      
      // Create a new date object for end time
      const endDate = new Date(date);
      endDate.setHours(date.getHours() + durationHours);
      
      return formatTime(endDate);
    } catch (error) {
      console.error("End time calculation error:", error);
      return "?";
    }
  }
</script>

<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead class="bg-gray-50 dark:bg-gray-900/30">
      <tr>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Klant</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Event</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Datum & Tijd</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Status</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Prijs</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Betaling</th
        >
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >Actie</th
        >
      </tr>
    </thead>
    <tbody
      class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
    >
      {#each paginatedBookings as booking}
        <tr
          class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div
                class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium"
              >
                {booking.customer?.name
                  ? booking.customer.name
                      .split(" ")
                      .map((part) => part[0] || "")
                      .join("")
                  : "?"}
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {booking.customer?.name || "Onbekend"}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {booking.customer?.email || ""}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900 dark:text-white">
              {booking.event_type || "Onbekend"}
            </div>
            <div
              class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]"
            >
              {booking.event_location || ""}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">
              {formatDate(booking.event_date)}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(booking.event_date)} - {calculateEndTime(booking.event_date, booking.event_duration)}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusClass(
                booking.status || 'pending',
              )}"
            >
              {getStatusLabel(booking.status || "pending")}
            </span>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
          >
            €{typeof booking.total_price === "number"
              ? booking.total_price.toFixed(2)
              : "0.00"}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getPaymentStatusClass(
                booking.payment_status || 'not_paid',
              )}"
            >
              {getPaymentStatusLabel(booking.payment_status || "not_paid")}
            </span>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <button
              on:click={() => viewBookingDetails(booking)}
              class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
            >
              Details
            </button>
            <button
              on:click={() => editBooking(booking)}
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Bewerken
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

{#if totalPages > 1}
  <div
    class="bg-gray-50 dark:bg-gray-900/30 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6"
  >
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Resultaten <span class="font-medium"
            >{(currentPage - 1) * itemsPerPage + 1}</span
          >
          tot
          <span class="font-medium"
            >{Math.min(
              currentPage * itemsPerPage,
              filteredBookings.length,
            )}</span
          >
          van
          <span class="font-medium">{filteredBookings.length}</span> boekingen
        </p>
      </div>
      <div>
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            on:click={() => (currentPage = Math.max(1, currentPage - 1))}
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={currentPage === 1}
          >
            <span class="sr-only">Vorige</span>
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          {#each Array(totalPages) as _, index}
            <button
              on:click={() => (currentPage = index + 1)}
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium
                          {currentPage === index + 1
                ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}"
            >
              {index + 1}
            </button>
          {/each}
          <button
            on:click={() =>
              (currentPage = Math.min(totalPages, currentPage + 1))}
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={currentPage === totalPages}
          >
            <span class="sr-only">Volgende</span>
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
{/if}