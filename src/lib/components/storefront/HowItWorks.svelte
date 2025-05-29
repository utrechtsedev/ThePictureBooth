<!-- src/lib/components/storefront/HowItWorks.svelte -->
<script>
  import { fly } from "svelte/transition";
</script>

<div class="max-w-6xl mx-auto px-4 mb-16 bg-white py-12">
  <h2 class="crazyfont text-center text-3xl md:text-4xl text-gray-800 mb-4">
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600"
    >
      Hoe werkt het? <p class="text-white inline-flex">🤔</p>
    </span>
  </h2>

  <div class="relative mt-16">
    <!-- Connection Line - vertical for desktop -->
    <div
      class="absolute left-1/2 top-8 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-yellow-600 transform -translate-x-1/2 hidden md:block"
    ></div>

    <!-- Connection Line - horizontal for mobile -->
    <div
      class="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-yellow-600 md:hidden"
    ></div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <!-- Step 1 -->
      <div class="relative md:text-right flex md:block">
        <!-- Mobile circle with number -->
        <div
          class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-white font-bold mr-4 flex-shrink-0"
        >
          1
        </div>

        <!-- Desktop circle with number -->
        <div
          class="hidden md:flex absolute right-0 top-8 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 transform translate-x-1/2 z-10 items-center justify-center text-white font-bold"
        >
          1
        </div>

        <div class="md:ml-auto md:mr-12 max-w-xs">
          <div class="text-3xl mb-4">📝</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            Reserveer Online
          </h3>
          <p class="text-gray-600">
            Vul het reserveringsformulier in en kies je gewenste pakket, datum
            en tijd.
          </p>
        </div>
      </div>

      <!-- Empty for spacing on mobile -->
      <div class="hidden md:block"></div>

      <!-- Step 2 -->
      <div class="relative flex md:block">
        <!-- Mobile circle with number -->
        <div
          class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-white font-bold mr-4 flex-shrink-0"
        >
          2
        </div>

        <!-- Desktop circle with number -->
        <div
          class="hidden md:flex absolute left-0 top-8 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 transform -translate-x-1/2 z-10 items-center justify-center text-white font-bold"
        >
          2
        </div>

        <div class="md:ml-12 md:mr-auto max-w-xs">
          <div class="text-3xl mb-4">💰</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            Betaal Aanbetaling
          </h3>
          <p class="text-gray-600">
            Bevestig je boeking direct met een kleine aanbetaling van €100. De
            rest betaal je later.
          </p>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="relative md:text-right flex md:block">
        <!-- Mobile circle with number -->
        <div
          class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-white font-bold mr-4 flex-shrink-0"
        >
          3
        </div>

        <!-- Desktop circle with number -->
        <div
          class="hidden md:flex absolute right-0 top-8 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 transform translate-x-1/2 z-10 items-center justify-center text-white font-bold"
        >
          3
        </div>

        <div class="md:ml-auto md:mr-12 max-w-xs">
          <div class="text-3xl mb-4">💌</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            Ontvang Bevestiging
          </h3>
          <p class="text-gray-600">
            Je ontvangt direct een bevestigingsmail met alle details en
            contactgegevens.
          </p>
        </div>
      </div>

      <!-- Empty for spacing on mobile -->
      <div class="hidden md:block"></div>

      <!-- Step 4 -->
      <div class="relative flex md:block">
        <!-- Mobile circle with number -->
        <div
          class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-600 text-white font-bold mr-4 flex-shrink-0"
        >
          4
        </div>

        <!-- Desktop circle with number -->
        <div
          class="hidden md:flex absolute left-0 top-8 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-600 transform -translate-x-1/2 z-10 items-center justify-center text-white font-bold"
        >
          4
        </div>

        <div class="md:ml-12 md:mr-auto max-w-xs">
          <div class="text-3xl mb-4">🎉</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            Geniet van je Event
          </h3>
          <p class="text-gray-600">
            Wij zorgen voor alles! Op de dag zelf bouwen we op, begeleiden we je
            gasten, en ruimen we alles netjes op.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya";
  }
</style>
