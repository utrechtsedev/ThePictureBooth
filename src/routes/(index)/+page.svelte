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
      { icon: "📸", text: "Professionele DSLR camera" },
      { icon: "🖨️", text: "Onbeperkt foto's printen" },
      { icon: "📱", text: "Digitale foto's direct op je telefoon" },
      { icon: "👨‍💼", text: "Professionele begeleiding" },
      { icon: "🎭", text: "Grote selectie props" },
    ],
    premium: [
      { icon: "✨", text: "Premium LED-verlichting" },
      { icon: "🎬", text: "Boomerang video's" },
      { icon: "💾", text: "USB met alle foto's" },
    ],
  };

  // Reviews for social proof
  const reviews = [
    {
      name: "Emma & Bas",
      event: "Bruiloft",
      text: "Absoluut een hoogtepunt op onze bruiloft! Gasten bleven maar teruggaan voor meer foto's. De kwaliteit was fantastisch.",
      rating: 5,
    },
    {
      name: "Marieke T.",
      event: "Bedrijfsfeest",
      text: "Professionele service van begin tot eind. Onze medewerkers waren dolenthousiast en de fotobooth was het gesprek van de avond.",
      rating: 5,
    },
    {
      name: "Thomas & Lisa",
      event: "Babyshower",
      text: "Perfecte toevoeging aan onze babyshower! De props waren geweldig en iedereen heeft genoten van de mooie herinneringen.",
      rating: 5,
    },
  ];

  // Price packages
  const durationPrices = {
    "2u": { price: 250, saving: 0, label: "Basis" },
    "3u": { price: 350, saving: 25, label: "Populair" },
    "4u": { price: 450, saving: 50, label: "Premium" },
    "5u": { price: 550, saving: 75, label: "Deluxe" },
  };

  // FAQs for conversion optimization
  const faqs = [
    {
      question: "Hoe lang van tevoren moet ik boeken?",
      answer:
        "We raden aan minimaal 2 weken van tevoren te boeken voor de beste beschikbaarheid, maar last-minute boekingen zijn vaak ook mogelijk. Neem contact op voor de actuele beschikbaarheid.",
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
      question: "Kan ik een aangepast fotoframe of template krijgen?",
      answer:
        "Absoluut! We ontwerpen een gepersonaliseerd fotoframe speciaal voor jouw evenement, inclusief namen, datum, en zelfs logo's. Dit is inbegrepen in de prijs.",
    },
  ];

  // States that need to be shared
  let formElement;
  let selectedDuration = "2u";
</script>

<svelte:head>
  <title
    >The Picture Booth - Direct boeken | Maak onvergetelijke herinneringen
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
    content="The Picture Booth - Direct boeken | Maak onvergetelijke herinneringen"
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
      "@type": "Service",
      "name": "The Picture Booth",
      "description": "Premium photobooth verhuur voor bruiloften, bedrijfsfeesten en evenementen",
      "provider": {
        "@type": "LocalBusiness",
        "name": "The Picture Booth",
        "telephone": "+31612345678",
        "email": "info@thepicturebooth.nl",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NL"
        }
      },
      "areaServed": "Nederland",
      "offers": {
        "@type": "Offer",
        "price": "250",
        "priceCurrency": "EUR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "124"
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

<div class="w-full bg-white relative z-0">
  <SpecialOffer />
</div>

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
