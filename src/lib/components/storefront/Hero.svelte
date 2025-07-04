<!-- src/lib/components/storefront/Hero.svelte -->
<script>
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";

  let isVisible = false;

  onMount(() => {
    isVisible = true;
  });

  function scrollToForm() {
    document.getElementById("booking-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
</script>

<!-- Modern Hero Section with dynamic elements and improved desktop height -->
<div class="relative w-full overflow-hidden bg-white">
  <!-- Decorative elements - floating shapes -->
  {#if isVisible}
    <div
      class="absolute hidden md:block top-20 left-[15%] w-64 h-64 rounded-full bg-blue-200/20 mix-blend-multiply blur-3xl animate-blob"
    ></div>
    <div
      class="absolute hidden md:block bottom-40 right-[10%] w-72 h-72 rounded-full bg-purple-200/20 mix-blend-multiply blur-3xl animate-blob animation-delay-2000"
    ></div>
    <div
      class="absolute hidden md:block top-1/2 right-[20%] w-56 h-56 rounded-full bg-pink-200/10 mix-blend-multiply blur-3xl animate-blob animation-delay-4000"
    ></div>
  {/if}

  <!-- Light grid pattern overlay for modern feel -->
  <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>

  <!-- Main content container -->
  <div class="relative z-10 max-w-6xl mx-auto">
    <!-- Desktop-optimized height with responsive adjustments -->
    <div
      class="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] md:min-h-[700px] px-4 py-16 md:py-24"
    >
      <!-- Left column - Main content -->
      <div
        class="flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
      >
        <!-- Trust badges -->
        <div
          in:fade={{ duration: 400, delay: 200 }}
          class="flex flex-wrap justify-center lg:justify-start gap-2 mb-6"
        >
          <div
            class="bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-100 flex items-center"
          >
            <span class="text-yellow-500 mr-1">★★★★★</span>
            <span>4.9/5 (124 reviews)</span>
          </div>
          <div
            class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center"
          >
            <span class="mr-1">🚚</span>Goedkope bezorging
          </div>
        </div>

        <!-- Headline with animated highlighting effect -->
        <h1
          in:fly={{ y: 30, duration: 600, delay: 300 }}
          class="crazyfont text-gray-800 text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-xl heading-highlight"
        >
          <span class="text-blue-600">Een Photo Booth huren</span> om niks te vergeten
          📸
        </h1>

        <!-- Subheadline with improved messaging -->
        <p
          in:fly={{ y: 20, duration: 600, delay: 500 }}
          class="text-gray-700 max-w-xl mb-8 text-lg md:text-xl leading-relaxed"
        >
          <span class="font-semibold">Verhoog de feestvreugde</span> met onze
          premium photobooth - de perfecte aanvulling voor elk evenement.
          <br />
          <!--
          <span
            class="mt-2 inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-md font-medium"
          >
            <span class="animate-pulse">Vandaag boeken = 10% korting</span>
          </span>
-->
        </p>

        <!-- CTA buttons with improved visual hierarchy -->
        <div
          in:fly={{ y: 20, duration: 600, delay: 700 }}
          class="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-10"
        >
          <button
            on:click={scrollToForm}
            class="text-white crazyfont flex-1 h-14 flex items-center justify-center rounded-xl bg-yellow-400
            px-8 text-xl font-semibold shadow-lg
            hover:from-yellow-400 hover:to-yellow-600 active:scale-98 transition-all duration-200"
          >
            <span class="flex items-center justify-center">
              <span>Reserveer Nu</span>
              <span class="ml-2 text-2xl">🔥</span>
            </span>
          </button>
          <a
            href="https://wa.me/31635627374?text=Hallo,%20ik%20heb%20een%20vraag%20over%20jullie%20photobooth"
            class="flex-1 h-14 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white
            px-6 text-gray-800 text-lg font-semibold shadow-lg border border-gray-200 transition-all duration-200"
          >
            <span class="flex items-center justify-center">
              <svg
                class="w-5 h-5 mr-2"
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
              <span>Direct Contact</span>
            </span>
          </a>
        </div>

        <!-- Trust indicators -->
        <div
          in:fade={{ duration: 400, delay: 800 }}
          class="flex flex-wrap justify-center lg:justify-start gap-5 items-center mt-2"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-gray-600 text-sm">Hoogste kwaliteit</span>
          </div>
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-gray-600 text-sm">100% Tevredenheidsgarantie</span
            >
          </div>
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-gray-600 text-sm">Binnen 24 uur reactie</span>
          </div>
        </div>
      </div>

      <div class="hidden lg:flex flex-col justify-center items-center relative">
        <!-- Main illustration/image placeholder -->
        <div class="relative mb-8">
          <!-- Decorative elements on the image -->
          <img src="/hero_picture.avif" alt="" class="max-h-[600px]" />
          <div
            class="absolute -top-6 -right-6 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 transform rotate-12"
          >
            <span class="text-2xl">🎉</span>
          </div>
          <div
            class="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10"
          >
            <span class="text-xl">🎭</span>
          </div>
        </div>

        <!-- Enhanced testimonials in a modern card layout -->
        <div class="flex gap-4 mt-4"></div>
      </div>
    </div>
  </div>

  <!-- Curved bottom for smooth transition to next section -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 80"
      class="w-full h-auto"
    >
      <path
        fill="#ffffff"
        fill-opacity="1"
        d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
      ></path>
    </svg>
  </div>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya", sans-serif;
  }

  .active\:scale-98:active {
    transform: scale(0.98);
  }

  /* Background grid pattern */
  .bg-grid-pattern {
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  /* Subtle title highlight animation */
  .heading-highlight {
    background-size: 100% 0.2em;
    background-position: 0 90%;
    transition: background-size 0.25s ease-in;
  }

  .heading-highlight:hover {
    background-size: 100% 0.2em;
    background-position: 0 90%;
  }

  /* Blob animation for background elements */
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }

  .animate-blob {
    animation: blob 15s infinite ease;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>
