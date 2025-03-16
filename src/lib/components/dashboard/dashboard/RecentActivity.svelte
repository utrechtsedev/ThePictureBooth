<script>
    export let dashboardData;

    function getIconForActivityType(type) {
      switch(type) {
        case 'booking':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z" /><path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd" /></svg>';
        case 'payment':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z" /></svg>';
        case 'customer':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>';
        case 'review':
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" /></svg>';
        default:
          return '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M19 20H5V9h14m-3-7v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V2m-7 11h5v5h-5v-5z" /></svg>';
      }
    }

</script>
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recente Activiteit</h3>
      <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
        Alles bekijken
      </button>
    </div>
    
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      {#if dashboardData.recentActivity.length === 0}
        <div class="p-5 text-center">
          <p class="text-gray-500 dark:text-gray-400">Geen recente activiteit</p>
        </div>
      {:else}
        {#each dashboardData.recentActivity as activity}
          <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
            <div class="flex">
              <div class="p-2 rounded-lg flex-shrink-0 
                {activity.type === 'booking' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' : 
                 activity.type === 'payment' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 
                 activity.type === 'customer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 
                 activity.type === 'review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' : 
                 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'}"
              >
                {@html getIconForActivityType(activity.type)}
              </div>
              <div class="ml-3 flex-1">
                <div class="flex justify-between">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>