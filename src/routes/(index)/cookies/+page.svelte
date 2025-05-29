<script>
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";

  let showBookingCTA = false;

  onMount(() => {
    const handleScroll = () => {
      showBookingCTA = window.scrollY > 300;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<svelte:head>
  <title
    >Privacy | ThePictureBooth - Transparante afspraken, geen verrassingen</title
  >
  <meta
    name="description"
    content="Duidelijke voorwaarden voor het huren van een Picture Booth. Inclusief betalingsvoorwaarden, annuleringsbeleid en wat je kan verwachten op de dag zelf."
  />
</svelte:head>

<section class="pt-8 pb-16 bg-white">
  <!-- Page Header -->
  <div class="max-w-4xl mx-auto px-4">
    <h1
      class="crazyfont text-4xl md:text-5xl text-center mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent"
    >
      <span class="text-white">📝</span> Ons Cookiebeleid
    </h1>

    <p class="text-center text-gray-600 max-w-2xl mx-auto mb-8">
      Transparante afspraken voor een zorgeloze photobooth ervaring. Bij ons
      geen kleine lettertjes of verborgen kosten.
    </p>

    <div
      class="w-32 h-1 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-12"
    ></div>
  </div>

  <!-- Terms Content -->
  <div class="max-w-4xl mx-auto px-4">
    <div class="space-y-8 mb-12">
      <div
        class="animate-fade-in-up"
        in:fly={{ y: 30, duration: 800, delay: 100 + i * 150 }}
      >
        <div
          class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-blue-100 transition-all duration-300"
        >
          <p class="">
            <strong>Laatste update:</strong> 29-05-2025
          </p>

          <br />
          <p>
            Bij ThePictureBooth, gevestigd aan Slotermeerlaan 58, 1064HC
            Amsterdam, nemen we de privacy van onze klanten en gebruikers
            serieus. Dit beleid legt uit hoe we persoonsgegevens verzamelen,
            gebruiken, bewaren en beschermen.
          </p>
          <br />

          <h3 class="font-bold text-2xl">Gebruiken wij cookies?</h3>
          <p>
            Wij gebruiken geen cookies, wij waarderen onze klanten en stellen
            hen privacy op prijs.
          </p>
        </div>
      </div>
    </div>
    <!-- Additional Documents -->
    <div
      class="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 mb-12"
    >
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Gerelateerde documenten
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/privacy"
          class="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <svg
            class="w-5 h-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-gray-700">Privacy Policy</span>
        </a>

        <a
          href="/cookies"
          class="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <svg
            class="w-5 h-5 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
            />
          </svg>
          <span class="text-gray-700">Cookie Beleid</span>
        </a>
      </div>
    </div>
    <!-- Contact Section -->
    <div class="text-center">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Nog vragen?</h3>
      <p class="text-gray-600 mb-6">
        Neem gerust contact met ons op als je vragen hebt over onze voorwaarden.
        We helpen je graag verder!
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="mailto:info.thepictureboothnl@gmail.com"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>Email ons</span>
        </a>

        <a
          href="tel:+31635627374"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors border border-gray-200"
        >
          <svg
            class="w-5 h-5"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 58 58"
            xml:space="preserve"
          >
            <g>
              <path
                style="fill:#2CB742;"
                d="M0,58l4.988-14.963C2.457,38.78,1,33.812,1,28.5C1,12.76,13.76,0,29.5,0S58,12.76,58,28.5
		S45.24,57,29.5,57c-4.789,0-9.299-1.187-13.26-3.273L0,58z"
              />
              <path
                style="fill:#FFFFFF;"
                d="M47.683,37.985c-1.316-2.487-6.169-5.331-6.169-5.331c-1.098-0.626-2.423-0.696-3.049,0.42
		c0,0-1.577,1.891-1.978,2.163c-1.832,1.241-3.529,1.193-5.242-0.52l-3.981-3.981l-3.981-3.981c-1.713-1.713-1.761-3.41-0.52-5.242
		c0.272-0.401,2.163-1.978,2.163-1.978c1.116-0.627,1.046-1.951,0.42-3.049c0,0-2.844-4.853-5.331-6.169
		c-1.058-0.56-2.357-0.364-3.203,0.482l-1.758,1.758c-5.577,5.577-2.831,11.873,2.746,17.45l5.097,5.097l5.097,5.097
		c5.577,5.577,11.873,8.323,17.45,2.746l1.758-1.758C48.048,40.341,48.243,39.042,47.683,37.985z"
              />
            </g>
          </svg>
          <span>Direct contact</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Floating CTA -->
  {#if showBookingCTA}
    <div
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-lg px-4"
      transition:fade={{ duration: 300 }}
    >
      <div
        class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 shadow-xl flex items-center justify-between"
      >
        <div class="text-white">
          <p class="font-semibold">Klaar om te boeken?</p>
          <p class="text-xs text-blue-50">
            Bekijk onze beschikbaarheid en reserveer direct
          </p>
        </div>
        <a
          href="/#booking-form"
          class="px-4 py-2 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Boek nu
        </a>
      </div>
    </div>
  {/if}
</section>

<style>
  /* Animations */
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out both;
    animation-delay: var(--delay);
  }

  .crazyfont {
    font-family: "Pattaya";
  }
</style>
