<!-- src/lib/components/dashboard/finances/ExpenseDetails.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let expense;
  export let formatCurrency;
  export let formatDate;

  const dispatch = createEventDispatcher();

  function close(e) {
    e.stopPropagation();
    dispatch("close");
  }

  // Editable expense copy
  let editedExpense = { ...expense };

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

  // Save changes
  function saveChanges() {
    // In a real app, this would send the updated data to the server
    console.log("Saving expense:", editedExpense);

    // Close drawer
    dispatch("close");
  }

  // Delete expense
  function deleteExpense() {
    if (confirm("Weet je zeker dat je deze uitgave wilt verwijderen?")) {
      // In a real app, this would send a delete request to the server
      console.log("Deleting expense:", expense.id);

      // Close drawer
      dispatch("close");
    }
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "x" }}
  class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
  on:click|stopPropagation
>
  {#if expense}
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Uitgave details
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

      <div
        class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <div class="text-sm text-blue-700 dark:text-blue-300 font-medium">
            Uitgave ID
          </div>
          <div class="text-xl text-blue-800 dark:text-blue-200 font-bold">
            {expense.id}
          </div>
        </div>
        <div class="text-blue-600 dark:text-blue-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z"
            />
          </svg>
        </div>
      </div>

      <!-- Expense Form -->
      <form class="space-y-5" on:submit|preventDefault={saveChanges}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Description -->
          <div class="md:col-span-2">
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Omschrijving</label
            >
            <input
              type="text"
              id="description"
              bind:value={editedExpense.description}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Category -->
          <div>
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Categorie</label
            >
            <select
              id="category"
              bind:value={editedExpense.category}
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
              for="amount"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Bedrag</label
            >
            <div class="relative">
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400"
                >€</span
              >
              <input
                type="number"
                id="amount"
                bind:value={editedExpense.amount}
                step="0.01"
                min="0"
                class="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Date -->
          <div>
            <label
              for="date"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Datum</label
            >
            <input
              type="date"
              id="date"
              bind:value={editedExpense.date}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Vendor -->
          <div>
            <label
              for="vendor"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Leverancier</label
            >
            <input
              type="text"
              id="vendor"
              bind:value={editedExpense.vendor}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Payment Method -->
          <div>
            <label
              for="payment-method"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Betaalmethode</label
            >
            <select
              id="payment-method"
              bind:value={editedExpense.paymentMethod}
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {#each paymentMethods as method}
                <option value={method}>{method}</option>
              {/each}
            </select>
          </div>

          <!-- Tax Deductible -->
          <div>
            <label
              for="tax-deductible"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Fiscaal aftrekbaar</label
            >
            <div class="flex items-center h-10 px-2">
              <input
                type="checkbox"
                id="tax-deductible"
                bind:checked={editedExpense.taxDeductible}
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label
                for="tax-deductible"
                class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Aftrekbaar van belasting
              </label>
            </div>
          </div>

          <!-- Receipt Upload -->
          <div class="md:col-span-2">
            <label
              for="receipt"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Bon / Factuur</label
            >
            <div class="flex items-center space-x-2">
              <input
                type="text"
                id="receipt"
                value={editedExpense.receiptUrl || ""}
                readonly
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
              <button
                type="button"
                class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label
              for="notes"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Notities</label
            >
            <textarea
              id="notes"
              bind:value={editedExpense.notes}
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
        </div>

        <div
          class="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            on:click={deleteExpense}
            class="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1.5"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
            Verwijderen
          </button>

          <div class="space-x-3">
            <button
              type="button"
              on:click={close}
              class="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Annuleren
            </button>

            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Wijzigingen opslaan
            </button>
          </div>
        </div>
      </form>
    </div>
  {/if}
</div>
