<!-- component/BookingDetailsPanel.svelte -->
<script>
  import { fade, slide } from "svelte/transition";

  // Props
  export let show = false;
  export let booking = null;
  export let onClose = () => {};


  // Format a date in Dutch locale
  function formatDate(date) {
    if (!date) return "Onbekend";
    return new Intl.DateTimeFormat("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  // Format time from date object
  function formatTime(date) {
    if (!date) return "?";
    return new Intl.DateTimeFormat("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  // Calculate end time based on start date and duration
  function getEndTime(startDate, duration) {
    if (!startDate || !duration) return "?";
    
    // Extract duration hours (e.g., "2u" → 2)
    const durationMatch = duration.match(/(\d+)u/);
    if (!durationMatch || !durationMatch[1]) return "?";
    
    const durationHours = parseInt(durationMatch[1], 10);
    
    // Create a new date object for end time
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);
    
    return formatTime(endDate);
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
</script>

{#if show && booking}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
    on:click={onClose}
  >
    <div
      transition:slide={{ duration: 300, axis: "x" }}
      class="bg-white dark:bg-gray-800 shadow-lg w-full sm:max-w-lg h-full overflow-y-auto z-50"
      on:click|stopPropagation
    >
      <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div class="flex justify-between items-start">
          <h2
            class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
          >
            Boeking Details
          </h2>
          <button
            on:click={onClose}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center pb-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div
            class="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-lg sm:text-xl font-medium"
          >
            {booking.customer?.name
              ? booking.customer.name
                  .split(" ")
                  .map((part) => part[0] || "")
                  .join("")
              : "?"}
          </div>
          <div class="mt-3 sm:mt-0 sm:ml-4">
            <h3
              class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
            >
              {booking.customer?.name || "Onbekend"}
            </h3>
            <div class="text-gray-600 dark:text-gray-300 mt-1 space-y-1">
              <div class="flex items-center text-xs sm:text-sm break-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"
                  />
                </svg>
                {booking.customer?.email || ""}
              </div>
              <div class="flex items-center text-xs sm:text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"
                  />
                </svg>
                {booking.customer?.phone || ""}
              </div>
            </div>
            {#if booking.customer?.id}
              <a
                href="/dashboard/klanten/{booking.customer.id}"
                class="text-blue-600 dark:text-blue-400 text-xs sm:text-sm hover:underline mt-2 inline-block"
              >
                Klantprofiel bekijken
              </a>
            {/if}
          </div>
        </div>

        <div class="space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h4
                class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Evenement
              </h4>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white">
                {booking.event_type || "Onbekend"}
              </p>
            </div>
            <div>
              <h4
                class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Datum
              </h4>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white">
                {formatDate(booking.event_date)}
              </p>
            </div>
            <div>
              <h4
                class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Tijdstip
              </h4>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white">
                {formatTime(booking.event_date)} - {getEndTime(booking.event_date, booking.event_duration)}
              </p>
            </div>
            <div>
              <h4
                class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Pakket
              </h4>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white">
                {booking.package || "Standaard"}
              </p>
            </div>
          </div>

          <div>
            <h4
              class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
            >
              Locatie
            </h4>
            <p class="text-sm sm:text-base text-gray-900 dark:text-white">
              {booking.event_location || ""}
            </p>
          </div>

          <div>
            <h4
              class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
            >
              Status
            </h4>
            <div class="flex items-center">
              <span
                class="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs sm:text-sm font-medium {getStatusClass(
                  booking.status || 'pending',
                )}"
              >
                {getStatusLabel(booking.status || "pending")}
              </span>
            </div>
          </div>

          <div>
            <h4
              class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
            >
              Betaling
            </h4>
            <div class="flex items-center justify-between">
              <span
                class="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs sm:text-sm font-medium {getPaymentStatusClass(
                  booking.payment_status || 'not_paid',
                )}"
              >
                {getPaymentStatusLabel(booking.payment_status || "not_paid")}
              </span>
              <span
                class="text-sm sm:text-base text-gray-900 dark:text-white font-medium"
                >€{typeof booking.total_price === "number"
                  ? booking.total_price.toFixed(2)
                  : "0.00"}</span
              >
            </div>
          </div>

          {#if booking.admin_notes}
            <div>
              <h4
                class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Notities
              </h4>
              <p class="text-sm sm:text-base text-gray-900 dark:text-white">
                {booking.admin_notes}
              </p>
            </div>
          {/if}
        </div>

        <div
          class="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-2 sm:justify-between"
        >
          <button
            class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
          >
          <a href="">Factuur</a>
          </button>
          <div class="flex">
            <button
              on:click={onClose}
              class="w-full sm:w-auto px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-sm"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}