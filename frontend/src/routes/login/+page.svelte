<div class="w-full min-h-screen bg-gray-200">
<div class="font-[sans-serif]">
  <div class="flex flex-col items-center justify-center py-6 px-4">
    <div class="max-w-md w-full">
      <div class="p-8 rounded-2xl bg-white shadow border border-gray-300">
        <h2 class="text-gray-800 text-center text-2xl font-bold">Log in</h2>
        <form class="mt-8 space-y-4">
          <div>
            <label class="text-gray-800 text-sm mb-2 block">Gebruikersnaam</label>
            <div class="relative flex items-center">
              <input 
                bind:value={username}
                type="text" 
                required 
                class="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" 
                placeholder="Vul gebruikersnaam in" 
              />
              <!-- SVG code -->
            </div>
          </div>

          <div>
            <label class="text-gray-800 text-sm mb-2 block">Wachtwoord</label>
            <div class="relative flex items-center">
              <input 
                bind:value={password}
                type="password" 
                required 
                class="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" 
                placeholder="Vul wachtwoord in" 
              />
              <!-- SVG code -->
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4">
            <!-- Onthoud me checkbox -->
          </div>

          {#if error}
            <div class="text-red-500 text-sm">{error}</div>
          {/if}

          <div class="!mt-8">
            <button on:click={handleLogin}
              type="submit" 
              class="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? 'Bezig met inloggen...' : 'Aanmelden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</div>
<div class="font-[sans-serif]">
  <!-- Behoud je bestaande HTML structuur -->
</div>

<script>
  import '../../app.css';
  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login mislukt');
      }

      // Forceer full page reload om sessie te laden
      window.location.href = '/dashboard';
      
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>
