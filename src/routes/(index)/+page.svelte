<!-- src/routes/(index)/+page.svelte -->
<script>
  // Imports
  import "@fontsource/pattaya";
  import { page } from "$app/stores";

  // Component imports
  import Hero from "$lib/components/storefront/Hero.svelte";
  import VideoCarousel from "$lib/components/storefront/VideoCarousel.svelte";
  import Benefits from "$lib/components/storefront/Benefits.svelte";
  import SpecialOffer from "$lib/components/storefront/SpecialOffer.svelte";
  import Reviews from "$lib/components/storefront/Reviews.svelte";
  import Packages from "$lib/components/storefront/Packages.svelte";
  import HowItWorks from "$lib/components/storefront/HowItWorks.svelte";
  import Faq from "$lib/components/storefront/Faq.svelte";
  import BookingForm from "$lib/components/storefront/BookingForm.svelte";
  import SuccessPopup from "$lib/components/storefront/SuccessPopup.svelte";
  import WhatsAppBubble from "$lib/components/storefront/WhatsAppBubble.svelte";

  // SEO metadata export
  export async function load({ params, url }) {
    let lang = url.searchParams.get("lang");
    let q = url.searchParams.get("q");
    return { lang, q };
  }

  // Order status handling
  let successMessage = false;
  let errorMessage = false;

  let params = $page.url.searchParams.toString();
  if (params) {
    if (params.includes("orderStatusId=100")) {
      successMessage = true;
    } else if (params.includes("orderStatusId=-")) {
      errorMessage = true;
    }
  }

  // Benefits for conversion optimization
  const benefits = [
    {
      icon: "⚡",
      title: "Direct boeken",
      text: "Geen wachttijd, binnen 5 minuten geregeld",
    },
    {
      icon: "💯",
      title: "100% Gegarandeerd",
      text: "Altijd op tijd, altijd werkend",
    },
    {
      icon: "🎁",
      title: "All-inclusive",
      text: "Geen verborgen kosten, alles inbegrepen",
    },
    {
      icon: "🥇",
      title: "5-sterren service",
      text: "Honderden tevreden klanten",
    },
  ];

  // Package features for better presentation
  const packageFeatures = {
    all: [
      { icon: "📸", text: "Professionele camera" },
      { icon: "🖨️", text: "Onbeperkt foto's printen" },
      { icon: "📱", text: "Digitale foto's direct op je telefoon" },
      { icon: "👨‍💼", text: "Professionele begeleiding" },
    ],
    premium: [],
  };

  // Reviews for social proof
  const reviews = [
    {
      name: "Aicha",
      event: "Bruiloft",
      text: "Bedankt voor jullie goede service en super vriendelijk personeel❤️ Een echte aanrader, lieve mensen🫶",
      rating: 5,
    },
    {
      name: "Joyce van Loon",
      event: "Bruiloft",
      text: "Het was fantastisch! Dankjewel voor de goede service.",
      rating: 5,
    },
    {
      name: "Roos",
      event: "Hennafeest en Bruiloft",
      text: "Wij waren super blij dat jullie er waren! Henna en bruiloft waren gewoon perfect😍",
      rating: 5,
    },
  ];

  // Price packages
  const durationPrices = {
    "2u": { price: 250, saving: 0, label: "Basis" },
    "3u": { price: 250, saving: 50, label: "Premium" },
    "4u": { price: 300, saving: 50, label: "Populair" },
    "5u": { price: 350, saving: 50, label: "Deluxe" },
  };

  // FAQs for conversion optimization
  const faqs = [
    {
      question: "Is het mogelijk om een vrouwelijke assistent te krijgen?",
      answer: "Ja, dat is zeker mogelijk!",
    },
    {
      question: "Hoe lang van tevoren moet ik boeken?",
      answer:
        "We raden aan minimaal een aantal maanden van tevoren te boeken voor de beste beschikbaarheid, maar last-minute boekingen zijn vaak ook mogelijk. Neem contact op voor de actuele beschikbaarheid.",
    },
    {
      question:
        "Wat gebeurt er als de photobooth kapot gaat tijdens mijn evenement?",
      answer:
        "We hebben altijd backup apparatuur bij ons en onze begeleider is getraind om technische problemen direct op te lossen. In de zeldzame gevallen dat er iets niet opgelost kan worden, bieden we een passende compensatie.",
    },
    {
      question: "Hoeveel ruimte is er nodig voor de photobooth?",
      answer:
        "We hebben minimaal 2x2 meter ruimte nodig voor de standaard setup. Voor grotere groepen raden we 3x3 meter aan voor optimaal comfort.",
    },
    {
      question: "Kan ik een aangepast frame of template meegeven?",
      answer:
        "Ja dat kan! We accepteren custom designs voor op de Photo Booth zelf (zie video's voor voorbeelden) en voor de printjes. Deze kunnen aangeleverd worden in Canva of Adobe in de formaat 1250 x 1920 px en opgestuurd naar worden via Whatsapp of via de mail. Mochten we niks ontvangen, dan maken we zelf een custom design passend voor jouw feest.",
    },
    {
      question: "Hoeveel foto's staan er op 1 printje?",
      answer: "Je hebt zelf de keuze tussen 1, 2 of 3 foto's per printje.",
    },
  ];

  // States that need to be shared
  let formElement;
  let selectedDuration = "2u";
