<!-- src/lib/components/storefront/BookingForm.svelte -->
<script>
  import { onMount } from "svelte";
  import { DatePicker } from "@svelte-plugins/datepicker";
  import { format } from "date-fns";

  // Props
  export let formElement;
  export let durationPrices;
  export let selectedDuration;

  // Form validation
  let formIsValid = false;
  let formSubmitted = false;
  let formError = false;

  function validateForm() {
    // Check all required fields
    formIsValid = Array.from(formElement.elements).every((element) => {
      if (element.required) {
        return element.checkValidity();
      }
      return true;
    });

    // Extra check for checkbox
    const termsCheckbox = formElement.querySelector("#terms");
    if (termsCheckbox) {
      formIsValid = formIsValid && termsCheckbox.checked;
    }

    return formIsValid;
  }

  // Add event listeners to all inputs
  onMount(() => {
    const inputs = formElement.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", validateForm);
    });
  });

  // Date handling
  let dateFormat = "dd-MM-yyyy";
  const formatDate = (dateString) => {
    if (isNaN(new Date(dateString))) {
      return "";
    }
    return (dateString && format(new Date(dateString), dateFormat)) || "";
  };
  let startDate = new Date(+new Date() + 86400000);
  let formattedStartDate = formatDate(startDate);
  const onChange = () => {
    startDate = new Date(formattedStartDate);
  };
  $: formattedStartDate = formatDate(startDate);
  let isOpen = false;
  let dowLabels = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  let monthLabels = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
  ];
  let enableFutureDates = true;
  let enablePastDates = false;
  let disabledDates = [new Date()];

  const toggleDatePicker = () => (isOpen = !isOpen);

  // Form fields
  let naam = "";
  let email = "";
  let telefoonnummer = "";
  let address = "";
  let selectedTime = "12:00";
  let eventType = "";
  let notes = "";
  let terms = false;

  // Dynamic price calculation
  $: currentPackage = durationPrices[selectedDuration];
  $: deposit = 100;
  $: finalPayment = currentPackage?.price - deposit;

  async function submitReservation(e) {
    e.preventDefault();
    formIsValid = validateForm();

    if (!formIsValid) {
      formError = true;
      // Scroll to the form to show errors
      formElement?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    formSubmitted = true;

    try {
      // Split naam into first/last name
      const [first_name, ...lastNames] = naam.split(" ");
      const last_name = lastNames.join(" ");

      // 1. Create customer - API call preserved
      const customerResponse = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          phone: telefoonnummer,
        }),
      });

      if (!customerResponse.ok) throw new Error("Klant aanmaken mislukt");
      const customer = await customerResponse.json();

      // 2. Create reservation - API call preserved
      const [hours, minutes] = selectedTime.split(":");
      const [day, month, year] = formattedStartDate.split("-");
      const eventDate = `${year}-${month}-${day}T${hours}:${minutes}:00`;

      const totalPrice = durationPrices[selectedDuration].price;

      const reservationResponse = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customer.id,
          photobooth_id: "1", // Preserved as per instructions
          event_date: eventDate,
          event_location: address,
          total_price: totalPrice,
          deposit_amount: 100,
          final_payment_amount: totalPrice - 100,
          payment_status: "final_pending",
          event_type: eventType,
          event_duration: selectedDuration,
          status: "pending",
          admin_notes: notes,
        }),
      });

      if (!reservationResponse.ok)
        throw new Error("Reservering aanmaken mislukt");
      let payment_url = (await reservationResponse.json()) + "";
      window.location = payment_url;

      // Reset form
      formElement.reset();
    } catch (error) {
      console.error("Fout:", error);
      formSubmitted = false;
      formError = true;
    }
  }
</script>

<!-- Booking Form Section -->
<form
  bind:this={formElement}
  class="w-full max-w-5xl mx-auto mt-8 p-8 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-20"
  on:submit={submitReservation}
  id="booking-form"
