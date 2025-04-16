<!-- src/lib/components/dashboard/settings/UserManagement.svelte -->
<script>
  // Props
  export let users = [];
  export let currentUser = {};
  export let openNewUserModal;
  export let openEditModal;
  export let openDeleteModal;

  // Helper function to determine if delete button should be visible
  function canDeleteUser(user) {
    return (
      currentUser.username !== user.username &&
      (currentUser.role === "superadmin" ||
        (currentUser.role === "admin" && user.role !== "superadmin"))
    );
  }
</script>

<div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
  <div
    class="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
  >
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        Gebruikersbeheer
      </h2>
      <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
        Beheer gebruikers en hun toegangsrechten.
      </p>
    </div>

    <button
      class="py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      on:click={openNewUserModal}
    >
      <div class="flex items-center">
        <svg
          class="mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Nieuwe gebruiker</span>
      </div>
    </button>
  </div>

  <!-- Users Table -->
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-900/30">
        <tr>
          <th
            class="px-8 py-4 text-left text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Gebruiker
          </th>
          <th
            class="px-8 py-4 text-left text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Rol
          </th>
          <th
            class="px-8 py-4 text-left text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Aangemaakt op
          </th>
          <th
            class="px-8 py-4 text-right text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Acties
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        {#each users as user}
          <tr
            class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            <td class="px-8 py-5 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 text-lg font-bold"
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div class="ml-5">
                  <div
                    class="text-base font-medium text-gray-900 dark:text-white"
                  >
                    {user.username}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-8 py-5 whitespace-nowrap">
              <span
                class="px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full
                {user.role === 'superadmin'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  : user.role === 'admin'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}"
              >
                {user.role === "superadmin"
                  ? "Superadmin"
                  : user.role === "admin"
                    ? "Admin"
                    : "Moderator"}
              </span>
            </td>
            <td
              class="px-8 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400"
            >
              {new Date(user.created_at).toLocaleDateString("nl-NL")}
            </td>
            <td
              class="px-8 py-5 whitespace-nowrap text-right text-base font-medium"
            >
              <button
                class="py-2 px-4 mr-2 inline-flex items-center border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                on:click={() => openEditModal(user)}
              >
                Bewerken
              </button>
              {#if canDeleteUser(user)}
                <button
                  class="py-2 px-4 inline-flex items-center border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  on:click={() => openDeleteModal(user)}
                >
                  Verwijderen
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div
    class="bg-gray-50 dark:bg-gray-900/30 px-8 py-4 border-t border-gray-200 dark:border-gray-700"
  >
    <div class="text-base text-gray-700 dark:text-gray-300 font-medium">
      Totaal aantal gebruikers: {users.length}
    </div>
  </div>
</div>
