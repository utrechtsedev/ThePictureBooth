<!-- src/lib/components/dashboard/settings/DeleteUserModal.svelte -->
<script>
  import { fade, slide } from "svelte/transition";

  // Props
  export let selectedUser;
  export let closeModals;
  export let isSubmitting = false;
  export let handleDeleteUser;
  export let formError = null;
</script>

<div
  transition:fade={{ duration: 200 }}
  class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
  on:click={closeModals}
>
  <div
    transition:slide={{ duration: 300, axis: "y" }}
    class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto z-50 p-4 sm:p-6"
    on:click|stopPropagation
  >
    <div class="flex items-start mb-4">
      <div
        class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
      >
        <svg
          class="h-6 w-6 text-red-600 dark:text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div class="ml-4 flex-1">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Gebruiker verwijderen
          </h3>
          <button
            type="button"
            on:click={closeModals}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 -mt-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Weet je zeker dat je de gebruiker <span
            class="font-medium text-gray-900 dark:text-white"
            >{selectedUser.username}</span
          > wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
        </p>
      </div>
    </div>

    {#if formError}
      <div
        class="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
      >
        {formError}
      </div>
    {/if}

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
        type="button"
        on:click={handleDeleteUser}
        class="px-4 py-2 w-full sm:w-auto bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm order-1 sm:order-2 flex items-center justify-center"
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
          Bezig met verwijderen...
        {:else}
          Verwijderen
        {/if}
      </button>
    </div>
  </div>
</div>

