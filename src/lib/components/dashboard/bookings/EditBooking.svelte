<!-- src/lib/components/dashboard/bookings/EditBooking.svelte -->
<script>
  import { fade, slide } from "svelte/transition";

  // Props
  export let show = false;
  export let booking = null;
  export let onClose = () => {};
  export let onSave = () => {};
  console.log(booking);
  // Form state
  let isSubmitting = false;
  let formError = null;
  let formSuccess = null;

  // Simple form data
  let formData = {
    id: "",
    customer_id: "",
    event_type: "",
    event_date: "",
    event_time: "",
    event_location: "",
    event_duration: "",
    total_price: "",
    deposit_amount: "",
    final_payment_amount: "",
    payment_status: "",
    status: "",
    admin_notes: "",
  };

  // Customer info
  let customerInfo = { name: "", email: "", phone: "", id: "" };

  // Status mapping functions
  // This maps from frontend status to database status
  function mapStatusReverse(frontendStatus) {
    const reverseStatusMap = {
      pending: "pending",
      confirmed: "accepted", // Map frontend "confirmed" to DB "accepted"
      declined: "declined",
      cancelled: "cancelled",
      completed: "completed",
    };

    return reverseStatusMap[frontendStatus] || "pending";
  }

  // This maps from database status to frontend status
  function mapStatusToFrontend(dbStatus) {
    const statusMap = {
      pending: "pending",
      accepted: "confirmed", // Map DB "accepted" to frontend "confirmed"
      declined: "declined",
      cancelled: "cancelled",
      completed: "completed",
    };

    return statusMap[dbStatus] || "pending";
  }

  // Init form when a new booking is loaded
  $: if (show && booking && booking.id) {
    initForm();
  }

  // Calculate duration from start and end times
  function calculateDurationFromTimes(startTime, endTime) {
    if (!startTime || !endTime) return null;

    // Parse the times (format: "HH:MM")
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Calculate total minutes for each time
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Calculate the difference in hours (round to nearest hour)
    let durationHours = Math.round((endTotalMinutes - startTotalMinutes) / 60);

    // Handle if end time is on the next day
    if (durationHours <= 0) {
      durationHours += 24;
    }

    console.log(
      `Calculated duration: ${durationHours} hours from ${startTime} to ${endTime}`,
    );
    return durationHours;
  }

  // Simple initialization function
  function initForm() {
    console.log("Initializing form with booking:", booking);

    // Reset state
    isSubmitting = false;
    formError = null;
    formSuccess = null;

    // Extract date and time
    let dateStr = "";
    let timeStr = "12:00";

    if (booking.event_date || booking.date) {
      try {
        const dateObj = new Date(booking.event_date || booking.date);
        if (!isNaN(dateObj.getTime())) {
          dateStr = dateObj.toISOString().split("T")[0];

          // Important fix: Check for both naming conventions (camelCase and snake_case)
          if (booking.startTime || booking.start_time) {
            timeStr = booking.startTime || booking.start_time;
            console.log("Using start time from booking:", timeStr);
          } else {
            // Otherwise use the time from the date object
            timeStr = `${String(dateObj.getHours()).padStart(2, "0")}:${String(
              dateObj.getMinutes(),
            ).padStart(2, "0")}`;
            console.log("Using time from date object:", timeStr);
          }
        }
      } catch (e) {
        console.error("Date parse error:", e);
      }
    }

    // Get customer info
    const customer = booking.Customer || booking.customer || {};
    customerInfo = {
      name:
        customer.name ||
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
      email: customer.email || "",
      phone: customer.phone || "",
      id: customer.id || "",
    };

    // Determine duration
    let durationValue = "";

    // First check if duration is explicitly provided
    if (booking.event_duration || booking.duration) {
      const rawDuration = booking.event_duration || booking.duration;
      console.log("Using explicit duration:", rawDuration);

      // Check if it's already in the right format
      if (
        rawDuration === "2u" ||
        rawDuration === "3u" ||
        rawDuration === "4u" ||
        rawDuration === "5u"
      ) {
        durationValue = rawDuration;
      } else {
        // Try to extract just the number
        const match = String(rawDuration).match(/(\d+)/);
        if (match && match[1]) {
          const hours = parseInt(match[1], 10);
          if (hours >= 2 && hours <= 5) {
            durationValue = `${hours}u`;
          }
        }
      }
    }
    // If no explicit duration, try to calculate from start/end times
    else if (booking.startTime || booking.start_time) {
      // Here's another fix to check both naming conventions
      const startTime = booking.startTime || booking.start_time;
      const endTime = booking.endTime || booking.end_time;

      if (startTime && endTime) {
        const hours = calculateDurationFromTimes(startTime, endTime);
        if (hours && hours >= 2 && hours <= 5) {
          durationValue = `${hours}u`;
          console.log("Calculated duration from times:", durationValue);
        }
      }
    }

    console.log("Final duration value:", durationValue);

    // Get price
    let priceValue = "";
    if (booking.total_price) {
      priceValue = String(booking.total_price);
    } else if (booking.price) {
      priceValue = String(booking.price);
    } else if (durationValue) {
      // Set price based on duration
      if (durationValue === "2u") priceValue = "250";
      else if (durationValue === "3u") priceValue = "350";
      else if (durationValue === "4u") priceValue = "450";
      else if (durationValue === "5u") priceValue = "550";
    }

    // Map the frontend status to database status for the form
    const mappedStatus = mapStatusReverse(booking.status) || "pending";
    console.log("Booking status:", booking.status, "Mapped to:", mappedStatus);

    // Set form data
    formData = {
      id: booking.id || "",
      customer_id: booking.customer_id || (customer ? customer.id : ""),
      event_type: booking.event_type || booking.eventType || "",
      event_date: dateStr,
      event_time: timeStr,
      event_location: booking.event_location || booking.location || "",
      event_duration: durationValue,
      total_price: priceValue,
      deposit_amount: booking.deposit_amount
        ? String(booking.deposit_amount)
        : "100",
      final_payment_amount: "",
      payment_status:
        booking.payment_status || booking.paymentStatus || "not_paid",
      status: mappedStatus,
      admin_notes: booking.admin_notes || booking.notes || "",
    };

    console.log("Form initialized with:", {
      duration: formData.event_duration,
      price: formData.total_price,
      status: formData.status,
      time: formData.event_time,
    });

    // Calculate final payment
    calculateFinalPayment();
  }

  // Calculate final payment
  function calculateFinalPayment() {
    const total = parseFloat(formData.total_price) || 0;
    const deposit = parseFloat(formData.deposit_amount) || 0;
    formData.final_payment_amount = Math.max(0, total - deposit).toFixed(2);
  }

  // Update final payment when price or deposit changes
  $: if (formData.total_price || formData.deposit_amount) {
    calculateFinalPayment();
  }

  // Handle duration change
  function handleDurationChange(e) {
    const selectedDuration = e.target.value;
    formData.event_duration = selectedDuration;

    // Set price based on selected duration
    let price = null;
    if (selectedDuration === "2u") price = "250";
    else if (selectedDuration === "3u") price = "350";
    else if (selectedDuration === "4u") price = "450";
    else if (selectedDuration === "5u") price = "550";

    // Only update price if it's empty or matches a standard price
    if (
      price &&
      (!formData.total_price ||
        ["250", "350", "450", "550"].includes(formData.total_price))
    ) {
      formData.total_price = price;
      calculateFinalPayment();
    }
  }

  // Helper functions for dropdown options
  function getEventTypeOptions() {
    return [
      { value: "Bruiloft", label: "Bruiloft" },
      { value: "Bedrijfsfeest", label: "Bedrijfsfeest" },
      { value: "Verjaardag", label: "Verjaardag" },
      { value: "Jubileum", label: "Jubileum" },
      { value: "Afstuderen", label: "Afstuderen" },
      { value: "Anders", label: "Anders" },
    ];
  }

  function getStatusOptions() {
    return [
      { value: "pending", label: "In afwachting" },
      { value: "accepted", label: "Geaccepteerd" },
      { value: "declined", label: "Afgewezen" },
      { value: "cancelled", label: "Geannuleerd" },
      { value: "completed", label: "Voltooid" },
    ];
  }

  function getPaymentStatusOptions() {
    return [
      { value: "not_paid", label: "Niet betaald" },
      { value: "final_pending", label: "Restbetaling open" },
      { value: "final_paid", label: "Volledig betaald" },
    ];
  }

  function getCustomerInitials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase();
  }

  function handleClose() {
    formError = null;
    formSuccess = null;
    onClose();
  }

  // FIXED: Combine date and time without using Date objects to prevent timezone issues
  function combineDateAndTime(dateStr, timeStr) {
    if (!dateStr) return null;
    if (!timeStr) timeStr = "12:00";

    // Simply concatenate the date and time strings
    // This avoids any timezone conversion that happens with Date objects
    return `${dateStr}T${timeStr}:00`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    formError = null;
    formSuccess = null;
    isSubmitting = true;

    try {
      // Validation
      if (!formData.event_date) throw new Error("Vul een datum in");
      if (!formData.event_location) throw new Error("Vul een locatie in");
      if (!formData.event_duration) throw new Error("Selecteer een duur");
      if (!formData.total_price || parseFloat(formData.total_price) <= 0)
        throw new Error("Vul een geldige positieve totaalprijs in");

      const depositAmount = parseFloat(formData.deposit_amount || 0);
      if (depositAmount < 0)
        throw new Error("Aanbetaling mag niet negatief zijn");
      if (depositAmount > parseFloat(formData.total_price))
        throw new Error("Aanbetaling mag niet hoger zijn dan de totaalprijs");

      // DON'T try to combine or format the date/time at all
      // Just send them exactly as they are in the form
      console.log(
        "Submitting with raw values - Date:",
        formData.event_date,
        "Time:",
        formData.event_time,
      );

      // Prepare data for submission - sending separate date and time fields
      const submissionData = {
        customer_id: formData.customer_id,
        event_type: formData.event_type,
        // Send raw date string
        event_date: formData.event_date,
        // IMPORTANT: Use start_time instead of event_time to match server expectations
        start_time: formData.event_time,
        event_location: formData.event_location,
        event_duration: formData.event_duration,
        total_price: parseFloat(formData.total_price) || 0,
        deposit_amount: parseFloat(formData.deposit_amount || 0),
        final_payment_amount: parseFloat(formData.final_payment_amount) || 0,
        payment_status: formData.payment_status,
        status: formData.status,
        admin_notes: formData.admin_notes,
      };

      // Send request
      const response = await fetch(`/dashboard/boekingen`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id,
          ...submissionData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        formSuccess = "Boeking succesvol bijgewerkt!";

        // Calculate the end time based on duration and start time
        const durationHours = parseInt(formData.event_duration.match(/\d+/)[0]);
        const [startHour, startMinute] = formData.event_time
          .split(":")
          .map(Number);
        const endHour = (startHour + durationHours) % 24;
        const endTime = `${String(endHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;

        // Map status back to frontend format for the parent component
        const frontendStatus = mapStatusToFrontend(submissionData.status);
        console.log(
          "DB Status:",
          submissionData.status,
          "Frontend status:",
          frontendStatus,
        );

        // Update booking for parent component
        const updatedBooking = {
          ...booking,
          ...submissionData,
          id: formData.id,
          price: submissionData.total_price,
          paymentStatus: submissionData.payment_status,
          date: formData.event_date,
          location: submissionData.event_location,
          notes: submissionData.admin_notes,
          duration: submissionData.event_duration,
          startTime: formData.event_time,
          endTime: endTime,
          status: frontendStatus,
          Customer: booking.Customer || booking.customer,
          customer: booking.Customer || booking.customer,
        };

        onSave(updatedBooking);

        // Close after success
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        throw new Error(
          result?.message ||
            result?.error ||
            `Fout: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      formError = error.message || "Er is een onbekende fout opgetreden.";
      console.error("Error updating booking:", error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if show && booking}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
    on:click={handleClose}
  >
    <div
      transition:slide={{ duration: 300, axis: "x" }}
      class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
      on:click|stopPropagation
    >
      <form on:submit={handleSubmit} class="h-full flex flex-col">
        <div
          class="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-grow overflow-y-auto"
        >
          <div class="flex justify-between items-start">
            <h2
              class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
            >
              Boeking Bewerken
            </h2>
            <button
              type="button"
              on:click={handleClose}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              disabled={isSubmitting}
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
              class="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
            >
              {formError}
            </div>
          {/if}

          {#if formSuccess}
            <div
              class="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
            >
              {formSuccess}
            </div>
          {/if}

          <!-- Customer Information Section -->
          <div
            class="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-5"
          >
            <h3
              class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3"
            >
              Klantgegevens
            </h3>
            <div class="flex flex-col sm:flex-row sm:items-center pb-4">
              <div
                class="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-lg sm:text-xl font-medium"
              >
                {getCustomerInitials(customerInfo.name)}
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-4">
                <h3
                  class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
                >
                  {customerInfo.name}
                </h3>
                <div class="text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                  <div class="flex items-center text-xs sm:text-sm">
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
                    <span class="break-all">{customerInfo.email}</span>
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
                    {customerInfo.phone}
                  </div>
                </div>
                {#if customerInfo.id}
                  <a
                    href="/dashboard/klanten/{customerInfo.id}"
                    class="text-blue-600 dark:text-blue-400 text-xs sm:text-sm hover:underline mt-2 inline-block"
                  >
                    Klantprofiel bekijken
                  </a>
                {/if}
              </div>
            </div>
          </div>

          <!-- Event Details Section -->
          <div
            class="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-5"
          >
            <h3
              class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3"
            >
              Evenement Details
            </h3>
            <div class="form-grid">
              <div class="full-width">
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
                  {#each getEventTypeOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <!-- Date and Time Inputs -->
              <div>
                <label
                  for="event-date"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Datum</label
                >
                <input
                  type="date"
                  id="event-date"
                  bind:value={formData.event_date}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  for="event-time"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Tijd</label
                >
                <input
                  step="60"
                  type="time"
                  id="event-time"
                  bind:value={formData.event_time}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  for="event-duration"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Duur</label
                >
                <select
                  id="event-duration"
                  on:change={handleDurationChange}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  <option value="" selected={formData.event_duration === ""}
                    >Selecteer duur</option
                  >
                  <option value="2u" selected={formData.event_duration === "2u"}
                    >2 uur (€250)</option
                  >
                  <option value="3u" selected={formData.event_duration === "3u"}
                    >3 uur (€350)</option
                  >
                  <option value="4u" selected={formData.event_duration === "4u"}
                    >4 uur (€450)</option
                  >
                  <option value="5u" selected={formData.event_duration === "5u"}
                    >5 uur (€550)</option
                  >
                </select>
              </div>

              <div class="full-width">
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

          <!-- Payment Section -->
          <div
            class="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-5"
          >
            <h3
              class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3"
            >
              Betaling
            </h3>
            <div class="form-grid">
              <div>
                <label
                  for="total-price"
                  class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Totaalprijs (€)</label
                >
                <input
                  type="text"
                  inputmode="decimal"
                  id="total-price"
                  bind:value={formData.total_price}
                  placeholder="0.00"
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
                  type="text"
                  inputmode="decimal"
                  id="deposit-amount"
                  bind:value={formData.deposit_amount}
                  placeholder="100.00"
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
                  type="text"
                  id="final-payment"
                  value={formData.final_payment_amount}
                  placeholder="0.00"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
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
                  {#each getPaymentStatusOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <div class="full-width">
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
                  {#each getStatusOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
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
        </div>

        <!-- Bottom action buttons -->
        <div
          class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 mt-auto"
        >
          <div
            class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3 sm:gap-0"
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
                Wijzigingen Opslaan
              {/if}
            </button>
          </div>
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
  input[type="time"] {
    min-height: 38px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }

  .full-width {
    grid-column: 1 / -1;
  }
</style>

