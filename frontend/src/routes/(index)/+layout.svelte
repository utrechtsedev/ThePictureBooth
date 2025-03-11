<script>
  import '../../app.css';
  import tiktok from "$lib/images/tiktok.png";
  import instagram from "$lib/images/instagram.png";
  import '@fontsource-variable/figtree';
  import '@fontsource/pattaya';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let { children } = $props();
  
  // Mobile navigation
  let showMobileMenu = false;
  const toggleMobileMenu = () => {
    showMobileMenu = !showMobileMenu;
  };
  
  // Navigation links for better organization
  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Pakketten', href: '/#pakketten' },
    { title: 'Gallerij', href: '/gallerij' },
    { title: 'Over ons', href: '/over-ons' },
    { title: 'FAQ', href: '/#faq' },
    { title: 'Contact', href: '/contact' }
  ];
  
  // Scroll to top button
  let showScrollToTop = false;
  
  onMount(() => {
    // Show/hide scroll to top button based on scroll position
    const handleScroll = () => {
      showScrollToTop = window.scrollY > 500;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Social links
  const socialLinks = [
    { platform: 'Instagram', icon: instagram, href: 'https://www.instagram.com/the.picturebooth/', alt: 'Instagram Logo' },
    { platform: 'TikTok', icon: tiktok, href: 'https://www.tiktok.com/@the.picturebooth', alt: 'TikTok Logo' }
  ];
</script>

<div id="figtree" class="app">
  <!-- Header & Navigation -->
  <header class="w-full fixed top-0 z-40 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-md border-b border-zinc-800/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center py-4 md:justify-start md:space-x-10">
        <!-- Logo -->
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <a href="/" class="flex items-center">
            <span class="crazyfont text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              The Picture Booth
            </span>
          </a>
        </div>
        
        <!-- Mobile menu button -->
        <div class="-mr-2 -my-2 md:hidden">
          <button 
            on:click={toggleMobileMenu}
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
          >
            <span class="sr-only">Open menu</span>
            <!-- Icon when menu is closed -->
            {#if !showMobileMenu}
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {:else}
              <!-- Icon when menu is open -->
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {/if}
          </button>
        </div>
        
        <!-- Desktop menu -->
        <nav class="hidden md:flex space-x-10">
          {#each navLinks as link}
            <a href={link.href} class="text-base font-medium text-zinc-300 hover:text-white transition duration-150 ease-in-out">
              {link.title}
            </a>
          {/each}
        </nav>
        
        <!-- CTA Button -->
        <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <a 
            href="/#booking-form" 
            class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
          >
            Boek nu
          </a>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    {#if showMobileMenu}
      <div class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50 mt-16" transition:fade={{duration: 200}}>
        <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-zinc-900 divide-y-2 divide-zinc-800">
          <div class="pt-5 pb-6 px-5">
            <div class="grid grid-cols-1 gap-4">
              {#each navLinks as link}
                <a 
                  href={link.href} 
                  class="text-base font-medium text-zinc-300 hover:text-white transition duration-150 ease-in-out block px-3 py-2 rounded-md hover:bg-zinc-800"
                  on:click={toggleMobileMenu}
                >
                  {link.title}
                </a>
              {/each}
            </div>
          </div>
          <div class="py-6 px-5 space-y-6">
            <a
              href="/#booking-form"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              on:click={toggleMobileMenu}
            >
              Boek nu
            </a>
            <div class="flex justify-center space-x-6">
              {#each socialLinks as social}
                <a href={social.href} target="_blank" rel="noopener noreferrer" class="text-zinc-400 hover:text-white">
                  <img src={social.icon} alt={social.alt} class="h-6 w-6 filter" />
                </a>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </header>

  <main class="pt-20">
    <!-- Background Stars Animation -->
    <div id='stars'></div>
    <div id='stars2'></div>
    <div id='stars3'></div>
    
    <!-- Main Content -->
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="bg-gradient-to-t from-black to-transparent pt-12 pb-8 border-t border-zinc-800/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <a href="/" class="flex items-center mb-4">
            <span class="crazyfont text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              The Picture Booth
            </span>
          </a>
          <p class="text-zinc-400 max-w-md">
            De beste photobooth ervaring voor jouw evenement! Onvergetelijke herinneringen, 
            onbeperkt printen en professionele begeleiding. Beschikbaar in heel Nederland.
          </p>
          <div class="flex space-x-6 mt-6">
            {#each socialLinks as social}
              <a 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="p-2 transition-transform hover:scale-110 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full"
              >
                <img src={social.icon} alt={social.alt} class="h-6 w-6 filter" />
              </a>
            {/each}
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold text-lg mb-4">Snelle Links</h3>
          <ul class="space-y-3">
            {#each navLinks as link}
              <li>
                <a href={link.href} class="text-zinc-400 hover:text-white transition-colors">
                  {link.title}
                </a>
              </li>
            {/each}
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h3 class="text-white font-semibold text-lg mb-4">Contact</h3>
          <ul class="space-y-3 text-zinc-400">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-zinc-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>+31 6 12345678</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-zinc-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>info@thepicturebooth.nl</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-zinc-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span>Amsterdam, Nederland</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="mt-12 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center">
        <p class="text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} The Picture Booth. Alle rechten voorbehouden.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="/voorwaarden" class="text-zinc-500 hover:text-zinc-300 text-sm">Voorwaarden</a>
          <a href="/privacy" class="text-zinc-500 hover:text-zinc-300 text-sm">Privacy</a>
          <a href="/cookies" class="text-zinc-500 hover:text-zinc-300 text-sm">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
  
  <!-- Scroll to top button -->
  {#if showScrollToTop}
    <button 
      on:click={scrollToTop}
      class="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500 transform hover:scale-110"
      transition:fade={{duration: 200}}
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
    font-family: 'Figtree Variable', sans-serif;
  }
  
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
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
  
  /* Star animation CSS */
  #stars, #stars2, #stars3 {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  #stars {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: 1792px 1714px #FFF , 1752px 556px #FFF , 1353px 740px #FFF , 1577px 230px #FFF , 1839px 930px #FFF , 1748px 1795px #FFF , 53px 1513px #FFF , 1444px 1308px #FFF , 574px 1362px #FFF , 375px 5px #FFF , 1128px 1560px #FFF , 671px 1745px #FFF , 188px 854px #FFF , 968px 1613px #FFF , 1452px 1402px #FFF , 1305px 378px #FFF , 1647px 433px #FFF , 627px 990px #FFF , 1376px 1090px #FFF , 910px 116px #FFF , 1753px 1770px #FFF , 650px 1957px #FFF , 173px 1052px #FFF , 1230px 1561px #FFF , 176px 889px #FFF , 1428px 1302px #FFF , 335px 609px #FFF , 716px 2px #FFF , 503px 1370px #FFF , 1082px 203px #FFF , 1184px 1358px #FFF , 1055px 832px #FFF , 1690px 1628px #FFF , 131px 644px #FFF , 1277px 546px #FFF , 1569px 842px #FFF , 869px 1467px #FFF , 1697px 100px #FFF , 900px 1691px #FFF , 373px 191px #FFF , 636px 179px #FFF , 641px 28px #FFF , 1172px 1289px #FFF , 1259px 891px #FFF , 42px 961px #FFF , 1573px 1571px #FFF , 1638px 979px #FFF , 1235px 79px #FFF , 1846px 214px #FFF , 1230px 329px #FFF , 1060px 1055px #FFF , 1473px 384px #FFF , 832px 147px #FFF , 1251px 1548px #FFF , 866px 592px #FFF , 1027px 681px #FFF , 650px 886px #FFF , 1712px 1134px #FFF , 1023px 1792px #FFF;
    animation: animStar 50s linear infinite;
  }
  #stars:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: 1792px 1714px #FFF , 1752px 556px #FFF , 1353px 740px #FFF , 1577px 230px #FFF , 1839px 930px #FFF , 1748px 1795px #FFF , 53px 1513px #FFF , 1444px 1308px #FFF , 574px 1362px #FFF , 375px 5px #FFF , 1128px 1560px #FFF , 671px 1745px #FFF , 188px 854px #FFF , 968px 1613px #FFF , 1452px 1402px #FFF , 1305px 378px #FFF , 1647px 433px #FFF , 627px 990px #FFF , 1376px 1090px #FFF , 910px 116px #FFF , 1753px 1770px #FFF , 650px 1957px #FFF , 173px 1052px #FFF , 1230px 1561px #FFF , 176px 889px #FFF , 1428px 1302px #FFF , 335px 609px #FFF , 716px 2px #FFF , 503px 1370px #FFF , 1082px 203px #FFF , 1184px 1358px #FFF , 1055px 832px #FFF , 1690px 1628px #FFF , 131px 644px #FFF , 1277px 546px #FFF , 1569px 842px #FFF , 869px 1467px #FFF , 1697px 100px #FFF , 900px 1691px #FFF , 373px 191px #FFF , 636px 179px #FFF , 641px 28px #FFF , 1172px 1289px #FFF , 1259px 891px #FFF , 42px 961px #FFF , 1573px 1571px #FFF , 1638px 979px #FFF , 1235px 79px #FFF , 1846px 214px #FFF , 1230px 329px #FFF , 1060px 1055px #FFF , 1473px 384px #FFF , 832px 147px #FFF , 1251px 1548px #FFF , 866px 592px #FFF , 1027px 681px #FFF , 650px 886px #FFF , 1712px 1134px #FFF , 1023px 1792px #FFF;
  }

  #stars2 {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: 391px 941px #FFF , 873px 1493px #FFF , 1791px 1888px #FFF , 1334px 294px #FFF , 1534px 161px #FFF , 1161px 931px #FFF , 1081px 1312px #FFF , 300px 415px #FFF , 268px 68px #FFF , 976px 1249px #FFF , 1424px 1889px #FFF , 542px 704px #FFF , 520px 1180px #FFF , 773px 1074px #FFF , 937px 856px #FFF , 1999px 1133px #FFF , 143px 794px #FFF , 1271px 1328px #FFF , 146px 1307px #FFF , 1304px 1210px #FFF , 1094px 1967px #FFF , 772px 339px #FFF , 156px 549px #FFF , 1660px 366px #FFF , 1851px 191px #FFF , 1100px 1989px #FFF , 1139px 928px #FFF;
    animation: animStar 100s linear infinite;
  }
  #stars2:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: 391px 941px #FFF , 873px 1493px #FFF , 1791px 1888px #FFF , 1334px 294px #FFF , 1534px 161px #FFF , 1161px 931px #FFF , 1081px 1312px #FFF , 300px 415px #FFF , 268px 68px #FFF , 976px 1249px #FFF , 1424px 1889px #FFF , 542px 704px #FFF , 520px 1180px #FFF , 773px 1074px #FFF , 937px 856px #FFF , 1999px 1133px #FFF , 143px 794px #FFF , 1271px 1328px #FFF , 146px 1307px #FFF , 1304px 1210px #FFF , 1094px 1967px #FFF , 772px 339px #FFF , 156px 549px #FFF , 1660px 366px #FFF , 1851px 191px #FFF , 1100px 1989px #FFF , 1139px 928px #FFF;
  }

  #stars3 {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: 556px 737px #FFF , 1459px 1557px #FFF , 1771px 305px #FFF , 622px 609px #FFF , 1877px 1272px #FFF , 1858px 477px #FFF , 1318px 236px #FFF , 1948px 176px #FFF , 1121px 1557px #FFF , 545px 1727px #FFF , 323px 346px #FFF , 896px 526px #FFF , 386px 48px #FFF , 1233px 73px #FFF , 1102px 764px #FFF , 407px 1040px #FFF , 964px 1602px #FFF , 1420px 1929px #FFF , 1501px 1567px #FFF , 1301px 1560px #FFF , 408px 56px #FFF , 1246px 31px #FFF , 806px 1681px #FFF;
    animation: animStar 150s linear infinite;
  }
  #stars3:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: 556px 737px #FFF , 1459px 1557px #FFF , 1771px 305px #FFF , 622px 609px #FFF , 1877px 1272px #FFF , 1858px 477px #FFF , 1318px 236px #FFF , 1948px 176px #FFF , 1121px 1557px #FFF , 545px 1727px #FFF , 323px 346px #FFF , 896px 526px #FFF , 386px 48px #FFF , 1233px 73px #FFF , 1102px 764px #FFF , 407px 1040px #FFF , 964px 1602px #FFF , 1420px 1929px #FFF , 1501px 1567px #FFF , 1301px 1560px #FFF , 408px 56px #FFF , 1246px 31px #FFF , 806px 1681px #FFF;
  }

  @keyframes animStar {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-2000px);
    }
  }
</style>