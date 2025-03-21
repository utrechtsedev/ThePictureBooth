<script>
    import { fade, fly, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    
    export let notifications;
    let showModal = false;
    let animatingOut = false;
    
    // Filter for unread notifications
    $: unreadNotifications = notifications.filter(n => !n.read);
    
    function getNotificationTypeClass(type) {
      switch(type) {
        case 'info':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'success':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'error':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
    
    function toggleModal() {
      if (showModal) {
        animatingOut = true;
        setTimeout(() => {
          showModal = false;
          animatingOut = false;
        }, 300); // Match this with the transition duration
      } else {
        showModal = true;
      }
    }
    
    async function markNotificationAsRead(id) {
       // Optimistically update UI first
      notifications = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  
  try {
    // Call the API to update the notification on the server
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kon notificatie niet bijwerken');
    }
    
    const result = await response.json();
    console.log('Notification marked as read:', result);
    
  } catch (error) {
    console.error('Error marking notification as read:', error);
    
    // Revert UI change if API call failed
    notifications = notifications.map(n => 
      n.id === id ? { ...n, read: false } : n
    );
  } 
    }
    
    function markAllAsRead() {
      notifications = notifications.map(n => ({ ...n, read: true }));
      
      // Here you could add an API call to update all notifications on the server
    }
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notificaties</h3>
      <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        {unreadNotifications.length} Nieuw
      </span>
    </div>
    
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      {#if unreadNotifications.length === 0}
        <div class="p-5 text-center">
          <p class="text-gray-500 dark:text-gray-400">Geen nieuwe notificaties</p>
        </div>
      {:else}
        {#each unreadNotifications as notification (notification.id)}
          <div 
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors cursor-pointer" 
            on:click={() => markNotificationAsRead(notification.id)}
            in:fade={{ duration: 200 }}
          >
            <div class="flex">
              <div class="{getNotificationTypeClass(notification.type)} p-2 rounded-lg flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d={
                    notification.type === 'info' 
                      ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                      : notification.type === 'warning'
                      ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                      : notification.type === 'success'
                      ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z'
                      : 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                  } />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <div class="flex justify-between">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
              </div>
              <div class="flex-shrink-0 ml-2">
                <div class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              </div>
            </div>
          </div>
        {/each}
      {/if}
      
      <div class="p-4 bg-gray-50 dark:bg-gray-900/20">
        <button 
          class="w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          on:click={toggleModal}
        >
          Alles bekijken
        </button>
      </div>
    </div>
</div>

{#if showModal}
  <!-- Modal backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
    on:click={toggleModal}
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal content - stop propagation to prevent closing when clicking inside -->
    <div 
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full max-h-[85vh] flex flex-col"
      on:click|stopPropagation
      class:pointer-events-none={animatingOut}
      in:scale={{ duration: 200, opacity: 0, start: 0.95, easing: quintOut }}
      out:scale={{ duration: 300, opacity: 0, start: 0.95, easing: quintOut }}
    >
      <!-- Modal header -->
      <div class="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">Alle notificaties</h3>
        <div class="flex gap-4 items-center">
          {#if unreadNotifications.length > 0}
            <button 
              class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              on:click={markAllAsRead}
            >
              Alles gelezen
            </button>
          {/if}
          <button 
            class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            on:click={toggleModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Modal body -->
      <div class="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-700">
        {#if notifications.length === 0}
          <div class="p-6 text-center">
            <p class="text-gray-500 dark:text-gray-400">Geen notificaties</p>
          </div>
        {:else}
          {#each notifications as notification (notification.id)}
            <div 
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors cursor-pointer"
              class:opacity-70={notification.read}
              on:click={() => markNotificationAsRead(notification.id)}
            >
              <div class="flex">
                <div class="{getNotificationTypeClass(notification.type)} p-2 rounded-lg flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d={
                      notification.type === 'info' 
                        ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                        : notification.type === 'warning'
                        ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                        : notification.type === 'success'
                        ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z'
                        : 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z'
                    } />
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <div class="flex justify-between">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                </div>
                {#if !notification.read}
                  <div class="flex-shrink-0 ml-2">
                    <div class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}
