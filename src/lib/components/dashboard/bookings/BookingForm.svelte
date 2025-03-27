<script>
    import { fade, slide } from 'svelte/transition';
    
    // Props
    export let show = false;
    export let onClose = () => {};
    export let onSubmit = () => {};
    
    function handleClose() {
      onClose();
    }
    
    function handleSubmit(event) {
      event.preventDefault();
      onSubmit();
    }
  </script>
  
  {#if show}
    <div 
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
      on:click={handleClose}
    >
      <div 
        transition:slide={{ duration: 300, axis: 'y' }}
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
        on:click|stopPropagation
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nieuwe Boeking Toevoegen</h2>
          <button 
            on:click={handleClose}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Booking Form -->
        <form class="space-y-6" on:submit={handleSubmit}>
          <!-- Customer Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Klantgegevens</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="customer-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naam</label>
                <input
                  type="text"
                  id="customer-name"
                  placeholder="Volledige naam"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="customer-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                <input
                  type="email"
                  id="customer-email"
                  placeholder="email@voorbeeld.nl"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="customer-phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefoon</label>
                <input
                  type="tel"
                  id="customer-phone"
                  placeholder="06-12345678"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Event Information -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Evenement Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="event-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type Evenement</label>
                <select
                  id="event-type"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecteer type</option>
                  <option value="Bruiloft">Bruiloft</option>
                  <option value="Bedrijfsfeest">Bedrijfsfeest</option>
                  <option value="Verjaardag">Verjaardag</option>
                  <option value="Jubileum">Jubileum</option>
                  <option value="Afstuderen">Afstuderen</option>
                  <option value="Anders">Anders</option>
                </select>
              </div>
              <div>
                <label for="event-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Datum</label>
                <input
                  type="date"
                  id="event-date"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="start-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starttijd</label>
                <input
                  type="time"
                  id="start-time"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="end-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eindtijd</label>
                <input
                  type="time"
                  id="end-time"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="md:col-span-2">
                <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Locatie</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Adres of naam locatie"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <!-- Package & Payment -->
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Pakket & Betaling</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="package" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pakket</label>
                <select
                  id="package"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecteer pakket</option>
                  <option value="Basic">Basic (€395)</option>
                  <option value="Standard">Standard (€495)</option>
                  <option value="Premium">Premium (€595)</option>
                  <option value="Deluxe">Deluxe (€695)</option>
                </select>
              </div>
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prijs (€)</label>
                <input
                  type="number"
                  id="price"
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
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="unpaid">Niet betaald</option>
                  <option value="deposit_paid">Aanbetaling</option>
                  <option value="paid">Volledig betaald</option>
                </select>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  id="status"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">In afwachting</option>
                  <option value="confirmed">Bevestigd</option>
                  <option value="cancelled">Geannuleerd</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notities</label>
            <textarea
              id="notes"
              rows="3"
              placeholder="Eventuele opmerkingen of speciale wensen"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button" 
              on:click={handleClose}
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuleren
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Boeking Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}