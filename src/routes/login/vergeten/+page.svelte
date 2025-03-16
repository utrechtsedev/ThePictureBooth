<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import "../../../app.css";
    
    let email = '';
    let loading = false;
    let error = null;
    let success = null;
    let prefersDarkMode = false;
    
    onMount(() => {
      // Check for dark mode preference
      prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    async function handleSubmit() {
      loading = true;
      error = null;
      success = null;
      
      try {
        // Simulate API request
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
          success = 'Wachtwoord reset instructies zijn verstuurd naar je e-mail.';
          email = ''; // Clear the form
        } else {
          error = data.message || 'Er is een fout opgetreden bij het verwerken van je verzoek.';
        }
      } catch (err) {
        // In real application this would check for response from API
        // For demo, we'll show success message
        success = 'Wachtwoord reset instructies zijn verstuurd naar je e-mail.';
        console.error(err);
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300
    {prefersDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}">
    
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Logo -->
        <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
          PB
        </div>
        
        <h2 class="mt-6 text-center text-3xl font-extrabold {prefersDarkMode ? 'text-white' : 'text-gray-900'}">
          Wachtwoord vergeten
        </h2>
        <p class="mt-2 text-center text-sm {prefersDarkMode ? 'text-gray-400' : 'text-gray-600'}">
          Voer je e-mailadres in om een wachtwoord reset link te ontvangen
        </p>
      </div>
      
      <div class="{prefersDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg p-6 border transition-all duration-300"
        in:fly={{y: 20, duration: 300}}>
        
        <form class="space-y-5" on:submit|preventDefault={handleSubmit}>
          {#if error}
            <div class="rounded-xl bg-red-500/10 p-4 border border-red-200 {prefersDarkMode ? 'border-red-900' : ''}"
              in:fade={{duration: 200}}>
              <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.712T12 15q-.425 0-.712.288T11 16q0 .425.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8v4q0 .425.288.713T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22" />
                </svg>
                <p class="text-sm font-medium {prefersDarkMode ? 'text-red-400' : 'text-red-800'}">{error}</p>
              </div>
            </div>
          {/if}
          
          {#if success}
            <div class="rounded-xl bg-green-500/10 p-4 border border-green-200 {prefersDarkMode ? 'border-green-900' : ''}"
              in:fade={{duration: 200}}>
              <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <p class="text-sm font-medium {prefersDarkMode ? 'text-green-400' : 'text-green-800'}">{success}</p>
              </div>
            </div>
          {/if}
          
          <div>
            <label for="email" class="block text-sm font-medium {prefersDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1">
              E-mailadres
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44z" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                bind:value={email}
                class="block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition duration-200 
                  {prefersDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/30'} 
                  focus:outline-none focus:ring-4 focus:z-10"
                placeholder="naam@voorbeeld.nl"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl
                text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all duration-200
                shadow-md hover:shadow-lg shadow-blue-500/20"
            >
              {#if loading}
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Bezig met versturen...
              {:else}
                Verstuur reset link
              {/if}
            </button>
          </div>
        </form>
      </div>
      
      <div class="mt-4 text-center">
        <p class="text-sm {prefersDarkMode ? 'text-gray-400' : 'text-gray-600'}">
          <a href="/login" class="font-medium {prefersDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" viewBox="0 0 24 24">
              <path fill="currentColor" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.3-.7.313t-.7-.288L5.15 13.175q-.3-.3-.3-.7t.3-.7L11.3 5.625q.3-.3.7-.288t.7.313q.3.3.313.7t-.288.7L7.825 12H19q.425 0 .713.288T20 13q0 .425-.288.713T19 14z" />
            </svg>
            Terug naar inloggen
          </a>
        </p>
      </div>
    </div>
  </div>