<!-- src/lib/components/dashboard/settings/PasswordChangeForm.svelte -->
<script>
  export let currentUser;

  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let isSubmitting = false;
  let errorMessage = null;
  let successMessage = null;

  async function handlePasswordUpdate(event) {
    // Prevent default form submission
    event.preventDefault();

    // Reset messages
    errorMessage = null;
    successMessage = null;

    // Client-side validation
    if (!currentPassword) {
      errorMessage = "Vul je huidige wachtwoord in";
      return;
    }

    if (!newPassword) {
      errorMessage = "Vul een nieuw wachtwoord in";
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMessage = "Wachtwoorden komen niet overeen";
      return;
    }

    try {
      isSubmitting = true;

      const passwordPayload = {
        currentPassword,
        newPassword,
        confirmPassword,
        userId: currentUser.id,
      };

      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        errorMessage =
          data.error ||
          "Er is iets misgegaan bij het wijzigen van het wachtwoord";
      } else {
        successMessage = "Wachtwoord succesvol gewijzigd";
        // Reset form fields on success
        currentPassword = "";
        newPassword = "";
        confirmPassword = "";
      }
    } catch (error) {
      console.error("Error updating password:", error);
      errorMessage =
        "Er is een technisch probleem opgetreden. Probeer het later opnieuw.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-10">
  <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
      Wachtwoord wijzigen
    </h2>
    <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
      Werk je wachtwoord bij om de veiligheid van je account te waarborgen.
    </p>
  </div>

  <div class="p-8">
    {#if errorMessage}
      <div
        class="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
      >
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div
        class="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
      >
        {successMessage}
      </div>
    {/if}

    <form
      class="space-y-8 max-w-lg"
      on:submit|preventDefault={handlePasswordUpdate}
    >
      <div>
        <label
          for="current-password"
          class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Huidig wachtwoord
        </label>
        <input
          id="current-password"
          name="current-password"
          type="password"
          required
          class="py-3 px-4 block w-full text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          bind:value={currentPassword}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          for="new-password"
          class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Nieuw wachtwoord
        </label>
        <input
          id="new-password"
          name="new-password"
          type="password"
          required
          class="py-3 px-4 block w-full text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          bind:value={newPassword}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          for="confirm-password"
          class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Bevestig wachtwoord
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          required
          class="py-3 px-4 block w-full text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          bind:value={confirmPassword}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <button
          type="submit"
          class="py-3 px-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
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
            Bezig met bijwerken...
          {:else}
            Wachtwoord wijzigen
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>

