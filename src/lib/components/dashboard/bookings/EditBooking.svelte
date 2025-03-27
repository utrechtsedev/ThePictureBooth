<!-- component/EditBooking.svelte -->
<script>
  import { fade, slide } from 'svelte/transition';
  
  // Props
  export let show = false;
  export let booking = null;
  export let onClose = () => {};
  export let onSave = () => {};
  
  // Local state for form data
  let formData = { 
    customer: { name: '', email: '', phone: '', id: '' },
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    package: '',
    price: 0,
    status: '',
    paymentStatus: '',
    notes: ''
  };
  
  // Update form data when booking prop changes
  $: if (booking) {
    formData = { ...booking };
  }
  
  // Helper function to get customer initials
  function getCustomerInitials(name) {
    return name.split(' ').map(part => part[0]).join('');
  }
  
  // Helper functions
  function getStatusOptions() {
    return [
      { value: 'pending', label: 'In afwachting' },
      { value: 'confirmed', label: 'Bevestigd' },
      { value: 'completed', label: 'Voltooid' },
      { value: 'cancelled', label: 'Geannuleerd' }
    ];
  }
  
  function getPaymentStatusOptions() {
    return [
      { value: 'unpaid', label: 'Niet betaald' },
      { value: 'deposit_paid', label: 'Aanbetaling' },
      { value: 'paid', label: 'Volledig betaald' }
    ];
  }
  
  function getPackageOptions() {
    return [
      { value: 'Basic', label: 'Basic (€395)' },
      { value: 'Standard', label: 'Standard (€495)' },
      { value: 'Premium', label: 'Premium (€595)' },
      { value: 'Deluxe', label: 'Deluxe (€695)' }
    ];
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
  }
  
  function setDefaultPrice() {
    switch(formData.package) {
      case 'Basic': formData.price = 395; break;
      case 'Standard': formData.price = 495; break;
      case 'Premium': formData.price = 595; break;
      case 'Deluxe': formData.price = 695; break;
    }
  }
</script>

{#if show && booking}
  <div 
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
    on:click={onClose}
  >
    <div 
      transition:slide={{ duration: 300, axis: 'x' }}
      class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
      on:click|stopPropagation
    >
      <form on:submit={handleSubmit} class="h-full flex flex-col">
        <div class="p-6 space-y-6 flex-grow overflow-y-auto">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Boeking Bewerken</h2>
            <button 
              type="button"
              on:click={onClose}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Customer Information Section (Read-Only) -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Klantgegevens</h3>
            <div class="flex items-center pb-4">
              <div class="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xl font-medium">
                {getCustomerInitials(formData.customer.name)}
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{formData.customer.name}</h3>
                <div class="text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                  <div class="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/>
                    </svg>
                    {formData.customer.email}
                  </div>
                  <div class="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                    </svg>
                    {formData.customer.phone}
                  </div>
                </div>
                <a href="/dashboard/klanten/{formData.customer.id || ''}" class="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block">
                  Klantprofiel bekijken
                </a>
              </div>
            </div>
          </div>
          
          <!-- Event Details Section -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Evenement Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="event-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type Evenement</label>
                <input
                  type="text"
                  id="event-type"
                  bind:value={formData.eventType}
                  placeholder="Type evenement"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="event-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Datum</label>
                <input
                  type="date"
                  id="event-date"
                  bind:value={formData.date}
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="start-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starttijd</label>
                <input
                  type="time"
                  id="start-time"
                  bind:value={formData.startTime}
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="end-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eindtijd</label>
                <input
                  type="time"
                  id="end-time"
                  bind:value={formData.endTime}
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="md:col-span-2">
                <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Locatie</label>
                <input
                  type="text"
                  id="location"
                  bind:value={formData.location}
                  placeholder="Adres of naam locatie"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Package & Payment Section -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Pakket & Betaling</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="package" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pakket</label>
                <select
                  id="package"
                  bind:value={formData.package}
                  on:change={setDefaultPrice}
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {#each getPackageOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prijs (€)</label>
                <input
                  type="number"
                  id="price"
                  bind:value={formData.price}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="payment-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Betalingsstatus</label>
                <select
                  id="payment-status"
                  bind:value={formData.paymentStatus}
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {#each getPaymentStatusOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  id="status"
                  bind:value={formData.status}
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {#each getStatusOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
          
          <!-- Notes Section -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notities</label>
            <textarea
              id="notes"
              bind:value={formData.notes}
              rows="3"
              placeholder="Eventuele opmerkingen of speciale wensen"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
        </div>
        
        <!-- Bottom action buttons -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              on:click={onClose}
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuleren
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Wijzigingen Opslaan
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}