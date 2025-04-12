<!-- src/lib/components/dashboard/bookings/BookingForm.svelte -->
<script>
  import { fade, slide } from "svelte/transition";
  import { onMount } from "svelte";

  // Props
  export let show = false;
  export let onClose = () => {};
  export let onSubmit = () => {};

  // Form state
  let formData = {
    customer_id: "",
    event_type: "",
    event_date: "",
    event_location: "",
    event_duration: "2u", // Default to 2 hours
    total_price: 250, // Default price for 2 hours
    deposit_amount: 100, // Default deposit
    final_payment_amount: 150, // 250 - 100 = 150
    payment_status: "not_paid",
    status: "pending",
    admin_notes: "",
    start_time: "12:00", // Default start time
  };

  // Form state handling
  let isSubmitting = false;
  let formError = null;
  let formSuccess = null;

  // Customer data
  let customers = [];
  let loading = true;
  let selectedCustomer = null;

  // Calculate final payment amount when total or deposit changes
  $: formData.final_payment_amount =
    parseFloat(formData.total_price || 0) -
    parseFloat(formData.deposit_amount || 0);

  // Hours options for duration dropdown
  const hoursOptions = [
    { value: "2u", label: "2 uur", price: 250 },
    { value: "3u", label: "3 uur", price: 350 },
    { value: "4u", label: "4 uur", price: 450 },
    { value: "5u", label: "5 uur", price: 550 },
    { value: "6u", label: "6 uur", price: 650 },
    { value: "7u", label: "7 uur", price: 750 },
    { value: "8u", label: "8 uur", price: 850 },
  ];

  // Update price when duration changes
  function handleDurationChange(event) {
    const duration = event.target.value;
    const selectedOption = hoursOptions.find(
      (option) => option.value === duration,
    );

    if (selectedOption) {
      formData.event_duration = duration;
      formData.total_price = selectedOption.price;
    }
  }

  // Update selected customer when customer_id changes
  $: {
    if (formData.customer_id && customers.length > 0) {
      selectedCustomer = customers.find((c) => c.id === formData.customer_id);
    } else {
      selectedCustomer = null;
    }
  }

  // Fetch customers on component mount
  onMount(async () => {
    try {
      const response = await fetch("/dashboard/klanten");
      const result = await response.json();

      if (result.success) {
        customers = result.data;
      } else {
        console.error("Failed to fetch customers:", result);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      loading = false;
    }
  });

  // Format customer display name
  function getCustomerDisplayName(customer) {
    if (customer.company_name) {
      return `${customer.first_name} ${customer.last_name} van ${customer.company_name}`;
    } else {
      return `${customer.first_name} ${customer.last_name}`;
    }
  }

  function handleClose() {
    // Reset all state
    formError = null;
    formSuccess = null;
    isSubmitting = false;
    selectedCustomer = null;

    // Reset form
    formData = {
      customer_id: "",
      event_type: "",
      event_date: "",
      event_location: "",
      event_duration: "2u",
      total_price: 250,
      deposit_amount: 100,
      final_payment_amount: 150,
      payment_status: "not_paid",
      status: "pending",
      admin_notes: "",
      start_time: "12:00",
    };

    // Call parent close handler
    onClose();
  }
  // Replace your handleSubmit function with this one
  async function handleSubmit(event) {
    event.preventDefault();
    formError = null;
    formSuccess = null;
    isSubmitting = true;

    try {
      // Validation
      if (!formData.customer_id) {
        throw new Error("Selecteer een klant");
      }

      if (!formData.event_date) {
        throw new Error("Vul een datum in");
      }

      if (!formData.event_location) {
        throw new Error("Vul een locatie in");
      }

      if (!formData.total_price || parseFloat(formData.total_price) <= 0) {
        throw new Error("Vul een geldige prijs in");
      }

      // Prepare submission data
      const submissionData = {
        customer_id: formData.customer_id,
        event_type: formData.event_type || "Onbekend",
        event_date: formData.event_date, // Just send the date string
        event_location: formData.event_location,
        event_duration: formData.event_duration,
        total_price: parseFloat(formData.total_price) || 0,
        deposit_amount: parseFloat(formData.deposit_amount) || 100,
        final_payment_amount:
          formData.final_payment_amount === 0
            ? 0
            : parseFloat(formData.final_payment_amount) || 0,
        payment_status: formData.payment_status,
        status: formData.status,
        admin_notes: formData.admin_notes,
        start_time: formData.start_time, // Send start_time separately
      };

      console.log("Submitting booking with:", {
        date: submissionData.event_date,
        time: submissionData.start_time,
        duration: submissionData.event_duration,
      });

      const response = await fetch("/dashboard/boekingen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok && result.reservation) {
        formSuccess = "Boeking succesvol aangemaakt!";

        // Create a proper customer object that won't cause errors
        const customerObject = {
          name: selectedCustomer
            ? selectedCustomer.name ||
              `${selectedCustomer.first_name || ""} ${selectedCustomer.last_name || ""}`.trim()
            : "Onbekende Klant",
          email: selectedCustomer ? selectedCustomer.email || "" : "",
          phone: selectedCustomer ? selectedCustomer.phone || "" : "",
          id: formData.customer_id,
        };

        // Prepare the booking in the right format for the Table component
        const formattedBooking = {
          ...result.reservation,
          date: result.reservation.event_date,
          location: result.reservation.event_location,
          eventType: result.reservation.event_type,
          startTime: formData.start_time,
          duration: result.reservation.event_duration,
          notes: result.reservation.admin_notes,
          paymentStatus: result.reservation.payment_status,
          price: parseFloat(result.reservation.total_price) || 0,
          status:
            result.reservation.status === "accepted"
              ? "confirmed"
              : result.reservation.status,
          // Add customer objects with guaranteed structure
          customer: customerObject,
          Customer: customerObject,
        };

        // Pass the formatted booking to the parent
        onSubmit(formattedBooking);

        // Close form immediately
        isSubmitting = false;
        handleClose();
      } else {
        throw new Error(
          result.message ||
            "Er is een fout opgetreden bij het aanmaken van de boeking",
        );
      }
    } catch (error) {
      formError = error.message;
      console.error("Error submitting form:", error);
      isSubmitting = false;
    }
  }
</script>

{#if show}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
    on:click={handleClose}
  >
    <div
      transition:slide={{ duration: 300, axis: "y" }}
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-4 sm:p-6"
      on:click|stopPropagation
    >
      <div class="flex justify-between items-start mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Nieuwe Boeking Toevoegen
        </h2>
        <button
          type="button"
          on:click={handleClose}
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

      {#if formError}
        <div
          class="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
        >
          {formError}
        </div>
      {/if}

      {#if formSuccess}
        <div
          class="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
        >
          {formSuccess}
        </div>
      {/if}

      <!-- Booking Form -->
      <form class="space-y-4 sm:space-y-6" on:submit={handleSubmit}>
        <!-- Customer Selection -->
        <div>
          <h3
            class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3"
          >
            Klantgegevens
          </h3>
          <div>
            <label
              for="customer-select"
              class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Selecteer Klant</label
            >
            <select
              id="customer-select"
              bind:value={formData.customer_id}
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loading || isSubmitting}
            >
              <option value="">Selecteer een klant</option>
              {#each customers as customer}
                <option value={customer.id}>
                  {getCustomerDisplayName(customer)}
                </option>
              {/each}
            </select>
            {#if loading}
              <p class="text-xs text-gray-500 mt-1">
                Klanten worden geladen...
              </p>
            {/if}
          </div>
        </div>

        <!-- Event Information -->
        <div>
          <h3
            class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3"
          >
            Evenement Details
          </h3>
          <div class="space-y-3 sm:space-y-4">
            <div>
              <label
                for="event-type"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Type Evenement</label
              >
              <select
                id="event-type"
                bind:value={formData.event_type}
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
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

            <!-- Date and Time in a row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div class="sm:col-span-1">
                <label
                  for="event-date"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Datum</label
                >
                <input
                  type="date"
                  id="event-date"
                  bind:value={formData.event_date}
                  class="w-full px-2 sm:px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div class="sm:col-span-1">
                <label
                  for="start-time"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Starttijd</label
                >
                <input
                  type="time"
                  id="start-time"
                  bind:value={formData.start_time}
                  step="60"
                  class="w-full px-2 sm:px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div class="sm:col-span-1">
                <label
                  for="duration"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Aantal uren</label
                >
                <select
                  id="duration"
                  bind:value={formData.event_duration}
                  on:change={handleDurationChange}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  {#each hoursOptions as option}
                    <option value={option.value}
                      >{option.label} (€{option.price})</option
                    >
                  {/each}
                </select>
              </div>
            </div>

            <div>
              <label
                for="location"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Locatie</label
              >
              <input
                type="text"
                id="location"
                bind:value={formData.event_location}
                placeholder="Adres of naam locatie"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div>
          <h3
            class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3"
          >
            Betaling
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                for="total-price"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Totaalprijs (€)</label
              >
              <input
                type="number"
                id="total-price"
                bind:value={formData.total_price}
                placeholder="0.00"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                for="deposit-amount"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Aanbetaling (€)</label
              >
              <input
                type="number"
                id="deposit-amount"
                bind:value={formData.deposit_amount}
                placeholder="100.00"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                for="final-payment"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Restbetaling (€)</label
              >
              <input
                type="number"
                id="final-payment"
                value={formData.final_payment_amount}
                placeholder="0.00"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800"
                disabled={true}
              />
            </div>
            <div>
              <label
                for="payment-status"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Betalingsstatus</label
              >
              <select
                id="payment-status"
                bind:value={formData.payment_status}
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="not_paid">Niet betaald</option>
                <option value="final_pending">Restbetaling open</option>
                <option value="final_paid">Volledig betaald</option>
              </select>
            </div>
            <div>
              <label
                for="status"
                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Status</label
              >
              <select
                id="status"
                bind:value={formData.status}
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="pending">In afwachting</option>
                <option value="accepted">Geaccepteerd</option>
                <option value="declined">Afgewezen</option>
                <option value="cancelled">Geannuleerd</option>
                <option value="completed">Voltooid</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label
            for="notes"
            class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Notities</label
          >
          <textarea
            id="notes"
            bind:value={formData.admin_notes}
            rows="3"
            placeholder="Eventuele opmerkingen of speciale wensen"
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          ></textarea>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3 sm:gap-0 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            on:click={handleClose}
            class="px-4 py-2 w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm order-2 sm:order-1"
            disabled={isSubmitting}
          >
            Annuleren
          </button>
          <button
            type="submit"
            class="px-4 py-2 w-full sm:w-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm order-1 sm:order-2 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Bezig met opslaan...
            {:else}
              Boeking Opslaan
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Safari-specific fixes */
  input,
  select,
  textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    opacity: 1;
    background-position: right center;
    background-size: 16px;
  }

  input[type="date"],
  input[type="time"],
  input[type="number"] {
    min-height: 38px;
  }
</style>

