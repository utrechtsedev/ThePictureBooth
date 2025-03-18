<script>
    export let notifications;
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
   

</script>
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notificaties</h3>
      <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        {notifications.filter(n => !n.read).length} Nieuw
      </span>
    </div>
    
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      {#if notifications.length === 0}
        <div class="p-5 text-center">
          <p class="text-gray-500 dark:text-gray-400">Geen notificaties</p>
        </div>
      {:else}
        {#each notifications as notification}
          <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors {notification.read ? 'opacity-70' : ''}" on:click={() => markNotificationAsRead(notification.id)}>
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
