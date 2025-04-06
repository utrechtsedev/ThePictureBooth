<!-- src/lib/components/storefront/Reviews.svelte -->
<script>
  import { fly } from "svelte/transition";
  export let reviews;
</script>

<!-- Reviews Section -->
<div class="max-w-6xl mx-auto px-4 mb-16 bg-white py-12">
  <h2 class="crazyfont text-center text-3xl md:text-4xl text-gray-800 mb-4">
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
    >
      Wat onze klanten zeggen 💬
    </span>
  </h2>
  <p class="text-center text-gray-600 max-w-2xl mx-auto mb-10">
    Onze photobooths hebben al op honderden evenementen gestaan. Hier zijn
    enkele ervaringen van tevreden klanten.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each reviews as review, i}
      <div
        in:fly={{ y: 30, duration: 800, delay: 200 + i * 150 }}
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex gap-1 mb-4">
          {#each Array(review.rating) as _}
            <svg
              class="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          {/each}
        </div>
        <p class="text-gray-700 mb-4 italic">"{review.text}"</p>
        <div class="flex justify-between items-end">
          <div>
            <h4 class="text-gray-800 font-semibold">{review.name}</h4>
            <p class="text-gray-500 text-sm">{review.event}</p>
          </div>
          <div
            class="flex h-8 w-8 bg-blue-100 rounded-full items-center justify-center"
          >
            <svg
              class="w-4 h-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="flex justify-center mt-8">
    <a
      href="#reviews"
      class="text-blue-600 flex items-center gap-2 hover:text-blue-500 transition-colors"
    >
      <span>Bekijk meer reviews</span>
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </a>
  </div>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya";
  }
</style>

