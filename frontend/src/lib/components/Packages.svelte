<script>
    import { fly } from 'svelte/transition';
    
    export let packageFeatures;
    export let durationPrices;
    export let selectedDuration;
  
    function scrollToForm() {
      document.getElementById('booking-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  </script>
  
  <!-- Packages Section -->
  <div class="max-w-6xl mx-auto px-4 mb-16" id="pakketten">
    <h2 class="crazyfont text-center text-3xl md:text-4xl text-white mb-4">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        Onze pakketten 📦
      </span>
    </h2>
    
    <p class="text-center text-zinc-300 max-w-2xl mx-auto mb-10">
      Alles wat je nodig hebt voor een onvergetelijke photobooth ervaring, 
      inclusief professionele begeleiding en onbeperkt printen.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each Object.entries(durationPrices) as [hours, details], i}
        <div in:fly={{y: 30, duration: 800, delay: 200 + (i * 150)}} class="relative {selectedDuration === hours ? 'bg-gradient-to-br from-blue-900/80 to-purple-900/60 ring-2 ring-blue-500 shadow-xl shadow-blue-700/20' : 'bg-gradient-to-br from-zinc-900/80 to-zinc-800/40'} p-6 rounded-xl border border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10">
          {#if details.saving > 0}
            <div class="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
              BESPAAR €{details.saving}
            </div>
          {/if}
          
          {#if details.label === "Populair"}
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
              POPULAIRSTE KEUZE
            </div>
          {/if}
          
          <h3 class="text-center text-xl font-bold text-white mb-2">
            {details.label}
          </h3>
          
          <div class="text-center mb-4">
            <span class="text-3xl font-bold text-white">€{details.price}</span>
          </div>
          
          <div class="text-center mb-6 text-zinc-300">
            {hours} uur photobooth
          </div>
          
          <ul class="space-y-3 mb-6">
            {#each packageFeatures.all as feature}
              <li class="flex items-start gap-2">
                <span class="flex-shrink-0 text-lg">{feature.icon}</span>
                <span class="text-zinc-300 text-sm">{feature.text}</span>
              </li>
            {/each}
            
            {#if parseInt(hours) >= 4}
              {#each packageFeatures.premium as feature}
                <li class="flex items-start gap-2">
                  <span class="flex-shrink-0 text-lg">{feature.icon}</span>
                  <span class="text-zinc-300 text-sm">{feature.text}</span>
                </li>
              {/each}
            {/if}
          </ul>
          
          <button on:click={() => { 
            selectedDuration = hours; 
            scrollToForm(); 
          }} class="{selectedDuration === hours ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'} w-full py-3 rounded-lg font-semibold transition-all">
            {selectedDuration === hours ? 'Geselecteerd' : 'Selecteer'}
          </button>
        </div>
      {/each}
    </div>
    
    <p class="text-center text-zinc-400 mt-6">
      Alle pakketten zijn inclusief transport, op- en afbouw binnen 25km van Amsterdam.<br>
      Voor locaties buiten deze straal geldt een kleine toeslag.
    </p>
  </div>
  
  <style>
    .crazyfont {
      font-family: "Pattaya";
    }
  </style>