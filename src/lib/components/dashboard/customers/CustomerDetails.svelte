<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let customer;
  export let formatCurrency;
  export let formatDate;

  const dispatch = createEventDispatcher();

  function close(e) {
    e.stopPropagation();
    dispatch("close");
  }

  function email() {
    dispatch("email");
  }

  function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  function getRandomColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    ];

    return colors[Math.abs(hash) % colors.length];
  }

  function getReservationStatusLabel(status) {
    switch (status) {
      case "pending":
        return "In afwachting";
      case "accepted":
        return "Bevestigd";
      case "declined":
        return "Afgewezen";
      case "cancelled":
        return "Geannuleerd";
      case "completed":
        return "Voltooid";
      default:
        return status;
    }
  }

  function getReservationStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  function getPaymentStatusLabel(status) {
    switch (status) {
      case "deposit_paid":
        return "Aanbetaling voldaan";
      case "final_pending":
        return "Eindbetaling open";
      case "final_paid":
        return "Volledig betaald";
      default:
        return status;
    }
  }

  function getPaymentStatusColor(status) {
    switch (status) {
      case "deposit_paid":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "final_pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "final_paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "x" }}
  class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-2xl h-full overflow-y-auto z-50"
  on:click|stopPropagation
>
  <div class="p-6">
    <div class="flex justify-between items-start">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        Klantgegevens
      </h2>
      <button
        on:click={close}
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

    <!-- Customer Profile -->
    <div class="mt-6 flex flex-col sm:flex-row sm:items-center">
      <div
        class="flex-shrink-0 h-24 w-24 rounded-full {getRandomColor(
          `${customer.first_name} ${customer.last_name}`,
        )} flex items-center justify-center text-3xl font-medium"
      >
        {getInitials(customer.first_name, customer.last_name)}
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-6">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
          {customer.first_name}
          {customer.last_name}
        </h3>
        <div class="mt-1 flex items-center flex-wrap gap-2">
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-medium {customer.company_name
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}"
          >
            {customer.company_name ? "Bedrijf" : "Particulier"}
          </span>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          >
            Klant sinds {formatDate(customer.created_at)}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Action Buttons -->
    <div class="mt-6 flex flex-wrap gap-3">
      <button
        on:click={email}
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z"
          />
        </svg>
        E-mail versturen
      </button>
    </div>

    <!-- Contact Information -->
    <div class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Contactinformatie
      </h3>
      <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 space-y-3">
        <div class="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"
            />
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              E-mail
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {customer.email}
            </p>
          </div>
        </div>
        <div class="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"
            />
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              Telefoon
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {customer.phone}
            </p>
          </div>
        </div>
        {#if customer.company_name}
          <div class="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 7V3H2v18h20V7zm-2 12H4v-2h6zm0-4H4v-2h6zm0-4H4V9h6zm0-4H4V5h6zm10 12h-8V9h8z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Bedrijf
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {customer.company_name}
              </p>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Bookings -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Boekingen
        </h3>
      </div>

      {#if !customer.reservations || customer.reservations.length === 0}
        <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            Nog geen boekingen voor deze klant.
          </p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each customer.reservations as reservation}
            <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {reservation.event_type} - {formatDate(
                        reservation.event_date,
                      )}
                    </p>
                    <span
                      class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium {getReservationStatusColor(
                        reservation.status,
                      )}"
                    >
                      {getReservationStatusLabel(reservation.status)}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Locatie: {reservation.event_location}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Duur: {reservation.event_duration}
                  </p>
                </div>
                <div>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium {getPaymentStatusColor(
                      reservation.payment_status,
                    )}"
                  >
                    {getPaymentStatusLabel(reservation.payment_status)}
                  </span>
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white mt-1 text-right"
                  >
                    {formatCurrency(reservation.total_price)}
                  </p>
                  <div class="flex justify-end mt-2 space-x-1">
                    <button
                      class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Details
                    </button>
                    <span class="text-gray-400">|</span>
                    <button
                      class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    >
                      Bewerken
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Financial Summary -->
    <div class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Financieel overzicht
      </h3>
      <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Totaal aantal boekingen</span
            >
            <span class="text-sm font-medium text-gray-900 dark:text-white"
              >{customer.reservations ? customer.reservations.length : 0}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Totale omzet</span
            >
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(
                customer.reservations
                  ? customer.reservations.reduce(
                      (sum, res) => sum + Number(res.total_price),
                      0,
                    )
                  : 0,
              )}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Openstaande betalingen</span
            >
            <span
              class="text-sm font-medium text-yellow-600 dark:text-yellow-400"
            >
              {formatCurrency(
                customer.reservations
                  ? customer.reservations
                      .filter((res) => res.payment_status !== "final_paid")
                      .reduce((sum, res) => {
                        if (res.payment_status === "deposit_paid") {
                          return sum + Number(res.final_payment_amount);
                        } else if (res.payment_status === "final_pending") {
                          return sum + Number(res.final_payment_amount);
                        }
                        return sum;
                      }, 0)
                  : 0,
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
