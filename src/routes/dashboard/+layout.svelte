<script>
  import { onMount, afterUpdate } from "svelte";
  import "../../app.css"; // ensure Tailwind is imported
  import '@fontsource-variable/figtree';
  import { page } from '$app/stores';
  import { fade, fly, slide } from 'svelte/transition';
  export let data;
  
  // Get user from the data returned by +layout.server.js
  const { user } = data;  
  let sidebarOpen = false;
  let loading = false;
  let profileDropdownOpen = false;
  let searchFocused = false;
  let prefersDarkMode = true;
  let touchStartX = 0;
  let windowWidth;

  onMount(async () => {
    // Check for dark mode preference
    prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Handle swipe gestures for mobile
    document.addEventListener('touchstart', handleTouchStart, {passive: true});
    document.addEventListener('touchend', handleTouchEnd, {passive: true});
    
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  });

  // Handle mobile swipe gestures
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }
  
  function handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    
    // If swipe from left edge, open sidebar
    if (diff > 100 && touchStartX < 50 && !sidebarOpen) {
      sidebarOpen = true;
    }
    
    // If swipe to left while sidebar is open, close it
    if (diff < -100 && sidebarOpen) {
      sidebarOpen = false;
    }
  }
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function toggleProfileDropdown() {
    profileDropdownOpen = !profileDropdownOpen;
  }

  function closeDropdowns() {
    profileDropdownOpen = false;
    searchFocused = false;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location = '/login';
  }

  // Check if route is active
  function isActive(path) {
    return $page.url.pathname.startsWith(path);
  }
  
  // Extract initials for avatar
  const initials = "A"; // Default to "A" for Admin
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div 
  id="figtree" 
  class="relative min-h-screen flex flex-col {prefersDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}"
