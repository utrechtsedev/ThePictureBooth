<!-- src/lib/components/storefront/Benefits.svelte -->
<script>
  import { fly } from "svelte/transition";
  export let benefits;
</script>

<!-- Benefits Section -->
<div class="max-w-6xl mx-auto px-4 mb-16 py-12 select-text">
  <h2
    class="crazyfont text-center text-3xl md:text-4xl text-gray-800 mb-4 select-text"
  >
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
    >
      Waarom voor ons kiezen?
    </span>
  </h2>
  <p class="text-center text-gray-600 max-w-2xl mx-auto mb-10 select-text">
    Wij bieden de beste photobooth ervaring in Nederland met premium apparatuur,
    professionele begeleiding en onbeperkt printen.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each benefits as benefit, i}
      <div
        in:fly={{ y: 50, duration: 800, delay: 200 + i * 150 }}
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg select-text"
      >
        <div class="text-4xl mb-4">{benefit.icon}</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
        <p class="text-gray-600">{benefit.text}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya";
  }

  /* Ensure text is selectable */
  .select-text {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    cursor: text;
  }
</style>