</script>

<svelte:head>
  <title
    >ThePictureBooth - Direct boeken | Maak onvergetelijke herinneringen
  </title>
  <meta
    name="description"
    content="Huur een photobooth voor jouw bruiloft, bedrijfsfeest of verjaardag. Direct boeken met 100% tevredenheidsgarantie. Inclusief onbeperkt printen en begeleiding."
  />
  <meta
    name="keywords"
    content="photobooth huren, fotohokje huren, photobooth bruiloft, photobooth bedrijfsfeest, fotobooth evenement"
  />
  <meta
    property="og:title"
    content="ThePictureBooth - Direct boeken | Maak onvergetelijke herinneringen"
  />
  <meta
    property="og:description"
    content="Huur een premium photobooth voor jouw bruiloft, bedrijfsfeest of verjaardag. Inclusief onbeperkt printen, digitale foto's en professionele begeleiding."
  />
  <meta property="og:image" content="/images/og-image.jpg" />
  <meta property="og:url" content="https://thepicturebooth.nl" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="black-translucent"
  />
  <meta
    http-equiv="Content-Security-Policy"
    content="media-src 'self' data: blob:;"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="canonical" href="https://thepicturebooth.nl" />
  <!-- Structured data for SEO -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ThePictureBooth",
      "description": "Premium photobooth verhuur voor bruiloften, bedrijfsfeesten en evenementen",
      "telephone": "+31635627374",
      "email": "info.thepictureboothnl@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      },
      "areaServed": "Nederland",
      "offers": {
        "@type": "Offer",
        "price": "250",
        "priceCurrency": "EUR"
      }
    }
  </script>
</svelte:head>

<!-- Full-width hero section -->
<Hero />

<!-- Content sections with proper z-index to ensure interactivity -->
<div class="w-full bg-white relative z-0">
  <VideoCarousel />
</div>

<div class="w-full bg-gray-50 relative z-0">
  <Benefits {benefits} />
</div>
<!--
<div class="w-full bg-white relative z-0">
  <SpecialOffer />
</div>
-->
<div class="w-full bg-gray-50 relative z-0">
  <Reviews {reviews} />
</div>

<div class="w-full bg-white relative z-0">
  <Packages {packageFeatures} {durationPrices} bind:selectedDuration />
</div>

<div class="w-full bg-gray-50 relative z-0">
  <HowItWorks />
</div>

<div class="w-full bg-white relative z-0">
  <Faq {faqs} />
</div>

<div class="w-full bg-blue-50 relative z-0">
  <BookingForm bind:formElement {durationPrices} {selectedDuration} />
</div>

{#if successMessage}
  <SuccessPopup
    onClose={() => {
      // Close the popup
      successMessage = false;
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }}
  />
{:else if errorMessage}
  <!-- <ErrorPopup /> -->
{/if}<!-- WhatsApp bubble with higher z-index to ensure it's interactive -->
<div class="relative z-10">
  <WhatsAppBubble />
</div>

<style>
  :global(body) {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  /* Fix any potential pointer-events issues */
  :global(.pointer-events-none) {
    pointer-events: auto !important;
  }
</style>
