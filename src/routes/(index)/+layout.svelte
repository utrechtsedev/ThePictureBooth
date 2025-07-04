<!-- src/routes/(index)/+layout.svelte -->
<script>
  import "../../app.css";
  import tiktok from "$lib/images/tiktok.png";
  import instagram from "$lib/images/instagram.png";
  import "@fontsource-variable/figtree";
  import "@fontsource/pattaya";
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let { children } = $props();

  // Mobile navigation using modern runes approach
  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  // Navigation links for better organization
  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Pakketten", href: "/#pakketten" },
    { title: "FAQ", href: "/#faq" },
    { title: "Voorwaarden", href: "/voorwaarden" },
  ];

  // Scroll to top button
  let showScrollToTop = $state(false);

  // Handle smooth scrolling for anchor links
  function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute("href");

    // Only handle same-page anchor links
    if (href && href.startsWith("#") && window.location.pathname === "/") {
      e.preventDefault();

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update URL without page reload
        history.pushState(null, "", href);

        // Close mobile menu if open
        mobileMenuOpen = false;
      }
    }
    // Handle links like "/#section" from the same page
    else if (
      href &&
      href.includes("#") &&
      href.startsWith("/") &&
      window.location.pathname === "/"
    ) {
      e.preventDefault();

      const targetId = href.substring(href.indexOf("#") + 1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update URL without page reload
        history.pushState(null, "", href);

        // Close mobile menu if open
        mobileMenuOpen = false;
      }
    }
    // Don't interfere with normal navigation to other pages
  }

  onMount(() => {
    // Show/hide scroll to top button based on scroll position
    const handleScroll = () => {
      showScrollToTop = window.scrollY > 500;
    };

    window.addEventListener("scroll", handleScroll);

    // Add smooth scrolling to all anchor links on the current page only
    if (window.location.pathname === "/") {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", handleAnchorClick);
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (window.location.pathname === "/") {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.removeEventListener("click", handleAnchorClick);
        });
      }
    };
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Social links
  const socialLinks = [
    {
      platform: "Instagram",
      icon: instagram,
      href: "https://www.instagram.com/the.picturebooth/",
      alt: "Instagram Logo",
    },
    {
      platform: "TikTok",
      icon: tiktok,
      href: "https://www.tiktok.com/@the.picturebooth",
      alt: "TikTok Logo",
    },
  ];
</script>