>
  <!-- Top Navbar -->
  <header 
    class="z-30 flex items-center {prefersDarkMode ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white shadow-gray-100/80'} 
    backdrop-blur-md shadow-sm px-4 py-3 sticky top-0 h-16 transition-colors duration-300"
    in:fade={{duration: 300}}
  >
    <!-- Mobile Menu Button -->
    <button
      class="mr-4 {prefersDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} 
      p-2 rounded-full transition-all lg:hidden"
      on:click={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    
    <!-- Logo & Title -->
    <div class="flex items-center">
      <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 text-white font-bold text-xl shadow-lg shadow-blue-500/20">
        PB
      </div>
      <h1 class="text-lg font-semibold tracking-tight {prefersDarkMode ? 'text-white' : 'text-blue-800'}">
        <span class="hidden xs:inline">The </span>Picture Booth
      </h1>
    </div>

    <!-- Search Bar -->
    <div class="hidden md:flex mx-auto max-w-md w-full px-4 relative">
      <div 
        class="relative w-full rounded-full overflow-hidden {searchFocused ? 'ring-2' : ''} 
        {prefersDarkMode ? 'ring-blue-500/50 bg-gray-700/50' : 'ring-blue-300 bg-gray-50'} 
        transition-all duration-200"
      >
        <input 
          type="text" 
          placeholder="Zoeken naar boekingen, klanten..." 
          class="w-full px-4 py-2 pr-10 border-none outline-none {prefersDarkMode ? 'bg-gray-700/50 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-800 placeholder-gray-500'} text-sm"
          on:focus={() => searchFocused = true}
          on:blur={() => searchFocused = false}
        />
        <div class="absolute right-3 top-2.5 {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Right side items -->
    <div class="ml-auto flex items-center space-x-2 sm:space-x-3">
      <!-- Search Icon (Mobile) -->
      <button aria-label="search" class="relative p-2 {prefersDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-full transition-colors md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"/>
        </svg>
      </button>
      
      <!-- Notifications -->
      <button 
        aria-label="notifications" 
        class="relative p-2 {prefersDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8.352 20.242A4.63 4.63 0 0 0 12 22a4.63 4.63 0 0 0 3.648-1.758a27.2 27.2 0 0 1-7.296 0" />
          <path fill="currentColor" fill-rule="evenodd" d="M18.75 9.704V9c0-3.866-3.023-7-6.75-7S5.25 5.134 5.25 9v.704c0 .845-.24 1.671-.692 2.374L3.45 13.801c-1.011 1.574-.239 3.713 1.52 4.21a25.8 25.8 0 0 0 14.06 0c1.759-.497 2.531-2.636 1.52-4.21l-1.108-1.723a4.4 4.4 0 0 1-.693-2.374M12 5.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75" clip-rule="evenodd" />
        </svg>
        <span 
          class="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-xs font-medium 
          bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white 
          animate-pulse"
        >
          2
        </span>
      </button>
      
      <!-- Admin profile -->
      <div class="relative">
        <button 
          on:click={toggleProfileDropdown}
          class="flex items-center space-x-2 p-1.5 {prefersDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} 
          rounded-full transition-all"
          aria-label="User Menu"
        >
          <div 
            class="w-8 h-8 flex items-center justify-center rounded-full 
            bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-medium text-sm 
            shadow-md shadow-blue-500/20"
          >
            {initials}
          </div>
          <span class="text-sm font-medium hidden sm:inline">{user.username}</span>
          <svg class="h-4 w-4 {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Profile Dropdown -->
        {#if profileDropdownOpen}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div 
            class="fixed inset-0 z-10" 
            on:click={closeDropdowns}
            transition:fade={{duration: 100}}
          ></div>
          <div 
            class="absolute right-0 mt-2 w-48 {prefersDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
            rounded-xl shadow-xl py-1.5 z-20 border overflow-hidden"
            transition:slide={{duration: 200, axis: 'y'}}
          >
            <div class="border-b {prefersDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-2 pt-1 px-4">
              <p class="text-xs {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}">Ingelogd als</p>
              <p class="font-medium {prefersDarkMode ? 'text-white' : 'text-gray-800'}">Beheerder</p>
            </div>
            <a href="/dashboard/settings" 
              class="flex items-center px-4 py-2 text-sm {prefersDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-3 {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}" viewBox="0 0 24 24">
                <path fill="currentColor" d="M13.875 22h-3.75c-.619 0-.926 0-1.162-.096a1 1 0 0 1-.514-.515c-.083-.199-.1-.443-.119-.923l-.094-2.364a.63.63 0 0 0-.387-.505a7.517 7.517 0 0 1-1.095-.584a.634.634 0 0 0-.635.031l-2.078 1.22c-.422.248-.632.372-.83.397a1 1 0 0 1-.712-.215c-.164-.144-.285-.353-.529-.772l-1.874-3.246c-.245-.424-.368-.636-.379-.84a1 1 0 0 1 .215-.712c.142-.164.352-.286.77-.529l2.064-1.217a.635.635 0 0 0 .294-.573a7.56 7.56 0 0 1 0-1.166a.635.635 0 0 0-.294-.573l-2.064-1.217c-.418-.243-.628-.365-.77-.53a1 1 0 0 1-.215-.711c.011-.204.134-.416.379-.84l1.874-3.246c.244-.42.365-.628.53-.772a1 1 0 0 1 .71-.215c.2.025.41.149.83.397l2.08 1.22c.196.115.468.176.634.031a7.518 7.518 0 0 1 1.095-.584a.63.63 0 0 0 .387-.505l.094-2.364c.019-.48.036-.724.12-.923a1 1 0 0 1 .513-.515c.236-.095.543-.095 1.162-.095h3.75c.619 0 .926 0 1.162.095a1 1 0 0 1 .514.515c.083.199.1.443.119.923l.094 2.364a.63.63 0 0 0 .387.505c.383.16.752.357 1.095.584a.634.634 0 0 0 .635-.031l2.078-1.22c.422-.248.632-.372.83-.397a1 1 0 0 1 .712.215c.164.144.285.353.529.772l1.874 3.246c.245.424.368.636.379.84a1 1 0 0 1-.215.712c-.142.164-.352.286-.77.529l-2.064 1.217a.635.635 0 0 0-.294.573c.032.39.032.776 0 1.166a.635.635 0 0 0 .294.573l2.064 1.217c.418.243.628.365.77.53a1 1 0 0 1 .215.711c-.011.204-.134.416-.379.84l-1.874 3.246c-.244.42-.365.628-.53.772a1 1 0 0 1-.71.215c-.2-.025-.41-.149-.83-.397l-2.08-1.22c-.196-.115-.468-.176-.634-.031c-.343.227-.712.424-1.095.584a.63.63 0 0 0-.387.505l-.094 2.364c-.019.48-.036.724-.12.923a1 1 0 0 1-.513.515c-.236.095-.543.095-1.162.095m-1.875-15a5 5 0 1 0 0 10a5 5 0 0 0 0-10" />
              </svg>
              Instellingen
            </a>
            <a href="/dashboard/profile" 
              class="flex items-center px-4 py-2 text-sm {prefersDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-3 {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8M6 12a6 6 0 0 0-6 6c0 1.1.9 2 2 2h20a2 2 0 0 0 2-2a6 6 0 0 0-6-6z" />
              </svg>
              Profiel
            </a>
            <hr class="my-1 {prefersDarkMode ? 'border-gray-700' : 'border-gray-100'}">
            <button 
              on:click|stopPropagation={logout} 
              class="flex w-full items-center px-4 py-2 text-sm {prefersDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4q0 .425-.288.713T11 5H5v14h6q.425 0 .713.288T12 20q0 .425-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12q0-.425.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7q.275-.3.7-.3t.7.3L20.3 11.3q.3.3.3.7t-.3.7l-3.6 3.55q-.275.275-.687.288t-.713-.288q-.275-.275-.275-.7t.275-.7z" />
              </svg>
              Uitloggen
            </button>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- Main Body (sidebar + content) -->
  <div class="flex flex-1 overflow-hidden relative">
    <!-- Overlay (behind sidebar, in front of main content) -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if sidebarOpen}
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 lg:hidden"
        on:click={() => (sidebarOpen = false)}
        transition:fade={{duration: 200}}
      ></div>
    {/if}
    
    <!-- Sidebar - COMPLETELY FIXED height -->
    <aside
      class="fixed top-16 bottom-0 left-0 w-[280px] {prefersDarkMode ? 'bg-gray-800' : 'bg-white'} 
        shadow-lg z-20 transform transition-transform duration-300 ease-in-out
        {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col"
    >
      <!-- Scrollable content area -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Dashboard Link -->
        <a 
          on:click={() => { if (windowWidth < 1024) toggleSidebar(); }}
          href="/dashboard"
          class="flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all my-0.5
            {isActive('/dashboard') && !isActive('/dashboard/boekingen') && !isActive('/dashboard/financien') && !isActive('/dashboard/klanten') 
              ? (prefersDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700') 
              : (prefersDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100')}"
        >
          <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M16.54 2.088C15.33 2 13.845 2 12 2h-.099l-3.5 5.25H13.1zm-6.444-.084c-3.474.027-5.38.208-6.632 1.46c-.857.858-1.213 2.022-1.36 3.786H6.6z" />
            <path fill="currentColor" fill-rule="evenodd" d="M2.026 8.75C2 9.689 2 10.763 2 12c0 4.714 0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12c0-1.237 0-2.311-.026-3.25zM5.75 14a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5h-8a.75.75 0 0 1-.75-.75m.75 2.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5z" clip-rule="evenodd" />
            <path fill="currentColor" d="M20.536 3.464c.857.858 1.213 2.022 1.36 3.786H14.9l3.3-4.946c.993.21 1.74.563 2.336 1.16" />
          </svg>
          <span>Dashboard</span>
        </a>
        
        <!-- Bookings Link -->
        <a 
          on:click={() => { if (windowWidth < 1024) toggleSidebar(); }}
          href="/dashboard/boekingen"
          class="flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all my-0.5
            {isActive('/dashboard/boekingen') 
              ? (prefersDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700')
              : (prefersDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100')}"
        >
          <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z" />
            <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd" />
          </svg>
          <span>Boekingen</span>
          <span class="ml-auto text-xs font-medium px-2 py-0.5 rounded-md {prefersDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-800'}">12</span>
        </a>
        
        <!-- Finances Link -->
        <a 
          on:click={() => { if (windowWidth < 1024) toggleSidebar(); }}
          href="/dashboard/financien"
          class="flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all my-0.5
            {isActive('/dashboard/financien') 
              ? (prefersDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700')
              : (prefersDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100')}"
        >
          <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10c-1.6 0-3.112-.376-4.452-1.044a1.63 1.63 0 0 0-1.149-.133l-2.226.596a1.3 1.3 0 0 1-1.591-1.592l.595-2.226a1.63 1.63 0 0 0-.134-1.148A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10M12 7.25a.75.75 0 0 1 .75.75v.01c1.089.275 2 1.133 2 2.323a.75.75 0 0 1-1.5 0c0-.384-.426-.916-1.25-.916s-1.25.532-1.25.916s.426.917 1.25.917c1.385 0 2.75.96 2.75 2.417c0 1.19-.911 2.049-2 2.323V16a.75.75 0 0 1-1.5 0v-.01c-1.089-.274-2-1.133-2-2.323a.75.75 0 0 1 1.5 0c0 .384.426.916 1.25.916s1.25-.532 1.25-.916s-.426-.917-1.25-.917c-1.385 0-2.75-.96-2.75-2.417c0-1.19.911-2.048 2-2.323V8a.75.75 0 0 1 .75-.75" clip-rule="evenodd" />
          </svg>
          <span>Financiën</span>
        </a>
        
        <!-- Customers Link -->
        <a 
          on:click={() => { if (windowWidth < 1024) toggleSidebar(); }}
          href="/dashboard/klanten"
          class="flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all my-0.5
            {isActive('/dashboard/klanten') 
              ? (prefersDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700')
              : (prefersDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100')}"
        >
          <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-.322 7.503c-.473.005-.914.023-1.298.074c-.643.087-1.347.293-1.928.875c-.582.581-.788 1.285-.874 1.928c-.078.578-.078 1.284-.078 2.034v.172c0 .75 0 1.456.078 2.034c.06.451.18.932.447 1.38H12c-8 0-8-2.015-8-4.5S7.582 13 12 13c1.326 0 2.577.181 3.678.503" />
            <path fill="currentColor" fill-rule="evenodd" d="M16.5 22c-1.65 0-2.475 0-2.987-.513C13 20.975 13 20.15 13 18.5s0-2.475.513-2.987C14.025 15 14.85 15 16.5 15s2.475 0 2.987.513C20 16.025 20 16.85 20 18.5s0 2.475-.513 2.987C18.975 22 18.15 22 16.5 22m1.968-4.254a.583.583 0 1 0-.825-.825l-1.92 1.92l-.366-.365a.583.583 0 1 0-.825.825l.778.778a.583.583 0 0 0 .825 0z" clip-rule="evenodd" />
          </svg>
          <span>Klanten</span>
        </a>

        <!-- Divider -->
        <div class="h-px {prefersDarkMode ? 'bg-gray-700' : 'bg-gray-200'} my-4"></div>

        <!-- Quick Actions Section -->
        <div class="px-3 py-2">
          <h3 class="text-xs font-semibold {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider">Snelle acties</h3>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button 
              class="flex flex-col items-center justify-center p-3 rounded-xl transition-all
                {prefersDarkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 {prefersDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-1" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10m0-18c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8m1 11h-2v-6h2v6m0-8h-2V5h2v2" />
              </svg>
              <span class="text-xs font-medium">Nieuwe boeking</span>
            </button>
            <button 
              class="flex flex-col items-center justify-center p-3 rounded-xl transition-all
                {prefersDarkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 {prefersDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-1" viewBox="0 0 24 24">
                <path fill="currentColor" d="M13 11h5v2h-5v-2m-1 2v-2H7v2h5m0-6v2H7V7h5m6 0h-5v2h5V7M5 5v14h14V5H5Z" />
              </svg>
              <span class="text-xs font-medium">Rapport</span>
            </button>
          </div>
        </div>

        <!-- Activity Feed - New Feature -->
        <div class="px-3 py-2 mt-2">
          <h3 class="text-xs font-semibold {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider flex items-center justify-between">
            <span>Recente activiteit</span>
            <button class="text-xs {prefersDarkMode ? 'text-blue-400' : 'text-blue-600'} font-normal">Alles zien</button>
          </h3>
          
          <div class="mt-2 space-y-2">
            <div class="{prefersDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} p-2 rounded-lg text-xs">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <p class="{prefersDarkMode ? 'text-gray-300' : 'text-gray-700'}">Nieuwe boeking <span class="font-medium">Bruiloft Emma</span></p>
              </div>
              <p class="{prefersDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1">25 minuten geleden</p>
            </div>
            
            <div class="{prefersDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} p-2 rounded-lg text-xs">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <p class="{prefersDarkMode ? 'text-gray-300' : 'text-gray-700'}">Betaling ontvangen <span class="font-medium">€250</span></p>
              </div>
              <p class="{prefersDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1">2 uur geleden</p>
            </div>
          </div>
        </div>

        <!-- Help Box -->
        <div 
          class="rounded-xl p-3 mt-2 border 
            {prefersDarkMode 
              ? 'bg-blue-900/20 text-blue-300 border-blue-800/50' 
              : 'bg-blue-50 text-blue-800 border-blue-100'}"
        >
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11.95 17.95q.65 0 1.075-.425t.425-1.075q0-.65-.425-1.075t-1.075-.425q-.65 0-1.075.425t-.425 1.075q0 .65.425 1.075t1.075.425m0-5.5q.65 0 1.075-.425t.425-1.075q0-.65-.425-1.075t-1.075-.425q-.65 0-1.075.425t-.425 1.075q0 .65.425 1.075t1.075.425M4.5 22q-.625 0-1.062-.438T3 20.5v-17q0-.625.438-1.062T4.5 2h15q.625 0 1.062.438T21 3.5v17q0 .625-.438 1.062T19.5 22z" />
            </svg>
            <div>
              <h3 class="text-sm font-medium">Hulp nodig?</h3>
              <p class="text-xs mt-1 {prefersDarkMode ? 'text-blue-200/70' : 'text-blue-700/80'}">Neem contact op met ons support team.</p>
              <a href="/dashboard/support" class="inline-flex items-center mt-2 text-xs font-medium hover:underline">
                Contact support
                <svg class="w-3 h-3 ml-1" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed Logout Button at bottom of sidebar - NOT inside scrollable area -->
      <div class="p-4 {prefersDarkMode ? 'bg-gray-800' : 'bg-white'} border-t {prefersDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-auto">
        <button 
          on:click={logout}
          class="flex w-full items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-colors
            {prefersDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}"
        >
          <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M16.125 12a.75.75 0 0 0-.75-.75H4.402l1.961-1.68a.75.75 0 1 0-.976-1.14l-3.5 3a.75.75 0 0 0 0 1.14l3.5 3a.75.75 0 1 0 .976-1.14l-1.96-1.68h10.972a.75.75 0 0 0 .75-.75" clip-rule="evenodd" />
            <path fill="currentColor" d="M9.375 8c0 .702 0 1.053.169 1.306a1 1 0 0 0 .275.275c.253.169.604.169 1.306.169h4.25a2.25 2.25 0 0 1 0 4.5h-4.25c-.702 0-1.053 0-1.306.168a1 1 0 0 0-.275.276c-.169.253-.169.604-.169 1.306c0 2.828 0 4.243.879 5.121c.878.879 2.292.879 5.12.879h1c2.83 0 4.243 0 5.122-.879c.879-.878.879-2.293.879-5.121V8c0-2.828 0-4.243-.879-5.121S19.203 2 16.375 2h-1c-2.829 0-4.243 0-5.121.879c-.879.878-.879 2.293-.879 5.121" />
          </svg>
          <span>Uitloggen</span>
        </button>
      </div>
    </aside>

    <!-- Main Content - Fixed left margin to account for sidebar -->
    <main 
      class="ml-0 lg:ml-[280px] w-full p-4 md:p-6 overflow-y-auto min-h-[calc(100vh-4rem)]
        {prefersDarkMode ? 'scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-700' : 'scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300'}"
    >
      {#if loading}
        <div class="flex justify-center items-center h-64" transition:fade={{duration: 300}}>
          <div class="relative">
            <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-l-transparent 
              {prefersDarkMode ? 'border-blue-500' : 'border-blue-600'} animate-spin"></div>
            <div class="w-12 h-12 rounded-full border-2 border-t-transparent border-r-transparent 
              {prefersDarkMode ? 'border-blue-300' : 'border-blue-400'} animate-pulse absolute top-0 left-0" 
              style="animation-duration: 1.5s;">
            </div>
          </div>
          <p class="ml-4 font-medium {prefersDarkMode ? 'text-gray-400' : 'text-gray-500'}">Laden...</p>
        </div>
      {:else}
        <div class="w-full transition-all duration-300 ease-in-out">
          <slot />
        </div>
      {/if}
      
      <!-- Mobile Bottom Navigation -->
      <div 
        class="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 
          flex items-center justify-around z-20 lg:hidden {prefersDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}"
      >
        <a 
          href="/dashboard" 
          class="flex flex-col items-center justify-center w-full h-full 
            {isActive('/dashboard') && !isActive('/dashboard/boekingen') && !isActive('/dashboard/financien') && !isActive('/dashboard/klanten')
              ? (prefersDarkMode ? 'text-blue-400' : 'text-blue-600') 
              : (prefersDarkMode ? 'text-gray-400' : 'text-gray-500')}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z" />
          </svg>
          <span class="text-xs mt-1">Dashboard</span>
        </a>
        
        <a 
          href="/dashboard/boekingen" 
          class="flex flex-col items-center justify-center w-full h-full relative
            {isActive('/dashboard/boekingen')
              ? (prefersDarkMode ? 'text-blue-400' : 'text-blue-600') 
              : (prefersDarkMode ? 'text-gray-400' : 'text-gray-500')}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
          </svg>
          <span class="text-xs mt-1">Boekingen</span>
          <span class="absolute top-2 right-6 w-2 h-2 rounded-full bg-blue-500"></span>
        </a>
        
        <a 
          href="/dashboard/financien" 
          class="flex flex-col items-center justify-center w-full h-full
            {isActive('/dashboard/financien')
              ? (prefersDarkMode ? 'text-blue-400' : 'text-blue-600') 
              : (prefersDarkMode ? 'text-gray-400' : 'text-gray-500')}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z" />
          </svg>
          <span class="text-xs mt-1">Financiën</span>
        </a>
        
        <a 
          href="/dashboard/klanten" 
          class="flex flex-col items-center justify-center w-full h-full
            {isActive('/dashboard/klanten')
              ? (prefersDarkMode ? 'text-blue-400' : 'text-blue-600') 
              : (prefersDarkMode ? 'text-gray-400' : 'text-gray-500')}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span class="text-xs mt-1">Klanten</span>
        </a>
      </div>

      <!-- Mobile Floating Logout Button -->
      <button 
        on:click={logout}
        class="fixed bottom-20 right-4 z-30 lg:hidden w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg flex items-center justify-center"
        aria-label="Uitloggen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4q0 .425-.288.713T11 5H5v14h6q.425 0 .713.288T12 20q0 .425-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12q0-.425.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7q.275-.3.7-.3t.7.3L20.3 11.3q.3.3.3.7t-.3.7l-3.6 3.55q-.275.275-.687.288t-.713-.288q-.275-.275-.275-.7t.275-.7z" />
        </svg>
      </button>
    </main>
  </div>
</div>

<style>
  #figtree {
    font-family: 'Figtree Variable', sans-serif;
  }
  
  /* Smooth scrolling */
  :global(html) {
    scroll-behavior: smooth;
  }
  
  /* Custom scrollbar styles */
  .scrollbar-thin::-webkit-scrollbar {
    width: 5px;
  }
  
  .scrollbar-track-gray-100::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .scrollbar-track-gray-800::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 5px;
  }
  
  .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 5px;
  }
  
  /* Hide scrollbar for mobile but show functionality */
  @media (max-width: 640px) {
    .scrollbar-thin::-webkit-scrollbar {
      width: 3px;
    }
  }
  
  /* Add XS breakpoint */
  @media (min-width: 400px) {
    .xs\:inline {
      display: inline;
    }
  }
</style>