<script>
  import welcome from "$lib/images/transparent.png";
  import welcomeFallback from "$lib/images/svelte-welcome.png";
  import { fade, fly } from 'svelte/transition';
  export let testimonials;
  function scrollToForm() {
    document.getElementById('booking-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  

</script>

<!-- Hero Section -->
<div class="overflow-hidden mb-8 max-h-[600px]">
  <div class="absolute inset-0 z-0">
    <!-- <picture>
      <source srcset={welcome} type="image/png" />
      <img
        class="object-cover w-full h-full"
        src={welcomeFallback}
        alt="The Picture Booth - Fotobooth huren voor jouw evenement"
      />
    </picture> -->
    <!-- Improved gradient overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80"></div>
  </div>
  
  <div class="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center h-[500px] md:h-[550px]">
    <!-- Benefit badges -->
    <div in:fade={{duration: 400}} class="flex flex-wrap justify-center gap-2 mb-6">
      <span class="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">⭐ 4.9/5 Klantbeoordeling</span>
      <span class="bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">🚚 Gratis bezorging</span>
      <span class="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">✅ 100+ Evenementen</span>
    </div>
    
    <h1 in:fly={{y: 30, duration: 600, delay: 200}} class="crazyfont text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-xl max-w-3xl">
      <span class="text-blue-300">Onvergetelijke momenten</span> vastgelegd door jouw gasten 📸
    </h1>
    
    <p in:fly={{y: 20, duration: 600, delay: 400}} class="text-white max-w-xl mb-6 text-lg md:text-xl leading-relaxed">
      <span class="font-semibold">Verhoog de feestvreugde</span> met onze premium fotobooth. 
      <span class="bg-blue-600/90 px-2 py-0.5 rounded">Vandaag boeken = <span class="font-bold">10% korting</span></span>
    </p>
    
    <!-- Improved CTA buttons -->
    <div in:fly={{y: 20, duration: 600, delay: 600}} class="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-8">
      <button on:click={scrollToForm}
        class="text-black crazyfont flex-1 h-14 flex items-center justify-center rounded-xl bg-white
        px-6 text-xl font-semibold shadow-lg shadow-blue-500/30
        hover:bg-white/95 hover:shadow-blue-500/50 active:scale-98 transition-all duration-200"
      >
        <span class="flex items-center justify-center">
          <span>Reserveer Nu</span>
          <span class="ml-2 text-2xl">🔥</span>
        </span>
      </button>
      <a href="tel:+31612345678" class="flex-1 h-14 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500
        px-6 text-white text-lg font-semibold shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-200">
        <span class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span>Direct Contact</span>
        </span>
      </a>
    </div>
    
    <!-- Testimonial slider -->
    <div class="flex justify-center gap-4 overflow-hidden">
      {#each testimonials as testimonial, i}
        <div 
          in:fade={{duration: 400, delay: 800 + (i * 100)}}
          class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg max-w-[180px] border border-white/20"
        >
          <p class="text-white text-sm mb-1">{testimonial.text}</p>
          <p class="text-blue-300 text-xs font-medium">— {testimonial.author}</p>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya", sans-serif;
  }
  .active\:scale-98:active {
    transform: scale(0.98);
  }
  /* Subtle pulse animation for main CTA */
  @keyframes subtle-pulse {
    0%, 100% { box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 15px 20px -3px rgba(59, 130, 246, 0.5); }
  }
  button.crazyfont {
    animation: subtle-pulse 3s infinite ease-in-out;
  }
</style>