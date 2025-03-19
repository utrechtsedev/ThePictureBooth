<script>
    export let upcomingEvents;

    function formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }

    function getStatusLabel(status) {
      switch(status) {
        case 'confirmed': return 'Bevestigd';
        case 'pending': return 'In afwachting';
        case 'cancelled': return 'Geannuleerd';
        default: return status;
      }
    }

    function getStatusClass(status) {
      switch(status) {
        case 'confirmed':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'cancelled':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aankomende Evenementen</h3>
      <a href="/dashboard/boekingen" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
        Alle bekijken
      </a>
    </div>
    
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      {#each upcomingEvents as event}
        <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
          <div class="flex justify-between">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{event.title}</h4>
              <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"/>
                  <path fill="currentColor" fill-rule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
                </svg>
                {formatDate(event.date)} · {event.time}
              </div>
              <div class="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"/>
                </svg>
                {event.location}
              </div>
            </div>
            <div class="flex flex-col items-end">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 {getStatusClass(event.status)}">
                {getStatusLabel(event.status)}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{event.package} pakket</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
