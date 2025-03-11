<script>
    let oldPassword = '';
    let newPassword = '';
    let confirmPassword = '';
    let statusMessage = null;
    function handlePasswordChange() {


  // Client-side validation
  if (newPassword !== confirmPassword) {
    alert("Nieuw wachtwoord en bevestiging komen niet overeen");
    return;
  }

  fetch("https://thepicturebooth.nl/api/admins/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Necessary to include session cookie
    body: JSON.stringify({ oldPassword, newPassword }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw err;
        });
      }
      return response.json();
    })
    .then((data) => {
      alert("Wachtwoord succesvol aangepast!");
      // Clear form fields after successful change
      oldPassword = "";
      newPassword = "";
      confirmPassword = "";
    })
    .catch((error) => {
      console.error("Fout:", error);
      alert(error.error || "Er is een fout opgetreden bij het wijzigen van het wachtwoord.");
    });
}
</script>

<div class="w-full max-w-lg mx-auto mt-8 p-6 rounded-2xl bg-white border border-gray-300 backdrop-blur-sm shadow-2xl shadow-blue-900/20">
    <h2 class="text-2xl text-center mb-6 text-black">
      🔒 Wachtwoord Wijzigen
    </h2>
  
    <form on:submit={handlePasswordChange} class="space-y-6">
      <!-- Huidig Wachtwoord -->
      <div class="animate-fade-in-up" style="--delay: 0.1s">
        <label class="block text-black font-medium mb-2">Huidig Wachtwoord</label>
        <input
          type="password"
          class="w-full px-4 py-3 rounded-lg bg-white border border-black
                 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 transition-all"
          placeholder="••••••••"
          required
          bind:value={oldPassword}
        />
      </div>
  
      <!-- Nieuw Wachtwoord -->
      <div class="animate-fade-in-up" style="--delay: 0.2s">
        <label class="block text-black font-medium mb-2">Nieuw Wachtwoord</label>
        <input
          type="password"
          class="w-full px-4 py-3 rounded-lg bg-white border border-black
                 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 transition-all"
          placeholder="••••••••"
          required
          bind:value={newPassword}
        />
      </div>
  
      <!-- Bevestig Wachtwoord -->
      <div class="animate-fade-in-up" style="--delay: 0.3s">
        <label class="block text-black font-medium mb-2">Bevestig Wachtwoord</label>
        <input
          type="password"
          class="w-full px-4 py-3 rounded-lg bg-white border border-black
                 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 transition-all"
          placeholder="••••••••"
          required
          bind:value={confirmPassword}
        />
      </div>
      <!-- Actie Knoppen -->
      <div class="animate-fade-in-up flex justify-end gap-4" style="--delay: 0.5s">
        <button
          type="submit"
          class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Wachtwoord Wijzigen
        </button>
      </div>
  
      <!-- Status Melding -->
      {#if statusMessage}
        <div class="animate-fade-in-up mt-4 p-3 text-sm rounded-lg
          {statusMessage.type === 'success' 
            ? 'bg-emerald-900/30 text-emerald-400' 
            : 'bg-rose-900/30 text-rose-400'}"
        >
          {statusMessage.text}
        </div>
      {/if}
    </form>
  
    <!-- Beveiligingsfooter -->
    <div class="animate-fade-in-up mt-8 pt-6 border-t border-zinc-800 text-center" style="--delay: 0.6s">
      <p class="text-xs text-zinc-500">
        Beveiligingswijzigingen worden gelogd<br>
        <a href="mailto:aichou@innovatie.nl" class="text-blue-400 hover:text-blue-300 transition-colors">
          Meld verdachte activiteiten
        </a>
      </p>
    </div>
  </div>