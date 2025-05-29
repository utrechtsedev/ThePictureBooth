<!-- src/lib/components/storefront/VideoCarousel.svelte -->
<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let carousel;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  // Video optimization
  let videoObserver;
  const videoElements = new Set();

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {
              video.muted = true;
              video.play();
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "100px",
      },
    );

    // Observe all videos
    document.querySelectorAll("video").forEach((video) => {
      // Preload first 3 videos
      if (video.preload !== "none") {
        video.load();
      }
      observer.observe(video);
      videoElements.add(video);
    });

    if (carousel) {
      // Mouse controls
      carousel.addEventListener("mousedown", startDrag);
      carousel.addEventListener("mousemove", duringDrag);
      carousel.addEventListener("mouseup", endDrag);
      carousel.addEventListener("mouseleave", endDrag);

      // Touch controls
      carousel.addEventListener("touchstart", startDrag);
      carousel.addEventListener("touchmove", duringDrag);
      carousel.addEventListener("touchend", endDrag);
    }
  });

  function startDrag(e) {
    // Pause all videos when dragging starts
    videoElements.forEach((video) => video.pause());
    isDragging = true;
    carousel.classList.add("dragging");
    startX = (e.pageX || e.touches?.[0]?.pageX) - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  }

  function duringDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = (e.pageX || e.touches?.[0]?.pageX) - carousel.offsetLeft;
    const walk = (x - startX) * 2.5; // Increased sensitivity
    carousel.scrollLeft = scrollLeft - walk;
  }

  function endDrag() {
    // Resume visible video after dragging
    isDragging = false;
    carousel.classList.remove("dragging");
    const visibleVideo = document
      .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
      ?.closest(".card")
      ?.querySelector("video");
    if (visibleVideo) visibleVideo.play();
  }
</script>

<!-- Video Carousel -->
<div class="mb-16 bg-white py-8">
  <h2 class="crazyfont text-center text-3xl md:text-4xl text-gray-800 mb-8">
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600"
    >
      Onze photobooth in actie ✨
    </span>
  </h2>

  <div class="carousel-container" in:fade={{ duration: 800 }}>
    <div bind:this={carousel} class="carousel">
      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as _, i}
        <div class="card">
          <div class="card-label">
            {i === 0
              ? "Bruiloft"
              : i === 1
                ? "Bruiloft"
                : i === 2
                  ? "Bruiloft"
                  : i === 3
                    ? "Bruiloft"
                    : i === 4
                      ? "Bruiloft"
                      : i === 5
                        ? "Verjaardagsfeest"
                        : i === 6
                          ? "Verjaardagsfeest"
                          : i === 7
                            ? "Bruiloft"
                            : "Bruiloft"}
          </div>
          <video
            src="/vids/preview{i + 1}.mp4"
            muted
            autoplay
            loop
            playsinline
            webkit-playsinline="true"
            preload={i < 3 ? "auto" : "none"}
            style="display: block; -webkit-transform: translateZ(0)"
          ></video>
        </div>
      {/each}
    </div>

    <div class="carousel-controls">
      <button class="carousel-arrow carousel-prev">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button class="carousel-arrow carousel-next">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</div>

<style>
  .crazyfont {
    font-family: "Pattaya";
  }

  /* 🎥 Centered & Properly Sized Vertical Video Cards */
  .carousel-container {
    width: 100%;
    padding: 2rem 0;
    position: relative;
    overflow: hidden;
    max-width: 500px;
    margin: 0 auto;
  }

  .carousel {
    display: flex;
    gap: 1.2rem;
    padding: 0 1.5rem 2rem; /* Add space for scroll */
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(63, 131, 248, 0.5) transparent;
    cursor: grab;
    scroll-behavior: smooth;
  }

  .carousel-controls {
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 0.5rem;
    pointer-events: none;
  }

  .carousel-arrow {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .carousel-arrow:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: scale(1.1);
  }

  /* Custom scrollbar for desktop */
  .carousel::-webkit-scrollbar {
    height: 8px;
  }

  .carousel::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 4px;
  }

  .card {
    scroll-snap-align: center;
    flex: 0 0 80vw;
    width: 80vw;
    height: auto;
    aspect-ratio: 9/16;
    border-radius: 1.8rem;
    position: relative;
    overflow: hidden;
    background: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(229, 231, 235, 1);
  }

  .card-label {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(255, 255, 255, 0.9);
    color: #3b82f6;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 10;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  /* Desktop adjustments */
  @media (min-width: 768px) {
    .carousel-container {
      max-width: 100vw; /* Allow full-width scrolling */
      padding: 3rem 0;
    }

    .carousel {
      padding: 0 2rem 2rem;
      max-width: 1500px; /* Limit maximum scroll width */
      margin: 0 auto;
    }

    .card {
      flex: 0 0 380px;
      width: 380px;
      margin: 0 10px; /* Desktop spacing */
      -webkit-overflow-scrolling: touch;
      -overflow-scrolling: touch;
      transform: translate3d(0, 0, 0);
    }

    /* Hide scrollbar on desktop drag */
    .carousel.dragging::-webkit-scrollbar {
      opacity: 0;
    }
  }

  .card video {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-perspective: 1000;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Hide native controls */
  video::-webkit-media-controls {
    display: none !important;
  }
</style>
