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
  };

  // Open new user modal
  function openNewUserModal() {
    showNewUserModal = true;
  }

  // Open edit modal
  function openEditModal(user) {
    editUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    showEditUserModal = true;
  }

  // Open delete confirmation modal
  function openDeleteModal(user) {
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

      // Logic to create new user would go here
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNewUserModal = false;
      isSubmitting = false;

      // Reset form
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
  async function handleEditUserSubmit() {
    formError = null;
    isSubmitting = true;

    try {
      // Validation
      if (!editUser.username) {
        throw new Error("Voer een gebruikersnaam in");
      }
      if (!editUser.email) {
        throw new Error("Voer een e-mailadres in");
      }

      // Logic to update user would go here
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showEditUserModal = false;
      isSubmitting = false;
    } catch (error) {
      formError = error.message;
      isSubmitting = false;
    }
  }

  // Handle user deletion
  async function handleDeleteUser() {
    isSubmitting = true;

    try {
      // Logic to delete user would go here
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showDeleteConfirmationModal = false;
      isSubmitting = false;
      selectedUser = null;
    } catch (error) {
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
