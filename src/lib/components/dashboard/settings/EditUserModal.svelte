<!-- src/lib/components/dashboard/settings/EditUserModal.svelte -->
<script>
  import { fade, slide } from "svelte/transition";

  // Props
  export let editUser = {
    id: "",
    username: "",
    email: "",
    role: "",
    password: "", // Added password field
  };
  export let currentUser;
  export let closeModals;
  export let formError = null;
  export let isSubmitting = false;
  export let handleEditUserSubmit;

  // Store original role when form opens
  let originalRole;
  $: originalRole = editUser.role;

  // Flag to track if password is being changed
  let changePassword = false;

  // Validation states
  let touched = {
    username: true, // Pre-filled fields are considered touched
    email: true,
    password: false,
  };

  // Validate email format
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  // Check for validation errors
  function getValidationError(field) {
    if (!touched[field]) return null;

    switch (field) {
      case "username":
        return !editUser.username ? "Gebruikersnaam is verplicht" : null;
      case "email":
        return !editUser.email
          ? "E-mailadres is verplicht"
          : !isValidEmail(editUser.email)
            ? "Voer een geldig e-mailadres in"
            : null;
      case "password":
        return changePassword &&
          editUser.password &&
          editUser.password.length < 6
          ? "Wachtwoord moet minimaal 6 tekens bevatten"
          : null;
      default:
        return null;
    }
  }

  // Mark field as touched on blur
  function handleBlur(field) {
    touched[field] = true;
  }

  // Reset password field when toggling change password
  function toggleChangePassword() {
    // Don't toggle the value here - it's already handled by bind:checked
    if (!changePassword) {
      editUser.password = "";
      touched.password = false;
    } else {
      touched.password = true;
    }
  }

  // Function to check if current user can edit roles
  function canEditRole() {
    // Superadmins can edit anyone's role
    if (currentUser.role === "superadmin") {
      return true;
    }

    // Admins can only edit moderator roles
    if (currentUser.role === "admin") {
      return originalRole === "moderator";
    }

    // Moderators can't edit roles
    return false;
  }

  // Handle form submission while respecting password change mode
  async function submitForm() {
    // Run validation first
    touched = { username: true, email: true, password: changePassword };

    if (getValidationError("username") || getValidationError("email")) {
      // Don't submit if there are validation errors
      return;
    }

    if (changePassword && getValidationError("password")) {
      return;
    }

    // Create a copy of the editUser data
    const userData = { ...editUser };

    // If not changing password, make sure it's not sent to the server
    if (!changePassword) {
      delete userData.password;
    }

    // If user can't edit roles, revert to original role
    if (!canEditRole()) {
      userData.role = originalRole;
    }

    // Call the parent component's submit handler
    await handleEditUserSubmit(userData);
  }
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
        Gebruiker bewerken
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

    <form class="space-y-4 sm:space-y-6" on:submit|preventDefault={submitForm}>
      <div>
        <label
          for="edit-username"
          class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Gebruikersnaam
        </label>
        <input
          id="edit-username"
          name="username"
          type="text"
          bind:value={editUser.username}
          on:blur={() => handleBlur("username")}
          required
          class="w-full px-3 py-2 text-sm rounded-lg border {getValidationError(
            'username',
          )
            ? 'border-red-500 dark:border-red-600'
            : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
        {#if getValidationError("username")}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">
            {getValidationError("username")}
          </p>
        {/if}
      </div>

      <div>
        <label
          for="edit-email"
          class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          E-mailadres
        </label>
        <input
          id="edit-email"
          name="email"
          type="email"
          bind:value={editUser.email}
          on:blur={() => handleBlur("email")}
          required
          class="w-full px-3 py-2 text-sm rounded-lg border {getValidationError(
            'email',
          )
            ? 'border-red-500 dark:border-red-600'
            : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
        {#if getValidationError("email")}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">
            {getValidationError("email")}
          </p>
        {/if}
      </div>

      <div>
        <label
          for="edit-role"
          class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center"
        >
          Rol
          {#if !canEditRole()}
            <span class="ml-2 text-xs text-amber-600 dark:text-amber-400">
              (Je hebt geen rechten om deze rol te wijzigen)
            </span>
          {/if}
        </label>

        {#if canEditRole()}
          <!-- Editable role selector -->
          <select
            id="edit-role"
            name="role"
            bind:value={editUser.role}
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          >
            <option value="moderator">Moderator</option>
            {#if currentUser.role === "admin" || currentUser.role === "superadmin"}
              <option value="admin">Admin</option>
            {/if}
            {#if currentUser.role === "superadmin"}
              <option value="superadmin">Superadmin</option>
            {/if}
          </select>
        {:else}
          <!-- Read-only role display -->
          <div
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 dark:text-white"
          >
            {originalRole === "superadmin"
              ? "Superadmin"
              : originalRole === "admin"
                ? "Admin"
                : "Moderator"}
          </div>
        {/if}
      </div>

      <!-- Password Change Section -->
      <div class="pt-2">
        <div class="flex items-center">
          <input
            type="checkbox"
            id="change-password"
            bind:checked={changePassword}
            on:change={toggleChangePassword}
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            disabled={isSubmitting}
          />
          <label
            for="change-password"
            class="ml-2 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Wachtwoord wijzigen
          </label>
        </div>

        {#if changePassword}
          <div class="mt-3">
            <label
              for="edit-password"
              class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nieuw wachtwoord
            </label>
            <input
              id="edit-password"
              name="password"
              type="password"
              bind:value={editUser.password}
              on:blur={() => handleBlur("password")}
              class="w-full px-3 py-2 text-sm rounded-lg border {getValidationError(
                'password',
              )
                ? 'border-red-500 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {#if getValidationError("password")}
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {getValidationError("password")}
              </p>
            {/if}
          </div>
        {/if}
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
          disabled={isSubmitting ||
            getValidationError("username") ||
            getValidationError("email") ||
            getValidationError("password")}
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
            Opslaan
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>

