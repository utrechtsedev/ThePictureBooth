<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import "../../app.css";
  
  let email = '';
  let password = '';
  let loading = false;
  let error = null;
  let prefersDarkMode = false;
  let showPassword = false;
  
  onMount(() => {
    // Check for dark mode preference
    prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  async function handleSubmit() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const redirectTo = $page.url.searchParams.get('redirectTo') || '/dashboard';
        goto(redirectTo);
      } else {
        error = data.message || 'Login failed';
      }
    } catch (err) {
      error = 'An error occurred. Please try again.';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
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
        Welkom terug
      </h2>
      <p class="mt-2 text-center text-sm {prefersDarkMode ? 'text-gray-400' : 'text-gray-600'}">
        Log in bij je Picture Booth account
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
        
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium {prefersDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1">
              E-mailadres
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.275-1.125q-.675.75-1.588 1.125T12 17q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.538 1.463T17 12v1.45q0 .725.45 1.137T18.5 15q.6 0 1.05-.413T20 13.45V12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20q1.725 0 3.3-.712t2.85-2.088q.275-.275.687-.262t.663.287q.275.275.263.688t-.288.662q-1.625 1.75-3.662 2.638T12 22m0-7q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15" />
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
            <label for="password" class="block text-sm font-medium {prefersDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1">
              Wachtwoord
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.712T12 15q-.425 0-.712.288T11 16q0 .425.288.713T12 17m-4-4h8v-3.5q0-1.675-1.163-2.838T12 5.5q-1.675 0-2.837 1.163T8 9.5V13m9.8 9H6.2q-.825 0-1.412-.587T4.2 20V10q0-.825.588-1.412T6.2 8h11.6q.825 0 1.413.588T19.8 10v10q0 .825-.587 1.413T17.8 22" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                bind:value={password}
                class="block w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm transition duration-200 
                  {prefersDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/30'} 
                  focus:outline-none focus:ring-4 focus:z-10"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm {prefersDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}"
                on:click={togglePasswordVisibility}
              >
                {#if showPassword}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 16q1.875 0 3.188-1.312T16.5 11.5q0-1.875-1.312-3.187T12 7q-1.875 0-3.187 1.313T7.5 11.5q0 1.875 1.313 3.188T12 16m0-1.8q-1.125 0-1.912-.788T9.3 11.5q0-1.125.788-1.912T12 8.8q1.125 0 1.913.788T14.7 11.5q0 1.125-.787 1.913T12 14.2m0 4.8q-3.475 0-6.35-1.887T1.3 11.5q1.375-3.625 4.25-5.513T12 4.1q3.475 0 6.35 1.887T22.7 11.5q-1.375 3.625-4.25 5.513T12 19" />
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m2.1 19.7l4.386-4.386q-1.361-1.242-2.186-2.55T3.1 10.07q1.35-3.35 4.25-5.15T14 3.14q1.875 0 3.562.5T20.6 5.014l1.414-1.414L23.3 4.9l-2.1 2.1l-18 18L2 23.9zm10.35-1.714q-.25.014-.475.014q-.225 0-.475-.014q.25.014.475.014q.225 0 .475-.014M12 17q.686 0 1.33-.148l-1.445-1.445q-.121.03-.239.044q-.118.015-.246.015q-1.194 0-2.037-.831Q8.5 13.804 8.5 12.58q0-.117.014-.235q.015-.118.046-.24L7.115 10.66Q7 11.125 6.963 11.581Q6.925 12.037 6.925 12.5q0 2.116 1.48 3.596q1.48 1.48 3.595 1.48m8.75-5.75q-.062.486-.177.954Q20.459 12.67 20.3 13.1l1.1 1.1q.52-.77.9-1.625t.65-1.825q-1.325-3.3-4.175-5.075T12 3.9q-.725 0-1.432.094t-1.418.306l1.15 1.15q.3-.05.625-.075q.325-.025.675-.025q3.35 0 5.888 1.8q2.537 1.8 3.762 4.9M12 9q.777 0 1.333.542Q13.89 10.083 13.9 10.85l.1.15z" />
                  </svg>
                {/if}
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 focus:ring-blue-500 border-gray-300 rounded {prefersDarkMode ? 'bg-gray-700 border-gray-600' : ''}"
            />
            <label for="remember-me" class="ml-2 block text-sm {prefersDarkMode ? 'text-gray-300' : 'text-gray-900'}">
              Onthoud mij
            </label>
          </div>
          
          <div class="text-sm">
            <a href="/forgot-password" class="font-medium {prefersDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}">
              Wachtwoord vergeten?
            </a>
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
              Bezig met inloggen...
            {:else}
              Inloggen
            {/if}
          </button>
        </div>
      </form>
    </div>
    
    <div class="mt-4 text-center">
      <p class="text-sm {prefersDarkMode ? 'text-gray-400' : 'text-gray-600'}">
        Nog geen account?
        <a href="/register" class="font-medium {prefersDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}">
          Registreer nu
        </a>
      </p>
    </div>
  </div>
</div>