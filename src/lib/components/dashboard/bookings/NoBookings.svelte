<script>
    // Accept the toggleCreateForm function as a prop
    export let onCreateBooking;
  </script>
  
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1zm-2 14l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Geen boekingen gevonden</h3>
    <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
      Er zijn geen boekingen die voldoen aan je zoekcriteria. Probeer andere filters of maak een nieuwe boeking.
    </p>
    <button
      on:click={onCreateBooking}
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Nieuwe boeking aanmaken
    </button>
  </div>