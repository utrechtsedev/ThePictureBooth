<!-- src/lib/components/dashboard/finances/CreateExpense.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let formatCurrency;

  const dispatch = createEventDispatcher();

  function close(e) {
    e.stopPropagation();
    dispatch("close");
  }

  // New expense form data
  let expenseData = {
    description: "",
    category: "Apparatuur",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    paymentMethod: "Pinpas",
    taxDeductible: true,
    notes: "",
    receiptUrl: "",
  };

  // Available categories
  const categories = [
    "Apparatuur",
    "Software",
    "Vervoer",
    "Marketing",
    "Props & Accessoires",
    "Onderhoud",
    "Abonnementen",
    "Kantoorartikelen",
    "Verzekering",
    "Training",
    "Telefoon",
    "Overig",
  ];

  // Payment methods
  const paymentMethods = [
    "Pinpas",
    "Creditcard",
    "Automatische incasso",
    "Contant",
    "Bankoverboek",
    "PayPal",
    "Overig",
  ];

  // Receipt upload
  let fileInputRef;
  let uploadedFile = null;

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      uploadedFile = file;
      // In a real app, you would upload this to a server and get back a URL
      expenseData.receiptUrl = file.name;
    }
  }

  function openFileInput() {
    if (fileInputRef) {
      fileInputRef.click();
    }
  }

  // Submit form
  function submitForm() {
    // Validate form
    if (!expenseData.description || !expenseData.amount) {
      alert("Vul alstublieft alle verplichte velden in");
      return;
    }

    // Create a new expense ID
    const newExpenseId = `EXP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    // In a real app, this would send data to the server
    console.log({
      id: newExpenseId,
      ...expenseData,
    });

    // Close modal
    dispatch("close");
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "y" }}
  class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
  on:click|stopPropagation
>
  <div class="flex justify-between items-start mb-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
      Nieuwe Uitgave Toevoegen
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

  <!-- Expense Form -->
  <form class="space-y-6" on:submit|preventDefault={submitForm}>
    <!-- Basic Information -->
    <div>
      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Uitgave details
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Description -->
        <div class="md:col-span-2">
          <label
            for="expense-description"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Omschrijving *</label
          >
          <input
            type="text"
            id="expense-description"
            bind:value={expenseData.description}
            placeholder="Beschrijf de uitgave"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Category -->
        <div>
          <label
            for="expense-category"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Categorie *</label
          >
          <select
            id="expense-category"
            bind:value={expenseData.category}
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Amount -->
        <div>
          <label
            for="expense-amount"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Bedrag *</label
          >
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400"
              >€</span
            >
            <input
              type="number"
              id="expense-amount"
              bind:value={expenseData.amount}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              class="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Date -->
        <div>
          <label
            for="expense-date"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Datum *</label
          >
          <input
            type="date"
            id="expense-date"
            bind:value={expenseData.date}
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Vendor -->
        <div>
          <label
            for="expense-vendor"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Leverancier *</label
          >
          <input
            type="text"
            id="expense-vendor"
            bind:value={expenseData.vendor}
            placeholder="Naam van de verkoper"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Payment Method -->
        <div>
          <label
            for="expense-payment"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Betaalmethode</label
          >
          <select
            id="expense-payment"
            bind:value={expenseData.paymentMethod}
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {#each paymentMethods as method}
              <option value={method}>{method}</option>
            {/each}
          </select>
        </div>

        <!-- Tax Deductible -->
        <div>
          <div class="flex items-center h-full pt-6">
            <input
              type="checkbox"
              id="expense-tax"
              bind:checked={expenseData.taxDeductible}
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            />
            <label
              for="expense-tax"
              class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Fiscaal aftrekbaar
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div>
      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Aanvullende informatie
      </h3>

      <!-- Receipt Upload -->
      <div class="mb-4">
        <label
          for="expense-receipt"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >Bon / Factuur uploaden</label
        >
        <div class="flex items-center">
          <input
            type="file"
            id="expense-receipt"
            bind:this={fileInputRef}
            on:change={handleFileChange}
            class="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div
            class="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            on:click={openFileInput}
          >
            {#if uploadedFile}
              <div class="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-500 dark:text-green-400"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
                <span class="text-sm text-gray-700 dark:text-gray-300"
                  >{uploadedFile.name}</span
                >
              </div>
            {:else}
              <div class="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-gray-400 dark:text-gray-500 mb-1"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"
                  />
                </svg>
                <span class="text-sm text-gray-500 dark:text-gray-400"
                  >Sleep de bon hierheen of klik om te uploaden</span
                >
                <span class="text-xs text-gray-400 dark:text-gray-500 mt-1"
                  >(PDF, JPG of PNG)</span
                >
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label
          for="expense-notes"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >Notities</label
        >
        <textarea
          id="expense-notes"
          bind:value={expenseData.notes}
          rows="3"
          placeholder="Extra informatie over deze uitgave..."
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        ></textarea>
      </div>
    </div>

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
        Uitgave toevoegen
      </button>
    </div>
  </form>
</div>
