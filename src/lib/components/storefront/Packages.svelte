<!-- src/lib/components/storefront/Packages.svelte -->
<script>
  import { fly } from "svelte/transition";
  export let packageFeatures;
  export let durationPrices;
  export let selectedDuration;
  function scrollToForm() {
    document.getElementById("booking-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
</script>

<!-- Packages Section -->
<div class="max-w-6xl mx-auto px-4 mb-16 bg-gray-50 py-12" id="pakketten">
  <h2 class="crazyfont text-center text-3xl md:text-4xl text-gray-800 mb-4">
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
    >
      Onze pakketten 📦
    </span>
  </h2>
  <p class="text-center text-gray-600 max-w-2xl mx-auto mb-10">
    Alles wat je nodig hebt voor een onvergetelijke photobooth ervaring,
    inclusief professionele begeleiding en onbeperkt printen.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {#each Object.entries(durationPrices) as [hours, details], i}
      <div
        in:fly={{ y: 30, duration: 800, delay: 200 + i * 150 }}
        class="relative {selectedDuration === hours
          ? 'bg-white ring-2 ring-blue-500 shadow-xl'
          : 'bg-white'} p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg"
      >
        {#if details.saving > 0}
          <div
            class="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg"
          >
            NORMAAL €{details.price + 50}
          </div>
        {/if}
        {#if details.label === "Populair"}
          <div
            class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg"
          >
            POPULAIRSTE KEUZE
          </div>
        {/if}
        <h3 class="text-center text-xl font-bold text-gray-800 mb-2">
          {details.label}
        </h3>
        <div class="text-center mb-4">
          <span class="text-3xl font-bold text-gray-800">€{details.price}</span>
        </div>
        <div class="text-center mb-6 text-gray-600">
          {hours} uur
        </div>
        <ul class="space-y-3 mb-6">
          {#each packageFeatures.all as feature}
            <li class="flex items-start gap-2">
              <span class="flex-shrink-0 text-lg">{feature.icon}</span>
              <span class="text-gray-600 text-sm">{feature.text}</span>
            </li>
          {/each}
          {#if parseInt(hours) >= 4}
            {#each packageFeatures.premium as feature}
              <li class="flex items-start gap-2">
                <span class="flex-shrink-0 text-lg">{feature.icon}</span>
                <span class="text-gray-600 text-sm">{feature.text}</span>
              </li>
            {/each}
          {/if}
        </ul>
        <button
          on:click={() => {
            selectedDuration = hours;
            scrollToForm();
          }}
          class="{selectedDuration === hours
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} w-full py-3 rounded-lg font-semibold transition-all"
        >
          {selectedDuration === hours ? "Geselecteerd" : "Selecteer"}
        </button>
      </div>
    {/each}
  </div>
  <p class="text-center text-gray-500 mt-6">
    Alle pakketten zijn inclusief transport, op- en afbouw binnen 25km van
    Amsterdam. <br />
    Voor locaties buiten deze straal geldt een kleine toeslag.
  </p>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya";
  }
</style>
