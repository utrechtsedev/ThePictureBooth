<script>
    import { fly } from 'svelte/transition';
    
    export let faqs;
    
    // Active FAQ for accordion
    let activeFaq = null;
    const toggleFaq = (index) => {
      activeFaq = activeFaq === index ? null : index;
    };
  </script>
  
  <!-- FAQ Section -->
  <div class="max-w-4xl mx-auto px-4 mb-16" id="faq">
    <h2 class="crazyfont text-center text-3xl md:text-4xl text-white mb-4">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        Veelgestelde vragen ❓
      </span>
    </h2>
    
    <p class="text-center text-zinc-300 max-w-2xl mx-auto mb-10">
      Alles wat je moet weten over onze photobooths
    </p>
    
    <div class="space-y-4">
      {#each faqs as faq, i}
        <div class="bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden">
          <button on:click={() => toggleFaq(i)} class="w-full px-6 py-4 flex justify-between items-center text-left">
            <span class="font-semibold text-white">{faq.question}</span>
            <svg class="w-5 h-5 text-zinc-400 transform transition-transform {activeFaq === i ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          
          {#if activeFaq === i}
            <div class="px-6 pb-4 text-zinc-300" transition:fly={{duration: 200, y: -20}}>
              {faq.answer}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .crazyfont {
      font-family: "Pattaya";
    }
  </style>