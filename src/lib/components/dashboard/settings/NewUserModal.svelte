<!-- src/lib/components/dashboard/settings/NewUserModal.svelte -->
<script>
  import { fade, slide } from "svelte/transition";

  // Props
  export let newUser = {
    username: "",
    email: "",
    password: "",
    role: "moderator",
  };
  export let closeModals;
  export let formError = null;
  export let isSubmitting = false;
  export let handleNewUserSubmit;
</script>

<div
  transition:fade={{ duration: 200 }}
  class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
  on:click={closeModals}
>
  <div
    transition:slide={{ duration: 300, axis: "y" }}
    class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 p-4 sm:p-6"
    on:click|stopPropagation
  >
    <div class="flex justify-between items-start mb-4 sm:mb-6">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
        Nieuwe gebruiker aanmaken
      </h2>
      <button
        type="button"
        on:click={closeModals}
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

    <form
      class="space-y-4 sm:space-y-6"
      on:submit|preventDefault={handleNewUserSubmit}
    >
      <div>
        <label
          for="new-username"
          class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Gebruikersnaam
        </label>
        <input
          id="new-username"
          name="username"
          type="text"
          bind:value={newUser.username}
          required
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          for="new-email"
          class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          E-mailadres
        </label>
        <input
          id="new-email"
          name="email"
          type="email"
          bind:value={newUser.email}
          required
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          for="new-password"
          class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Wachtwoord
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          bind:value={newUser.password}
          required
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          for="new-role"
          class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Rol
        </label>
        <select
          id="new-role"
          name="role"
          bind:value={newUser.role}
          class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        >
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
          {#if newUser.role === "superadmin"}
            <option value="superadmin">Superadmin</option>
          {/if}
        </select>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3 sm:gap-0 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          type="button"
          on:click={closeModals}
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
            Aanmaken
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
