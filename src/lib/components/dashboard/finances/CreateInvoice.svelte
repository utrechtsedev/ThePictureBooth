<!-- src/lib/components/dashboard/finances/CreateInvoice.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let formatCurrency;

  const dispatch = createEventDispatcher();
  let isGenerating = false;
  let generatedUrl = null;

  function close(e) {
    e.stopPropagation();
    dispatch("close");
  }

  // Form state
  let invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  let customerName = "";
  let customerEmail = "";
  let invoiceDate = new Date().toISOString().split("T")[0];

  // Calculate due date (14 days from now)
  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  dueDate = dueDate.toISOString().split("T")[0];

  let items = [
    {
      description: "",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ];

  let notes = "";

  // Calculations
  $: subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  $: vat = subtotal * 0.21;
  $: total = subtotal + vat;

  // Update item total when quantity or price changes
  function updateItemTotal(index) {
    items[index].total = items[index].quantity * item.price;
    items = [...items]; // Trigger reactivity
  }

  // Add a new line item
  function addItem() {
    items = [
      ...items,
      {
        description: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ];
  }

  // Remove a line item
  function removeItem(index) {
    items = items.filter((_, i) => i !== index);
  }

  // Generate and download invoice
  async function generateInvoice() {
    if (isGenerating) return;

    // Validate required fields
    if (
      !customerName ||
      items.some((item) => !item.description || item.quantity <= 0)
    ) {
      alert("Vul alle verplichte velden in.");
      return;
    }

    isGenerating = true;

    try {
      const response = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceNumber,
          customerName,
          customerEmail,
          invoiceDate,
          dueDate,
          items,
          notes,
          subtotal,
          vat,
          total,
        }),
      });

      const result = await response.json();

      if (result.success) {
        generatedUrl = result.url;
        window.open(result.url, "_blank");
      } else {
        alert(`Fout bij het genereren van de factuur: ${result.message}`);
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Er is een fout opgetreden bij het genereren van de factuur");
    } finally {
      isGenerating = false;
    }
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "y" }}
  class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
  on:click|stopPropagation
>
  <div class="flex justify-between items-start mb-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
      Nieuwe Factuur Aanmaken
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

  <!-- Invoice Form -->
  <form class="space-y-6" on:submit|preventDefault={generateInvoice}>
    <!-- Customer Information -->
    <div>
      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Klantgegevens
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="customer-name"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Klantnaam *</label
          >
          <input
            type="text"
            id="customer-name"
            bind:value={customerName}
            placeholder="Naam van de klant"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label
            for="customer-email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >E-mail</label
          >
          <input
            type="email"
            id="customer-email"
            bind:value={customerEmail}
            placeholder="email@voorbeeld.nl"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Invoice Details -->
    <div>
      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Factuurgegevens
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="invoice-number"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Factuurnummer</label
          >
          <input
            type="text"
            id="invoice-number"
            bind:value={invoiceNumber}
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label
            for="invoice-date"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Factuurdatum</label
          >
          <input
            type="date"
            id="invoice-date"
            bind:value={invoiceDate}
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label
            for="due-date"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Vervaldatum</label
          >
          <input
            type="date"
            id="due-date"
            bind:value={dueDate}
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Invoice Items -->
    <div>
      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Factuurregels
      </h3>
      <div
        class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/30">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Omschrijving *</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Aantal *</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Prijs *</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >Totaal</th
              >
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            {#each items as item, index}
              <tr>
                <td class="px-4 py-3 whitespace-nowrap">
                  <input
                    type="text"
                    bind:value={item.description}
                    placeholder="Omschrijving"
                    required
                    class="w-full px-2 py-1 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white rounded"
                  />
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    min="1"
                    bind:value={item.quantity}
                    on:input={() => updateItemTotal(index)}
                    required
                    class="w-16 px-2 py-1 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white rounded"
                  />
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400 mr-1">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      bind:value={item.price}
                      on:input={() => updateItemTotal(index)}
                      required
                      class="w-24 px-2 py-1 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white rounded"
                    />
                  </div>
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300"
                >
                  {formatCurrency(item.total)}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right">
                  <button
                    type="button"
                    on:click={() => removeItem(index)}
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    disabled={items.length === 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        on:click={addItem}
        class="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        Regel toevoegen
      </button>

      <div class="mt-4 flex justify-end">
        <div class="w-64 space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-700 dark:text-gray-300">Subtotaal</span>
            <span class="text-gray-900 dark:text-white"
              >{formatCurrency(subtotal)}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-700 dark:text-gray-300">BTW (21%)</span>
            <span class="text-gray-900 dark:text-white"
              >{formatCurrency(vat)}</span
            >
          </div>
          <div
            class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
          >
            <span class="font-bold text-gray-900 dark:text-white">Totaal</span>
            <span class="font-bold text-gray-900 dark:text-white"
              >{formatCurrency(total)}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Options -->
    <div>
      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Aanvullende opties
      </h3>
      <div>
        <label
          for="notes"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >Factuurnotities</label
        >
        <textarea
          id="notes"
          rows="2"
          bind:value={notes}
          placeholder="Notities voor op de factuur"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        ></textarea>
      </div>
    </div>

    {#if generatedUrl}
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <p class="text-green-800 dark:text-green-300 mb-2">
          Factuur succesvol gegenereerd!
        </p>
        <a
          href={generatedUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
            />
          </svg>
          Klik hier om de factuur opnieuw te downloaden
        </a>
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
        disabled={isGenerating}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
      >
        {#if isGenerating}
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
          Bezig met genereren...
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
            />
          </svg>
          Factuur downloaden
        {/if}
      </button>
    </div>
  </form>
</div>

