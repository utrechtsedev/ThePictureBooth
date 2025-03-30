<script>
  import { fade, slide } from 'svelte/transition';
  
  // Props
  export let show = false;
  export let booking = null;
  export let onClose = () => {};
  export let onSave = () => {};
  
  // Form state
  let isSubmitting = false;
  let formError = null;
  let formSuccess = null;
  
  // Local state for form data
  let formData = {
    id: '',
    customer_id: '',
    event_type: '',
    event_date: '',
    event_location: '',
    event_duration: '',
    total_price: '',
    deposit_amount: '',
    final_payment_amount: '',
    payment_status: 'deposit_paid',
    status: 'pending',
    admin_notes: ''
  };
  
  // Customer information (for display only)
  let customerInfo = {
    name: '',
    email: '',
    phone: '',
    id: ''
  };
  
  // Price based on duration
  const getDurationPrice = (durationHours) => {
    switch(parseInt(durationHours)) {
      case 2: return 250;
      case 3: return 350;
      case 4: return 450;
      case 5: return 550;
      default: return '';
    }
  };
  
  // Update form data when booking prop changes
  $: if (booking && show) {
    // Handle date formatting
    let dateStr = '';
    const eventDate = booking.event_date || booking.date;
    if (eventDate) {
      try {
        const dateObj = new Date(eventDate);
        dateStr = dateObj.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error parsing date:', error);
        dateStr = '';
      }
    }
    
    // Update customer info
    if (booking.Customer) {
      customerInfo = {
        name: `${booking.Customer.first_name} ${booking.Customer.last_name}`,
        email: booking.Customer.email,
        phone: booking.Customer.phone,
        id: booking.Customer.id
      };
    } else if (booking.customer) {
      customerInfo = { 
        name: booking.customer.name || `${booking.customer.first_name || ''} ${booking.customer.last_name || ''}`,
        email: booking.customer.email || '',
        phone: booking.customer.phone || '',
        id: booking.customer.id || ''
      };
    }
    
    // Update form data with values from booking - NO MONETARY VALUES
    formData = {
      id: booking.id || '',
      customer_id: booking.customer_id || (booking.customer ? booking.customer.id : ''),
      event_type: booking.event_type || booking.eventType || '',
      event_date: dateStr,
      event_location: booking.event_location || booking.location || '',
      event_duration: booking.event_duration || '',
      total_price: '', // EMPTY - ONLY PLACEHOLDER
      deposit_amount: '', // EMPTY - ONLY PLACEHOLDER
      final_payment_amount: '', // EMPTY - ONLY PLACEHOLDER
      payment_status: booking.payment_status || booking.paymentStatus || 'deposit_paid',
      status: booking.status || 'pending',
      admin_notes: booking.admin_notes || booking.notes || ''
    };
    
    // Set price placeholders
    setTimeout(() => {
      const totalPriceInput = document.getElementById('total-price');
      if (totalPriceInput) {
        totalPriceInput.placeholder = booking.total_price || booking.price || '0.00';
      }
      
      const depositInput = document.getElementById('deposit-amount');
      if (depositInput) {
        depositInput.placeholder = '100.00';
      }
      
      const finalPaymentInput = document.getElementById('final-payment');
      if (finalPaymentInput) {
        const total = parseFloat(booking.total_price || booking.price || 0);
        const deposit = 100;
        finalPaymentInput.placeholder = (total - deposit).toString();
      }
    }, 0);
    
    // Calculate final payment
    calculateFinalPayment();
  }
  
  // Helper function to calculate final payment
  function calculateFinalPayment() {
    const totalPrice = parseFloat(formData.total_price) || 0;
    const depositAmount = parseFloat(formData.deposit_amount) || 0;
    formData.final_payment_amount = (totalPrice - depositAmount).toString();
  }
  
  // Update final payment when total price or deposit changes
  $: {
    if (formData.total_price || formData.deposit_amount) {
      calculateFinalPayment();
    }
  }
  
  // Helper function to get customer initials
  function getCustomerInitials(name) {
    if (!name) return '';
    return name.split(' ').map(part => part[0] || '').join('');
  }
  
  // Helper function to get duration options
  function getDurationOptions() {
    return [
      { value: '2u', label: '2 uur (€250)' },
      { value: '3u', label: '3 uur (€350)' },
      { value: '4u', label: '4 uur (€450)' },
      { value: '5u', label: '5 uur (€550)' }
    ];
  }
  
  // Helper functions
  function getStatusOptions() {
    return [
      { value: 'pending', label: 'In afwachting' },
      { value: 'accepted', label: 'Geaccepteerd' },
      { value: 'declined', label: 'Afgewezen' },
      { value: 'cancelled', label: 'Geannuleerd' },
      { value: 'completed', label: 'Voltooid' }
    ];
  }
  
  function getPaymentStatusOptions() {
    return [
      { value: 'deposit_paid', label: 'Aanbetaling' },
      { value: 'final_pending', label: 'Restbetaling open' },
      { value: 'final_paid', label: 'Volledig betaald' }
    ];
  }
  
  function getEventTypeOptions() {
    return [
      { value: 'Bruiloft', label: 'Bruiloft' },
      { value: 'Bedrijfsfeest', label: 'Bedrijfsfeest' },
      { value: 'Verjaardag', label: 'Verjaardag' },
      { value: 'Jubileum', label: 'Jubileum' },
      { value: 'Afstuderen', label: 'Afstuderen' },
      { value: 'Anders', label: 'Anders' }
    ];
  }
  
  // When duration changes, suggest a price
  function handleDurationChange(e) {
    const duration = e.target.value;
    const durationHours = parseInt(duration);
    const price = getDurationPrice(durationHours);
    
    // Just update the placeholder, not the actual value
    const totalPriceInput = document.getElementById('total-price');
    if (totalPriceInput && price) {
      totalPriceInput.placeholder = price.toString();
    }
  }
  
  function handleClose() {
    formError = null;
    formSuccess = null;
    onClose();
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    formError = null;
    formSuccess = null;
    isSubmitting = true;
    
    try {
      // Validate required fields
      if (!formData.event_date) {
        throw new Error('Vul een datum in');
      }
      
      if (!formData.event_location) {
        throw new Error('Vul een locatie in');
      }
      
      if (!formData.event_duration) {
        throw new Error('Selecteer een duur');
      }
      
      if (!formData.total_price || parseFloat(formData.total_price) <= 0) {
        throw new Error('Vul een geldige prijs in');
      }
      
      // Format data for submission
      const submissionData = {
        customer_id: formData.customer_id,
        event_type: formData.event_type,
        event_date: formData.event_date, 
        event_location: formData.event_location,
        event_duration: formData.event_duration,
        total_price: parseFloat(formData.total_price),
        deposit_amount: parseFloat(formData.deposit_amount || 100),
        final_payment_amount: parseFloat(formData.final_payment_amount || 0),
        payment_status: formData.payment_status,
        status: formData.status,
        admin_notes: formData.admin_notes
      };
      
      // Send PATCH request
      const response = await fetch(`/dashboard/boekingen`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: formData.id,
          ...submissionData
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        formSuccess = 'Boeking succesvol bijgewerkt!';
        
        // Create a merged object that combines the updated data with the structure expected by the parent component
        const updatedBooking = {
          ...booking, // Keep original structure
          ...submissionData, // Add updated fields
          id: formData.id,
          price: parseFloat(formData.total_price), // Make sure both property formats exist
          paymentStatus: formData.payment_status,
          date: formData.event_date,
          location: formData.event_location,
          notes: formData.admin_notes
        };
        
        // Call the onSave callback with updated data
        onSave(updatedBooking);
        
        // Close the form after a short delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Er is een fout opgetreden bij het bijwerken van de boeking');
      }
    } catch (error) {
      formError = error.message;
      console.error('Error updating booking:', error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<style>
  /* Safari-specific fixes */
  input, select, textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 1;
    background-position: right center;
    background-size: 16px;
  }
  
  input[type="date"] {
    min-height: 38px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
  
  .full-width {
    grid-column: 1 / -1;
  }
</style>

{#if show && booking}
  <div 
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
    on:click={handleClose}
  >
    <div 
      transition:slide={{ duration: 300, axis: 'x' }}
      class="bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg h-full overflow-y-auto z-50"
      on:click|stopPropagation
    >
      <form on:submit={handleSubmit} class="h-full flex flex-col">
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-grow overflow-y-auto">
          <div class="flex justify-between items-start">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Boeking Bewerken</h2>
            <button 
              type="button"
              on:click={handleClose}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              disabled={isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {#if formError}
            <div class="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {formError}
            </div>
          {/if}
          
          {#if formSuccess}
            <div class="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
              {formSuccess}
            </div>
          {/if}
          
          <!-- Customer Information Section (Read-Only) -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-5">
            <h3 class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">Klantgegevens</h3>
            <div class="flex flex-col sm:flex-row sm:items-center pb-4">
              <div class="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-lg sm:text-xl font-medium">
                {getCustomerInitials(customerInfo.name)}
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-4">
                <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{customerInfo.name}</h3>
                <div class="text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                  <div class="flex items-center text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/>
                    </svg>
                    <span class="break-all">{customerInfo.email}</span>
                  </div>
                  <div class="flex items-center text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                    </svg>
                    {customerInfo.phone}
                  </div>
                </div>
                {#if customerInfo.id}
                  <a href="/dashboard/klanten/{customerInfo.id}" class="text-blue-600 dark:text-blue-400 text-xs sm:text-sm hover:underline mt-2 inline-block">
                    Klantprofiel bekijken
                  </a>
                {/if}
              </div>
            </div>
          </div>
          
          <!-- Event Details Section -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-5">
            <h3 class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">Evenement Details</h3>
            <div class="form-grid">
              <div class="full-width">
                <label for="event-type" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type Evenement</label>
                <select
                  id="event-type"
                  bind:value={formData.event_type}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  <option value="">Selecteer type</option>
                  {#each getEventTypeOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              
              <div>
                <label for="event-date" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Datum</label>
                <input
                  type="date"
                  id="event-date"
                  bind:value={formData.event_date}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label for="event-duration" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duur</label>
                <select
                  id="event-duration"
                  bind:value={formData.event_duration}
                  on:change={handleDurationChange}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  <option value="">Selecteer duur</option>
                  {#each getDurationOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              
              <div class="full-width">
                <label for="location" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Locatie</label>
                <input
                  type="text"
                  id="location"
                  bind:value={formData.event_location}
                  placeholder="Adres of naam locatie"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          
          <!-- Payment Section -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-5">
            <h3 class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">Betaling</h3>
            <div class="form-grid">
              <div>
                <label for="total-price" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Totaalprijs (€)</label>
                <input
                  type="text"
                  inputmode="decimal"
                  id="total-price"
                  bind:value={formData.total_price}
                  placeholder="0.00"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label for="deposit-amount" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aanbetaling (€)</label>
                <input
                  type="text"
                  inputmode="decimal"
                  id="deposit-amount"
                  bind:value={formData.deposit_amount}
                  placeholder="100.00"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label for="final-payment" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restbetaling (€)</label>
                <input
                  type="text"
                  id="final-payment"
                  value={formData.final_payment_amount ? formData.final_payment_amount : ""}
                  placeholder="0.00"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  disabled={true}
                />
              </div>
              
              <div>
                <label for="payment-status" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Betalingsstatus</label>
                <select
                  id="payment-status"
                  bind:value={formData.payment_status}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  {#each getPaymentStatusOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              
              <div class="full-width">
                <label for="status" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  id="status"
                  bind:value={formData.status}
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
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
            <label for="notes" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notities</label>
            <textarea
              id="notes"
              bind:value={formData.admin_notes}
              rows="3"
              placeholder="Eventuele opmerkingen of speciale wensen"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>
        
        <!-- Bottom action buttons -->
        <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3 sm:gap-0">
            <button 
              type="button" 
              on:click={handleClose}
              class="px-4 py-2 w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm order-2 sm:order-1"
              disabled={isSubmitting}
            >
              Annuleren
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 w-full sm:w-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm order-1 sm:order-2 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bezig met opslaan...
              {:else}
                Wijzigingen Opslaan
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}
