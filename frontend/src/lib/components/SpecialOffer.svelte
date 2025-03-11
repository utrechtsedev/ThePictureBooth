<script>
    import { onMount } from "svelte";
    
    // Countdown timer for urgency
    let timeLeft = { days: 3, hours: 12, minutes: 33, seconds: 45 };
    
    onMount(() => {
      const countdown = setInterval(() => {
        if (timeLeft.seconds > 0) {
          timeLeft.seconds -= 1;
        } else {
          timeLeft.seconds = 59;
          if (timeLeft.minutes > 0) {
            timeLeft.minutes -= 1;
          } else {
            timeLeft.minutes = 59;
            if (timeLeft.hours > 0) {
              timeLeft.hours -= 1;
            } else {
              timeLeft.hours = 23;
              if (timeLeft.days > 0) {
                timeLeft.days -= 1;
              } else {
                // Reset countdown when it reaches zero
                timeLeft = { days: 3, hours: 12, minutes: 33, seconds: 45 };
              }
            }
          }
        }
      }, 1000);
  
      return () => clearInterval(countdown);
    });
  
    function scrollToForm() {
      document.getElementById('booking-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  </script>
  
  <!-- Special Offer -->
  <div class="max-w-6xl mx-auto px-4 mb-16">
    <div class="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-800/50 relative overflow-hidden">
      <div class="absolute top-0 right-0 bg-gradient-to-bl from-red-500 to-red-700 text-white text-sm font-bold py-1 px-4 rounded-bl-xl">
        Beperkte tijd
      </div>
      
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="flex-1">
          <h3 class="crazyfont text-2xl md:text-3xl text-white mb-4">
            🎉 Lente Aanbieding: €50 korting
          </h3>
          <p class="text-zinc-300 mb-6">
            Boek nu je photobooth voor je zomerfeest en ontvang €50 korting op pakketten van 3 uur of meer. 
            Plus: <span class="text-yellow-300">GRATIS</span> gepersonaliseerd fotoframe!
          </p>
          
          <div class="flex flex-wrap gap-3 mb-6">
            <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 flex flex-col items-center">
              <span class="text-lg font-bold text-white">{timeLeft.days}</span>
              <span class="text-xs text-zinc-400">Dagen</span>
            </div>
            <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 flex flex-col items-center">
              <span class="text-lg font-bold text-white">{timeLeft.hours}</span>
              <span class="text-xs text-zinc-400">Uren</span>
            </div>
            <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 flex flex-col items-center">
              <span class="text-lg font-bold text-white">{timeLeft.minutes}</span>
              <span class="text-xs text-zinc-400">Minuten</span>
            </div>
            <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 flex flex-col items-center">
              <span class="text-lg font-bold text-white">{timeLeft.seconds}</span>
              <span class="text-xs text-zinc-400">Seconden</span>
            </div>
          </div>
          
          <button on:click={scrollToForm} class="crazyfont bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-red-500/30 transition-all hover:scale-105">
            Profiteer nu van deze aanbieding
          </button>
        </div>
        
        <div class="flex-1 bg-zinc-800/70 rounded-xl p-5 border border-zinc-700/50">
          <h4 class="text-white font-bold mb-3">Je krijgt:</h4>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-zinc-300">€50 korting op pakketten vanaf 3 uur</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-zinc-300">Gratis gepersonaliseerd fotoframe (t.w.v. €75)</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-zinc-300">Premium props pakket inclusief</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-zinc-300">Digitale fotogalerij voor al je gasten</span>
            </li>
          </ul>
          <p class="text-xs text-zinc-400 mt-4">*Aanbieding geldig tot {timeLeft.days} dagen, {timeLeft.hours} uur, {timeLeft.minutes} minuten</p>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .crazyfont {
      font-family: "Pattaya";
    }
  </style>