>
  <!-- Form Title -->
  <h2
    class="crazyfont text-4xl text-center mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
  >
    📸 Direct Boeken
  </h2>

  <p class="text-center text-gray-600 mb-8 max-w-xl mx-auto">
    Vul onderstaand formulier in en ontvang direct bevestiging. Alleen €100
    aanbetaling, rest betaal je later.
  </p>

  {#if formError}
    <div
      class="animate-fade-in-up mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
    >
      <div class="flex items-start gap-3 text-red-600">
        <svg
          class="flex-shrink-0 w-5 h-5 mt-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <p class="text-sm font-medium">
            Er is een probleem met het formulier
          </p>
          <p class="text-xs mt-1 opacity-80">
            Controleer of je alle verplichte velden correct hebt ingevuld.
          </p>
        </div>
      </div>
    </div>
  {/if}

  {#if formSubmitted}
    <div
      class="animate-fade-in-up mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      role="alert"
    >
      <div class="flex items-start gap-3 text-blue-600">
        <svg
          class="flex-shrink-0 w-5 h-5 mt-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <p class="text-sm font-medium">Bezig met verwerken...</p>
          <p class="text-xs mt-1 opacity-80">
            We verwerken je boeking. Een moment geduld alsjeblieft.
          </p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Grid Container -->
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Naam Input -->
        <div class="animate-fade-in-up" style="--delay: 0.1s">
          <label for="naam" class="block mb-2 text-gray-700 font-medium"
            >Voornaam & Achternaam</label
          >
          <input
            bind:value={naam}
            type="text"
            id="naam"
            class="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            placeholder="Jan Jansen"
            required
          />
        </div>

        <!-- Email Input -->
        <div class="animate-fade-in-up" style="--delay: 0.2s">
          <label for="email" class="block mb-2 text-gray-700 font-medium"
            >Email</label
          >
          <input
            bind:value={email}
            type="email"
            id="email"
            class="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            placeholder="naam@voorbeeld.nl"
            required
          />
        </div>

        <!-- Telefoonnummer Input -->
        <div class="animate-fade-in-up" style="--delay: 0.3s">
          <label
            for="telefoonnummer"
            class="block mb-2 text-gray-700 font-medium">Telefoonnummer</label
          >
          <input
            bind:value={telefoonnummer}
            type="tel"
            id="telefoonnummer"
            class="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            placeholder="06 12345678"
            required
          />
        </div>

        <!-- Date Picker -->
        <div class="animate-fade-in-up z-10" style="--delay: 0.4s">
          <DatePicker
            bind:isOpen
            bind:startDate
            bind:dowLabels
            bind:enableFutureDates
            bind:enablePastDates
            bind:monthLabels
            bind:disabledDates
            theme="custom-datepicker"
          >
            <label for="datum" class="block mb-2 text-gray-700 font-medium"
              >Datum</label
            >
            <div class="relative">
              <input
                required
                bind:value={formattedStartDate}
                class="w-full px-4 py-3 pr-12 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                placeholder="Selecteer datum"
                on:click={toggleDatePicker}
              />
              <svg
                class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
              >
                <path
                  fill="currentColor"
                  d="M6 2V1h2v1h8V1h2v1h1c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h3zm-3 8v8c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-8H3zm16-6H3c-.6 0-1 .4-1 1v3h18V5c0-.6-.4-1-1-1z"
                />
              </svg>
            </div>
          </DatePicker>
        </div>

        <!-- Tijd Select -->
        <div class="animate-fade-in-up relative" style="--delay: 0.5s">
          <label for="tijd" class="block mb-2 text-gray-700 font-medium"
            >Tijd</label
          >
          <div class="relative">
            <select
              bind:value={selectedTime}
              id="tijd"
              required
              class="appearance-none w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            >
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
              <option value="23:00">23:00</option>
              <option value="00:00">00:00</option>
            </select>
            <svg
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Locatie Input -->
        <div class="animate-fade-in-up" style="--delay: 0.6s">
          <label for="address" class="block mb-2 text-gray-700 font-medium"
            >Locatie</label
          >
          <input
            bind:value={address}
            placeholder="Stad en adres of locatienaam"
            type="text"
            id="address"
            class="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            required
          />
        </div>

        <!-- Duur Select -->
        <div class="animate-fade-in-up relative" style="--delay: 0.7s">
          <label for="duur" class="block mb-2 text-gray-700 font-medium"
            >Duur</label
          >
          <div class="relative">
            <select
              bind:value={selectedDuration}
              id="duur"
              required
              class="appearance-none w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            >
              <option value="2">2 uur - €250</option>
              <option value="3">3 uur - €350</option>
              <option value="4">4 uur - €450</option>
              <option value="5">5 uur - €550</option>
            </select>
            <svg
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Type evenement -->
        <div class="animate-fade-in-up relative" style="--delay: 0.8s">
          <label for="eventType" class="block mb-2 text-gray-700 font-medium"
            >Type evenement</label
          >
          <div class="relative">
            <select
              bind:value={eventType}
              id="eventType"
              required
              class="appearance-none w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            >
              <option value="Bruiloft">Bruiloft</option>
              <option value="Verjaardagsfeest / Gala"
                >Verjaardagsfeest / Gala</option
              >
              <option value="Babyshower">Babyshower</option>
              <option value="Bedrijfsfeest">Bedrijfsfeest</option>
              <option value="Overig">Overig (hieronder toelichten)</option>
            </select>
            <svg
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Notities Textarea -->
        <div class="animate-fade-in-up" style="--delay: 0.9s">
          <label for="notes" class="block mb-2 text-gray-700 font-medium"
            >Opmerkingen</label
          >
          <textarea
            id="notes"
            class="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
            placeholder="Eventuele opmerkingen of speciale verzoeken..."
            rows="4"
            bind:value={notes}
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div
      class="animate-fade-in-up bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100 shadow-sm"
    >
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Bestelling Samenvatting
      </h3>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="text-gray-600">Pakket:</div>
        <div class="text-gray-800 font-medium">
          {durationPrices[selectedDuration].label} ({selectedDuration} uur)
        </div>

        <div class="text-gray-600">Datum:</div>
        <div class="text-gray-800 font-medium">{formattedStartDate}</div>

        <div class="text-gray-600">Tijd:</div>
        <div class="text-gray-800 font-medium">{selectedTime}</div>

        <div class="text-gray-600">Totaal:</div>
        <div class="text-gray-800 font-bold">
          €{durationPrices[selectedDuration].price}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100">
        <div class="text-gray-600">Aanbetaling nu:</div>
        <div class="text-gray-800 font-medium">€{deposit}</div>

        <div class="text-gray-600">Resterend bedrag:</div>
        <div class="text-gray-800 font-medium">€{finalPayment}</div>
      </div>
    </div>

    <!-- Checkbox -->
    <div
      class="animate-fade-in-up flex items-start gap-3"
      style="--delay: 0.9s"
    >
      <input
        id="terms"
        type="checkbox"
        class="mt-1 w-5 h-5 rounded-md bg-white focus:ring-blue-500/50 checked:bg-blue-500"
        required
        bind:checked={terms}
      />
      <label for="terms" class="text-gray-600 text-sm">
        Ik ga akkoord met de
        <a
          href="/voorwaarden"
          class="text-blue-600 hover:text-blue-500 transition-colors underline underline-offset-2"
        >
          voorwaarden
        </a>
        en begrijp dat ik nu €100 aanbetaling betaal en het restbedrag later.
      </label>
    </div>

    <!-- Betaling bericht -->
    {#if formIsValid}
      <div
        class="animate-fade-in-up mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
        style="--delay: 0.3s"
        role="alert"
      >
        <div class="flex items-start gap-3 text-emerald-600">
          <svg
            class="flex-shrink-0 w-5 h-5 mt-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            />
          </svg>
          <div>
            <p class="text-sm font-medium">Direct boeken bevestiging</p>
            <p class="text-xs mt-1 opacity-80">
              Door nu te boeken ga je akkoord met een directe aanbetaling van
              €100 via iDEAL. Hier ontvang je een bevestigingsmail van. Mocht je
              achteraf toch willen annuleren, dan vind je onze contactgegevens
              in de ontvangen mail.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Submit Button -->
    <button
      type="submit"
      class="animate-fade-in-up w-full crazyfont py-4 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500
            text-white text-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-400 hover:to-purple-400
            transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      style="--delay: 1.0s"
      disabled={formSubmitted}
    >
      {#if formSubmitted}
        <span class="flex items-center justify-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
          Bezig met verwerken...
        </span>
      {:else}
        Bevestig Boeking →
      {/if}
    </button>

    <!-- Trust Indicators -->
    <div
      class="flex flex-wrap justify-center gap-6 mt-4 items-center text-gray-500 text-sm"
    >
      <div class="flex items-center gap-2">
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Veilige betaling</span>
      </div>

      <div class="flex items-center gap-2">
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span>100% tevredenheidsgarantie</span>
      </div>

      <div class="flex items-center gap-2">
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>24/7 klantenservice</span>
      </div>
    </div>
  </div>
</form>

<style>
  .crazyfont {
    font-family: "Pattaya";
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out both;
    animation-delay: var(--delay);
  }

  /* DatePicker Customization */
  :global(.datepicker[data-picker-theme="custom-datepicker"]) {
    --datepicker-container-top: -445%;
    background-color: white;
    border: 0px solid rgba(226, 232, 240, 1);
    border-radius: 1rem;
  }

  :global(.datepicker[data-picker-theme="custom-datepicker"] .header) {
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    border-radius: 0.75rem 0.75rem 0 0;
    color: white;
  }

  :global(
      .datepicker[data-picker-theme="custom-datepicker"] .day.is-highlighted
    ) {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }

  :global(.datepicker[data-picker-theme="custom-datepicker"] .day.is-selected) {
    background-color: #3b82f6;
    color: white;
  }

  /* Active scales for buttons */
  .active\:scale-95:active {
    transform: scale(0.95);
  }
</style>
