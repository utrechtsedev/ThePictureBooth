<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { enhance } from "$app/forms";

  // For editing an existing customer (optional)
  export let customer = null;
  export let form = null; // Voor server-side form validatie feedback

  let formData = {
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    company_name: customer?.company_name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    password: "",
    password_confirm: "",
  };

  let type = customer?.company_name ? "business" : "individual";
  let formAction = "/dashboard/klanten";

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
      alert("Vul alle verplichte velden in");
      return false;
    }

    if (
      !customer &&
      (!formData.password || formData.password !== formData.password_confirm)
    ) {
      alert("Wachtwoorden komen niet overeen");
      return false;
    }

    // Als het bedrijfstype is geselecteerd, moet er een bedrijfsnaam zijn
    if (type === "business" && !formData.company_name) {
      alert("Bedrijfsnaam is verplicht bij bedrijfsklanten");
      return false;
    }

    return true;
  }

  function handleTypeChange() {
    if (type === "individual") {
      formData.company_name = "";
    }
  }

  // Deze functie wordt gebruikt door de enhance actie
  function handleSubmit({ formElement, formData, action, cancel, submitter }) {
    // Client-side validatie eerst
    if (!validateForm()) {
      cancel();
    }

    // We retourneren een functie die wordt uitgevoerd na een succesvolle form submission
    return async ({ result, update }) => {
      if (result.type === "success") {
        // Sluit het formulier en update de pagina als het een succes is
        dispatch("close");
        // Pagina updaten met een kleine vertraging om visuele feedback te geven
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // Update de form status en toon server errors (zoals duplicate email)
        await update();
      }
    };
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "y" }}
  class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
  on:click|stopPropagation
>
  <div class="flex justify-between items-start mb-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
      {customer ? "Klant Bewerken" : "Nieuwe Klant Toevoegen"}
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

  <!-- Server-side validatie error weergave -->
  {#if form?.success === false}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      role="alert"
    >
      <p class="font-bold">Er is een fout opgetreden</p>
      <p>{form?.message}</p>
    </div>
  {/if}

  <!-- Customer Form -->
  <form
    class="space-y-6"
    method="POST"
    action={formAction}
    use:enhance={handleSubmit}
  >
    <!-- Als we een bestaande klant bewerken, stuur dan het ID mee -->
    {#if customer}
      <input type="hidden" name="id" value={customer.id} />
    {/if}

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
            name="type"
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
            name="company_name"
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
            name="first_name"
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
            name="last_name"
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
            name="email"
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
            name="phone"
            bind:value={formData.phone}
            placeholder="06-12345678"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Password (only for new customers) -->
    {#if !customer}
      <div>
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
          Wachtwoord
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Wachtwoord *</label
            >
            <input
              type="password"
              id="password"
              name="password"
              bind:value={formData.password}
              placeholder="••••••••"
              required={!customer}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              for="password-confirm"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Bevestig wachtwoord *</label
            >
            <input
              type="password"
              id="password-confirm"
              name="password_confirm"
              bind:value={formData.password_confirm}
              placeholder="••••••••"
              required={!customer}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    {/if}

    <div
      class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700"
    >
      <button
        type="button"
        on:click={close}
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Annuleren
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {customer ? "Wijzigingen opslaan" : "Klant opslaan"}
      </button>
    </div>
  </form>
</div>

