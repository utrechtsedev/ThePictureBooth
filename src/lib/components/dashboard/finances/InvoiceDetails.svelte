<!-- src/lib/components/dashboard/finances/InvoiceDetails.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let invoice;
  export let formatCurrency;
  export let formatDate;

  const dispatch = createEventDispatcher();

  function close(e) {
    e.stopPropagation();
    dispatch("close");
  }

  function getInvoiceStatus(invoice) {
    if (invoice.payment_status === "paid") {
      return "paid";
    } else if (new Date(invoice.due_date) > new Date()) {
      return "pending";
    } else {
      return "overdue";
    }
  }

  function getInvoiceStatusClass(invoice) {
    const status = getInvoiceStatus(invoice);
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  function getInvoiceStatusLabel(invoice) {
    const status = getInvoiceStatus(invoice);
    switch (status) {
      case "paid":
        return "Betaald";
      case "pending":
        return "In afwachting";
      case "overdue":
        return "Te laat";
      default:
        return status;
    }
  }

  function isOverdue(invoice) {
    return (
      new Date(invoice.due_date) < new Date() &&
      invoice.payment_status !== "paid"
    );
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "x" }}
  class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
  on:click|stopPropagation
>
  {#if invoice}
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Factuurdetails
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
            Factuurnummer
          </div>
          <div class="text-xl text-blue-800 dark:text-blue-200 font-bold">
            {invoice.invoice_number}
          </div>
        </div>
        <span
          class="px-4 py-1.5 rounded-full text-sm font-semibold {getInvoiceStatusClass(
            invoice,
          )}"
        >
          {getInvoiceStatusLabel(invoice)}
        </span>
      </div>

      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Klant
            </h3>
            <p class="text-lg font-medium text-gray-900 dark:text-white mt-1">
              {invoice.Customer.first_name}
              {invoice.Customer.last_name}
            </p>
            <p class="text-gray-600 dark:text-gray-300">
              {invoice.Customer.email}
            </p>
          </div>
          <div class="text-right">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Evenement
            </h3>
            <p class="text-lg font-medium text-gray-900 dark:text-white mt-1">
              {invoice.Reservation.event_type || "Onbekend"}
            </p>
            <p class="text-gray-600 dark:text-gray-300">
              {formatDate(invoice.Reservation.event_date)}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Factuurbedrag
          </h3>
          <p class="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(invoice.amount)}
          </p>
        </div>

        <div class="flex justify-between">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Datum verzonden
          </h3>
          <p class="text-gray-700 dark:text-gray-300">
            {formatDate(invoice.invoice_date)}
          </p>
        </div>

        <div class="flex justify-between">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Uiterste betaaldatum
          </h3>
          <p class="text-gray-700 dark:text-gray-300">
            {formatDate(invoice.due_date)}
          </p>
        </div>

        {#if invoice.payment_status === "paid"}
          <div class="flex justify-between">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Betaald op
            </h3>
            <p class="text-green-600 dark:text-green-400">
              {formatDate(invoice.updated_at)}
            </p>
          </div>
        {:else}
          <div class="flex justify-between">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Dagen tot uiterste datum
            </h3>
            <p
              class={isOverdue(invoice)
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"}
            >
              {Math.ceil(
                (new Date(invoice.due_date) - new Date()) /
                  (1000 * 60 * 60 * 24),
              )} dagen
            </p>
          </div>
        {/if}
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Factuurregels
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between py-2">
            <span class="text-gray-700 dark:text-gray-300"
              >Foto Booth Package - {invoice.Reservation.event_type ||
                "Evenement"}</span
            >
            <span class="text-gray-900 dark:text-white font-medium"
              >{formatCurrency(invoice.amount * 0.85)}</span
            >
          </div>
          <div
            class="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-700 dark:text-gray-300 font-medium"
              >Subtotaal</span
            >
            <span class="text-gray-900 dark:text-white font-medium"
              >{formatCurrency(invoice.amount)}</span
            >
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-700 dark:text-gray-300">BTW (21%)</span>
            <span class="text-gray-900 dark:text-white"
              >{formatCurrency(invoice.amount * 0.21)}</span
            >
          </div>
          <div
            class="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700 font-bold"
          >
            <span class="text-gray-900 dark:text-white">Totaal</span>
            <span class="text-gray-900 dark:text-white"
              >{formatCurrency(invoice.amount * 1.21)}</span
            >
          </div>
        </div>
      </div>

      <div class="pt-4 flex justify-between">
        <button
          class="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
            />
          </svg>
          <a href={invoice.url} target="_blank"></a>
          Downloaden
        </button>
        <div>
          {#if invoice.payment_status !== "paid"}
            <button
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg mr-2 hover:bg-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"
                />
              </svg>
              Als betaald markeren
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
