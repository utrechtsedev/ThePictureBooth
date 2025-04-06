<!-- src/lib/components/storefront/SuccessPopup.svelte -->
<script>
  import { fade } from "svelte/transition";
</script>

<!-- Success Popup -->
<div
  class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  transition:fade={{ duration: 300 }}
>
  <div
    class="animate-fade-in-up w-full max-w-md p-6 rounded-2xl bg-white border border-emerald-200 shadow-xl"
  >
    <div class="text-center">
      <div class="flex justify-center mb-4">
        <svg
          class="w-16 h-16 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3
        class="crazyfont text-2xl mb-2 bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent"
      >
        Betaling Geslaagd!
      </h3>
      <p class="text-gray-600 text-sm mb-6">
        Bedankt voor je boeking! Je ontvangt binnen 5 minuten een
        bevestigingsmail met alle details.
      </p>
      <a
        href="/"
        class="inline-block crazyfont px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500
                text-white font-semibold shadow-lg hover:shadow-xl hover:from-emerald-400 hover:to-green-400
                transition-all transform hover:scale-[1.02] active:scale-95"
      >
        Terug naar Home
      </a>
    </div>
  </div>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya";
  }

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
  }
</style>

