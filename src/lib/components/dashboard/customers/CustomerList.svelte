<!-- src/lib/components/dashboard/customers/CustomerList.svelte -->
<script>
  import { createEventDispatcher } from "svelte";

  export let customers = [];
  export let selectedCustomers = [];
  export let formatCurrency;
  export let formatDate;

  const dispatch = createEventDispatcher();

  // Function to select or deselect all customers
  function selectAll(event) {
    if (event.target.checked) {
      dispatch("selectAll", customers);
    } else {
      dispatch("deselectAll");
    }
  }

  function getTotalValue(customer) {
    return customer.reservations
      ? customer.reservations.reduce(
          (sum, res) => sum + Number(res.total_price),
          0,
        )
      : 0;
  }

  function getLatestEventDate(customer) {
    if (!customer.reservations || customer.reservations.length === 0)
      return null;
    return customer.reservations.reduce((latest, res) => {
      const eventDate = new Date(res.event_date);
      return latest > eventDate ? latest : eventDate;
    }, new Date(0));
  }

  function getCustomerType(customer) {
    return customer.company_name ? "business" : "individual";
  }

  function isSelected(customer) {
    return selectedCustomers.some((c) => c.id === customer.id);
  }

  function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  function getRandomColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    ];

    return colors[Math.abs(hash) % colors.length];
  }

  function viewDetails(customer) {
    dispatch("viewDetails", customer);
  }

  function toggleSelection(customer) {
    dispatch("toggleSelection", customer);
  }

  function emailCustomer(customer) {
    dispatch("emailCustomer", customer);
  }

  function editCustomer(customer) {
    dispatch("editCustomer", customer);
  }
</script>

{#if customers.length === 0}
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
  >
    <div class="flex flex-col items-center justify-center text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5S5.5 6.57 5.5 8.5S7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm.05 10H4.77c.99-.5 2.7-1 4.23-1c.11 0 .23.01.34.01c.34-.73.93-1.33 1.64-1.81c-.73-.13-1.42-.2-1.98-.2c-2.34 0-7 1.17-7 3.5V19h7v-1.5c0-.17.02-.34.05-.5zm7.45-2.5c-1.84 0-5.5 1.01-5.5 3V19h11v-1.5c0-1.99-3.66-3-5.5-3zm1.21-1.82c.76-.43 1.29-1.24 1.29-2.18a2.5 2.5 0 0 0-5 0c0 .94.53 1.75 1.29 2.18c.36.2.77.32 1.21.32s.85-.12 1.21-.32z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">
        Geen klanten gevonden
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
        Er zijn geen klanten die voldoen aan je zoekcriteria. Probeer andere
        filters of voeg een nieuwe klant toe.
      </p>
    </div>
  </div>
{:else}
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900/30">
          <tr>
            <th
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              <input
                type="checkbox"
                checked={selectedCustomers.length === customers.length &&
                  customers.length > 0}
                on:change={selectAll}
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
              />
            </th>
            <th
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Klant
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Klant sinds
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Laatste boeking
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Evenementen
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Omzet
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Acties
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
        >
          {#each customers as customer}
            <tr
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
            >
              <td class="px-3 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isSelected(customer)}
                  on:change={() => toggleSelection(customer)}
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                />
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 rounded-full {getRandomColor(
                      `${customer.first_name} ${customer.last_name}`,
                    )} flex items-center justify-center text-sm font-medium"
                  >
                    {getInitials(customer.first_name, customer.last_name)}
                  </div>
                  <div class="ml-4">
                    <div
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {customer.first_name}
                      {customer.last_name}
                    </div>
                    {#if customer.company_name}
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {customer.company_name}
                      </div>
                    {/if}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">
                  {customer.email}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {customer.phone}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {formatDate(customer.created_at)}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {#if getLatestEventDate(customer)}
                  {formatDate(getLatestEventDate(customer))}
                {:else}
                  <span class="text-gray-400 dark:text-gray-600">Geen</span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {customer.reservations ? customer.reservations.length : 0}
                </div>
                {#if customer.reservations && customer.reservations.length > 0}
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {customer.reservations.map((r) => r.event_type).join(", ")}
                  </div>
                {/if}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
              >
                {formatCurrency(getTotalValue(customer))}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    on:click={() => emailCustomer(customer)}
                    class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    title="E-mail klant"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z"
                      />
                    </svg>
                  </button>
                  <button
                    on:click={() => viewDetails(customer)}
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Details
                  </button>
                  <button
                    on:click={() => editCustomer(customer)}
                    class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Bewerken
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
