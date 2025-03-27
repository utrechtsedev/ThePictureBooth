<script>
    // Props
    export let title = '';
    export let subtitle = '';
    export let buttonText = '';
    export let onButtonClick = () => {};
  </script>
  
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
      {#if subtitle}
        <p class="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
      {/if}
    </div>
    
    {#if buttonText}
      <button 
        on:click={onButtonClick}
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>
        </svg>
        {buttonText}
      </button>
    {/if}
  </div>