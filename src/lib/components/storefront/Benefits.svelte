<script>
    import { fly } from 'svelte/transition';
    
    export let benefits;
  </script>
  
  <!-- Benefits Section -->
  <div class="max-w-6xl mx-auto px-4 mb-16">
    <h2 class="crazyfont text-center text-3xl md:text-4xl text-white mb-4">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        Waarom voor ons kiezen?
      </span>
    </h2>
    
    <p class="text-center text-zinc-300 max-w-2xl mx-auto mb-10">
      Wij bieden de beste photobooth ervaring in Nederland met premium apparatuur, 
      professionele begeleiding en onbeperkt printen.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each benefits as benefit, i}
        <div in:fly={{y: 50, duration: 800, delay: 200 + (i * 150)}} class="bg-gradient-to-br from-zinc-900/70 to-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-900/20">
          <div class="text-4xl mb-4">{benefit.icon}</div>
          <h3 class="text-xl font-bold text-white mb-2">{benefit.title}</h3>
          <p class="text-zinc-300">{benefit.text}</p>
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .crazyfont {
      font-family: "Pattaya";
    }
  </style>