<div id="figtree" class="app">
  <!-- Header & Navigation -->
  <header
    class="w-full fixed top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center py-4 md:justify-start md:space-x-10">
        <!-- Logo container with proper centering on mobile only -->
        <div class="flex-1 md:flex-initial text-center md:text-left">
          <a href="/" class="inline-block">
            <span
              class="crazyfont text-2xl bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
            >
              ThePictureBooth
            </span>
          </a>
        </div>

        <!-- Desktop menu -->
        <nav class="hidden md:flex space-x-10 flex-1">
          {#each navLinks as link}
            <a
              href={link.href}
              onclick={handleAnchorClick}
              class="text-base font-medium text-gray-700 hover:text-yellow-600 transition duration-150 ease-in-out"
            >
              {link.title}
            </a>
          {/each}
        </nav>

        <!-- Mobile menu button - on the right side -->
        <div class="md:hidden">
          <button
            onclick={toggleMobileMenu}
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <span class="sr-only">Open menu</span>
            <!-- Icon when menu is closed -->
            {#if !mobileMenuOpen}
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            {:else}
              <!-- Icon when menu is open -->
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            {/if}
          </button>
        </div>

        <!-- CTA Button - desktop only -->
        <div class="hidden md:flex items-center">
          <a
            href="/#booking-form"
            onclick={handleAnchorClick}
            class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-yellow-400 to-yellow-400 hover:from-yellow-500 hover:to-yellow-500"
          >
            Boek nu
          </a>
        </div>
      </div>
    </div>

    <!-- Mobile menu with smooth animation -->
    {#if mobileMenuOpen}
      <div
        class="absolute top-0 inset-x-0 p-2 md:hidden z-50 mt-16"
        transition:fly={{ y: -20, duration: 300, easing: cubicOut }}
      >
        <div
          class="rounded-lg shadow-lg bg-white divide-y-2 divide-gray-100 border border-gray-200"
        >
          <div class="pt-5 pb-6 px-5">
            <div class="grid grid-cols-1 gap-4">
              {#each navLinks as link, i}
                <a
                  href={link.href}
                  class="text-base font-medium text-gray-700 hover:text-yellow-600 transition duration-150 ease-in-out block px-3 py-2 rounded-md hover:bg-gray-50"
                  onclick={() => {
                    mobileMenuOpen = false;
                  }}
                  transition:fly={{
                    y: -10,
                    delay: i * 50,
                    duration: 200,
                    easing: cubicOut,
                  }}
                >
                  {link.title}
                </a>
              {/each}
            </div>
          </div>
          <div class="py-6 px-5 space-y-6">
            <a
              href="/#booking-form"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
              onclick={() => {
                mobileMenuOpen = false;
              }}
              transition:fly={{
                y: -10,
                delay: navLinks.length * 50,
                duration: 200,
                easing: cubicOut,
              }}
            >
              Boek nu
            </a>
            <div
              class="flex justify-center space-x-6"
              transition:fly={{
                y: -10,
                delay: (navLinks.length + 1) * 50,
                duration: 200,
                easing: cubicOut,
              }}
            >
              {#each socialLinks as social}
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <img src={social.icon} alt={social.alt} class="h-6 w-6" />
                </a>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </header>

  <main class="pt-20">
    <!-- Main Content -->
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="bg-gray-100 pt-12 pb-8 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <a href="/" class="flex items-center mb-4">
            <span
              class="crazyfont text-3xl bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent"
            >
              ThePictureBooth
            </span>
          </a>
          <p class="text-gray-600 max-w-md">
            De beste photobooth ervaring voor jouw evenement! Onvergetelijke
            herinneringen, onbeperkt printen en professionele begeleiding.
            Beschikbaar in heel Nederland.
          </p>
          <div class="flex space-x-6 mt-6">
            {#each socialLinks as social}
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 transition-transform hover:scale-110 bg-white hover:bg-gray-100 rounded-full shadow-sm"
              >
                <img src={social.icon} alt={social.alt} class="h-6 w-6" />
              </a>
            {/each}
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-gray-900 font-semibold text-lg mb-4">Snelle Links</h3>
          <ul class="space-y-3">
            {#each navLinks as link}
              <li>
                <a
                  href={link.href}
                  class="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  {link.title}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-gray-900 font-semibold text-lg mb-4">Contact</h3>
          <ul class="space-y-3 text-gray-600">
            <li class="flex items-start">
              <svg
                class="w-5 h-5 text-yellow-500 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                />
              </svg>
              <span>+31 6 35627374</span>
            </li>
            <li class="flex items-start">
              <svg
                class="w-5 h-5 text-yellow-500 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                />
                <path
                  d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                />
              </svg>
              <span>info.thepictureboothnl@gmail.com</span>
            </li>
            <li class="flex items-start">
              <svg
                class="w-5 h-5 text-yellow-500 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Amsterdam, Nederland</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
      >
        <p class="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ThePictureBooth. Alle rechten voorbehouden.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a
            href="/voorwaarden"
            class="text-gray-500 hover:text-yellow-600 text-sm">Voorwaarden</a
          >
          <a href="/privacy" class="text-gray-500 hover:text-yellow-600 text-sm"
            >Privacy</a
          >
          <a href="/cookies" class="text-gray-500 hover:text-yellow-600 text-sm"
            >Cookies</a
          >
        </div>
      </div>
    </div>
  </footer>

  <!-- Scroll to top button -->
  {#if showScrollToTop}
    <button
      onclick={scrollToTop}
      class="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-yellow-400 text-white shadow-lg transition-all hover:bg-yellow-600 transform hover:scale-110"
      transition:fade={{ duration: 200 }}
    >
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
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  {/if}
</div>

<style>
  /* Common styles */
  .crazyfont {
    font-family: "Pattaya";
  }

  #figtree {
    font-family: "Figtree Variable", sans-serif;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #ffffff;
    width: 100%;
    height: 100%;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  /* Explicit smooth scrolling */
  :global(html) {
    scroll-behavior: smooth;
  }

  /* Easings for animations */
  @keyframes cubicOut {
    0% {
      transform: cubic-bezier(0.33, 1, 0.68, 1);
    }
    100% {
      transform: cubic-bezier(0.33, 1, 0.68, 1);
    }
  }
</style>
