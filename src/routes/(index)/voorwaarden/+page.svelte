<!-- src/routes/(index)/voorwaarden/+page.svelte -->
<script>
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";

  // Additional terms that were missing from original
  const additionalTerms = [
    {
      title: "Annuleren",
      icon: "M6 18L18 6M6 6l12 12",
      iconColor: "text-rose-600",
      bgFrom: "from-rose-500",
      bgTo: "to-rose-400",
      markerColor: "marker:text-rose-500",
      items: [
        "Geen restitutie bij annulering binnen 7 dagen voor het event",
        "Volledige restitutie bij overmacht (ter beoordeling)",
      ],
    },
    {
      title: "Digitale Foto's",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      iconColor: "text-indigo-600",
      bgFrom: "from-indigo-500",
      bgTo: "to-indigo-400",
      markerColor: "marker:text-indigo-500",
      items: [
        "Foto's worden na afloop digitaal beschikbaar gesteld voor een bepaalde periode.",
      ],
    },
  ];

  const originalTerms = [
    {
      title: "Betaling",
      icon: "M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm12 10H4v2a2 2 0 002 2h8a2 2 0 002-2v-2zM2 9h16v5a2 2 0 01-2 2H4a2 2 0 01-2-2V9z",
      iconColor: "text-blue-600",
      bgFrom: "from-blue-500",
      bgTo: "to-blue-400",
      markerColor: "marker:text-blue-500",
      items: [
        "€100 aanbetaling vereist bij reservatie",
        "Restbedrag betaald uiterlijk bij het event",
        "Aanbetaling is niet restitueerbaar bij annulering binnen 24 uur",
        "Accepteren iDEAL en bankoverschrijving",
      ],
    },
    {
      title: "Professionele Begeleiding",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      iconColor: "text-purple-600",
      bgFrom: "from-purple-500",
      bgTo: "to-purple-400",
      markerColor: "marker:text-purple-500",
      items: [
        "Erkend personeelslid aanwezig tijdens volledige huurperiode",
        "Assistentie bij bediening en technische ondersteuning",
        "Verantwoordelijk voor opbouw/afbouw apparatuur",
        "Professioneel, vriendelijk en behulpzaam personeel",
      ],
    },
    {
      title: "Premium Fotoprinter",
      icon: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z",
      iconColor: "text-emerald-600",
      bgFrom: "from-emerald-500",
      bgTo: "to-emerald-400",
      markerColor: "marker:text-emerald-500",
      items: [
        "Professionele fotoprinter inclusief bij elk pakket",
        "Onbeperkt printen gedurende de huurperiode",
        "Hoge kwaliteit glossy foto's (10x15 cm)",
        "Gratis fotopapier en inkt",
      ],
    },
    {
      title: "Overige Afspraken",
      icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
      iconColor: "text-amber-600",
      bgFrom: "from-amber-500",
      bgTo: "to-amber-400",
      markerColor: "marker:text-amber-500",
      items: [
        "Volledige betaling = definitieve reservatie",
        "Schade aan apparatuur wordt doorberekend",
        "Eigen locatie moet stroomvoorziening hebben (220V)",
        "Minimale ruimtevereiste: 2m x 2m",
      ],
    },
  ];

  // Combine all terms for display
  const allTerms = [...originalTerms, ...additionalTerms];

  // Add CTAs for better conversion
  let showBookingCTA = false;

  onMount(() => {
    // Show CTA after scrolling down a bit
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
    >Voorwaarden | ThePictureBooth - Transparante afspraken, geen verrassingen</title
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
      <span class="text-white">📝</span> Voorwaarden Photobooth Huur
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
      {#each allTerms as term, i}
        <div
          class="animate-fade-in-up"
          style="--delay: {0.1 + i * 0.2}s"
          in:fly={{ y: 30, duration: 800, delay: 100 + i * 150 }}
        >
          <div
            class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-blue-100 transition-all duration-300"
          >
            <div class="flex items-start gap-3 mb-4">
              <svg
                class="flex-shrink-0 w-6 h-6 mt-1 {term.iconColor}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d={term.icon}
                />
              </svg>
              <h2
                class="text-2xl font-semibold bg-gradient-to-r {term.bgFrom} {term.bgTo} bg-clip-text text-transparent"
              >
                {term.title}
              </h2>
            </div>
            <ul
              class="space-y-3 text-sm ml-9 list-disc list-outside {term.markerColor}"
            >
              {#each term.items as item}
                <li class="text-gray-700">{item}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </div>
    <!-- Additional Documents -->
    <!-- 
    <div
      class="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 mb-12"
    >
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Gerelateerde documenten
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <a
          href="/garantie"
          class="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <svg
            class="w-5 h-5 text-emerald-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-gray-700">Garantiebeleid</span>
        </a>
      </div>
    </div>
    -->
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
