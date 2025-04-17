<!-- src/routes/settings/+page.svelte -->
<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import PasswordChangeForm from "$lib/components/dashboard/settings/PasswordChangeForm.svelte";
  import UserManagement from "$lib/components/dashboard/settings/UserManagement.svelte";
  import NewUserModal from "$lib/components/dashboard/settings/NewUserModal.svelte";
  import EditUserModal from "$lib/components/dashboard/settings/EditUserModal.svelte";
  import DeleteUserModal from "$lib/components/dashboard/settings/DeleteUserModal.svelte";

  // Props - these would come from your data loading
  export let data;
  // Mock data for layout purposes
  let currentUser = data.user;
  let users = data.adminusers;
  // Helper function to determine if user has admin privileges
  function isAdminOrSuperAdmin(role) {
    return role === "admin" || role === "superadmin";
  }

  // Modal state management
  let showNewUserModal = false;
  let showEditUserModal = false;
  let showDeleteConfirmationModal = false;
  let selectedUser = null;
  let isSubmitting = false;
  let formError = null;

  // New user form data
  let newUser = {
    username: "",
    email: "",
    password: "",
    role: "moderator",
  };

  // Edit user form data
  let editUser = {
    id: "",
    username: "",
    email: "",
    role: "",
    password: "",
  };

  // Open new user modal
  function openNewUserModal() {
    formError = null;
    showNewUserModal = true;
  }

  // Open edit modal
  function openEditModal(user) {
    formError = null;
    editUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: "", // Reset password field
    };
    showEditUserModal = true;
  }

  // Open delete confirmation modal
  function openDeleteModal(user) {
    formError = null;
    selectedUser = user;
    showDeleteConfirmationModal = true;
  }

  // Close all modals and reset state
  function closeModals() {
    showNewUserModal = false;
    showEditUserModal = false;
    showDeleteConfirmationModal = false;
    formError = null;
    isSubmitting = false;
  }

  // Handle new user form submission
  async function handleNewUserSubmit() {
    formError = null;
    isSubmitting = true;

    try {
      // Validation
      if (!newUser.username) {
        throw new Error("Voer een gebruikersnaam in");
      }
      if (!newUser.email) {
        throw new Error("Voer een e-mailadres in");
      }
      if (!newUser.password) {
        throw new Error("Voer een wachtwoord in");
      }

      // Send API request to create user
      const response = await fetch("/dashboard/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Er is een fout opgetreden");
      }

      // Add the new user to the users array
      users = [...users, result];

      // Close modal and reset form
      showNewUserModal = false;
      isSubmitting = false;
      newUser = {
        username: "",
        email: "",
        password: "",
        role: "moderator",
      };
    } catch (error) {
      formError = error.message;
      isSubmitting = false;
    }
  }

  // Handle edit user form submission
  async function handleEditUserSubmit(userData = editUser) {
    formError = null;
    isSubmitting = true;

    try {
      // Validation
      if (!userData.username) {
        throw new Error("Voer een gebruikersnaam in");
      }
      if (!userData.email) {
        throw new Error("Voer een e-mailadres in");
      }

      // Send API request to update user
      const response = await fetch("/dashboard/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Er is een fout opgetreden");
      }

      // Update the user in the users array
      users = users.map((user) => (user.id === result.id ? result : user));

      // Close modal
      showEditUserModal = false;
      isSubmitting = false;
    } catch (error) {
      formError = error.message;
      isSubmitting = false;
    }
  }

  // Handle user deletion
  async function handleDeleteUser() {
    formError = null;
    isSubmitting = true;

    try {
      // Send API request to delete user
      const response = await fetch(
        `/dashboard/settings?id=${selectedUser.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Er is een fout opgetreden bij het verwijderen van de gebruiker",
        );
      }

      // Remove the user from the users array
      users = users.filter((user) => user.id !== selectedUser.id);

      // Close modal
      showDeleteConfirmationModal = false;
      isSubmitting = false;
      selectedUser = null;
    } catch (error) {
      formError = error.message;
      isSubmitting = false;
    }
  }
</script>

<div class="py-10">
  <div class="max-w-5xl mx-auto px-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">
      Instellingen
    </h1>

    <!-- Password Change Section -->
    <PasswordChangeForm {currentUser} />

    <!-- User Management Section (Only visible for admin/superadmin) -->
    {#if isAdminOrSuperAdmin(currentUser.role)}
      <UserManagement
        {users}
        {currentUser}
        {openNewUserModal}
        {openEditModal}
        {openDeleteModal}
      />
    {/if}
  </div>
</div>

<!-- Modals -->
{#if showNewUserModal}
  <NewUserModal
    bind:newUser
    {closeModals}
    {formError}
    {isSubmitting}
    {handleNewUserSubmit}
  />
{/if}

{#if showEditUserModal}
  <EditUserModal
    bind:editUser
    {closeModals}
    {formError}
    {isSubmitting}
    {handleEditUserSubmit}
    {currentUser}
  />
{/if}

{#if showDeleteConfirmationModal && selectedUser}
  <DeleteUserModal
    {selectedUser}
    {closeModals}
    {formError}
    {isSubmitting}
    {handleDeleteUser}
  />
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
