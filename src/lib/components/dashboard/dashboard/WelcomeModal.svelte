<script>
    import { fade } from "svelte/transition";

    let showWelcomeModal = false
</script>
{#if showWelcomeModal}
      <div 
        transition:fade={{duration: 400}}
        class="fixed inset-x-0 top-6 z-50 flex justify-center px-4"
      >
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl shadow-lg max-w-lg">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2.55 13.74c-.71.47-1.84 1.26-3.67 1.26c-1.36 0-2.33-.29-2.97-.74l.24-1.2c.63.44 1.5.73 2.73.73c1.38 0 2.14-.53 2.14-1.35c0-.79-.65-1.33-2.19-1.86c-2.09-.71-3.13-1.82-3.13-3.38C10.6 7.37 12 6 14.4 6c1.1 0 1.99.19 2.58.56l-.33 1.23c-.38-.22-1.08-.48-2.24-.48c-1.31 0-1.91.55-1.91 1.19c0 .75.67 1.17 2.38 1.77c2.04.74 2.97 1.76 2.97 3.56c0 1.62-1.22 2.86-3.4 2.91zM9.5 9H8V5h1.5zm-2 6H6V5h1.5zm-5-3h2v1.5H4.5zm0-3h2v1.5H4.5zm0 6h2v1.5H4.5z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-xl font-bold">Welkom terug!</h3>
              <p class="mt-1">Je hebt 2 openstaande boekingen die bevestiging nodig hebben. Vandaag staan er 3 taken gepland.</p>
            </div>
            <button 
              class="flex-shrink-0 ml-2"
              on:click={() => showWelcomeModal = false}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/if}
