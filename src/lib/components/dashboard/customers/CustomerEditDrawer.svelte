<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let customer;

  let formData = {
    id: customer?.id || "",
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    company_name: customer?.company_name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    password: "", // Leeg, alleen invullen als klant wachtwoord wil wijzigen
  };

  let type = customer?.company_name ? "business" : "individual";
  let loading = false;
  let errorMessage = "";
  let successMessage = "";

  const dispatch = createEventDispatcher();

  function close(e) {
    e.stopPropagation();
    dispatch("close");
  }

  function validateForm() {
    // Validate form
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone
    ) {
      errorMessage = "Vul alle verplichte velden in";
      return false;
    }

    // Als het bedrijfstype is geselecteerd, moet er een bedrijfsnaam zijn
    if (type === "business" && !formData.company_name) {
      errorMessage = "Bedrijfsnaam is verplicht bij bedrijfsklanten";
      return false;
    }

    errorMessage = "";
    return true;
  }

  function handleTypeChange() {
    if (type === "individual") {
      formData.company_name = "";
    }
  }

  async function submitForm(e) {
    e.preventDefault();

    // Reset messages
    errorMessage = "";
    successMessage = "";

    // Valideer form
    if (!validateForm()) {
      return;
    }

    // Toon loading state
    loading = true;

    try {
      // Maak een PATCH request naar onze API endpoint
      const response = await fetch(`/dashboard/klanten/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type,
        }),
      });

      // Verwerk de response
      const result = await response.json();

      if (!response.ok) {
        // Toon error message
        errorMessage =
          result.message ||
          "Er is een fout opgetreden bij het opslaan van de wijzigingen";
        return;
      }

      // Toon succes bericht
      successMessage = "Klant succesvol bijgewerkt";

      // Sluit drawer na korte vertraging om gebruiker succes te laten zien
      setTimeout(() => {
        dispatch("close");
        // Ververs de pagina om de wijzigingen te tonen
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      errorMessage =
        "Er is een onverwachte fout opgetreden. Probeer het later nog eens.";
    } finally {
      loading = false;
    }
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "x" }}
  class="fixed inset-y-0 right-0 bg-white dark:bg-gray-800 shadow-xl w-full max-w-2xl h-full overflow-y-auto z-50"
  on:click|stopPropagation
>
  <div class="p-6">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        Klant Bewerken
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

    <!-- Error Message -->
    {#if errorMessage}
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        role="alert"
      >
        <p class="font-bold">Er is een fout opgetreden</p>
        <p>{errorMessage}</p>
      </div>
    {/if}

    <!-- Success Message -->
    {#if successMessage}
      <div
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
        role="alert"
      >
        <p class="font-bold">Succes!</p>
        <p>{successMessage}</p>
      </div>
    {/if}

    <!-- Customer Form -->
    <form class="space-y-6" on:submit={submitForm}>
      <!-- Basic Information -->
      <div>
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
          Basisinformatie
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="customer-type"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Type klant</label
            >
            <select
              id="customer-type"
              bind:value={type}
              on:change={handleTypeChange}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="individual">Particulier</option>
              <option value="business">Bedrijf</option>
            </select>
          </div>

          <div>
            <label
              for="company-name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Bedrijfsnaam {type === "business"
                ? "(verplicht)"
                : "(optioneel)"}</label
            >
            <input
              type="text"
              id="company-name"
              bind:value={formData.company_name}
              placeholder="Bedrijfsnaam"
              required={type === "business"}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              for="first-name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Voornaam *</label
            >
            <input
              type="text"
              id="first-name"
              bind:value={formData.first_name}
              placeholder="Voornaam"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              for="last-name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Achternaam *</label
            >
            <input
              type="text"
              id="last-name"
              bind:value={formData.last_name}
              placeholder="Achternaam"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div>
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
          Contactgegevens
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="customer-email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >E-mail *</label
            >
            <input
              type="email"
              id="customer-email"
              bind:value={formData.email}
              placeholder="email@voorbeeld.nl"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              for="customer-phone"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Telefoon *</label
            >
            <input
              type="tel"
              id="customer-phone"
              bind:value={formData.phone}
              placeholder="06-12345678"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Wachtwoord (optioneel bij bewerken) -->
      <div>
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
          Wachtwoord Wijzigen (optioneel)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Nieuw wachtwoord</label
            >
            <input
              type="password"
              id="password"
              bind:value={formData.password}
              placeholder="Laat leeg om niet te wijzigen"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div class="md:pt-7 text-sm text-gray-500 dark:text-gray-400">
            Laat dit veld leeg als je het wachtwoord niet wilt wijzigen.
          </div>
        </div>
      </div>

      <div
        class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          type="button"
          on:click={close}
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          disabled={loading}
        >
          Annuleren
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center min-w-[120px]"
          disabled={loading}
        >
          {#if loading}
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
            Opslaan...
          {:else}
            Wijzigingen opslaan
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>

