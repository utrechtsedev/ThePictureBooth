<script>
    export let filteredBookings = [];
    export let currentMonth;
    export let viewBookingDetails;

    // Helper function to get the status styling class
    function getStatusClass(status) {
        switch(status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }
    
    // Navigate to previous month
    function previousMonth() {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    }
    
    // Navigate to today
    function goToToday() {
        currentMonth = new Date();
    }
    
    // Navigate to next month
    function nextMonth() {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    }
    
    // Function to format date for mobile display
    function formatDayOfWeek(date) {
        return new Intl.DateTimeFormat('nl-NL', { weekday: 'short' }).format(date);
    }
    
    // Determine if we're in mobile view
    let isMobileView = false;
    
    // Set up a media query listener
    if (typeof window !== 'undefined') {
        isMobileView = window.innerWidth < 640;
        window.addEventListener('resize', () => {
            isMobileView = window.innerWidth < 640;
        });
    }
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div>
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(currentMonth)}
            </h2>
        </div>
        <div class="flex space-x-2">
            <button 
                on:click={previousMonth}
                class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                on:click={goToToday}
                class="p-1.5 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
            >
                Vandaag
            </button>
            <button 
                on:click={nextMonth}
                class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
    
    <!-- Desktop View (unchanged) for tablets and larger -->
    <div class="hidden sm:block">
        <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
            {#each ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'] as day}
                <div class="bg-gray-50 dark:bg-gray-800 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                </div>
            {/each}
        </div>
        
        <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {#each Array(35) as _, index}
                {@const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index - new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 1)}
                {@const isCurrentMonth = date.getMonth() === currentMonth.getMonth()}
                {@const isToday = new Date().toDateString() === date.toDateString()}
                {@const bookingsOnDay = filteredBookings.filter(b => new Date(b.date).toDateString() === date.toDateString())}
                
                <div class={`min-h-[100px] p-2 ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
                    <div class={`text-right ${isToday ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 h-6 w-6 rounded-full flex items-center justify-center ml-auto' : ''} ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                        {date.getDate()}
                    </div>
                    
                    <div class="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                        {#each bookingsOnDay as booking}
                            <div 
                                on:click={() => viewBookingDetails(booking)}
                                class="px-2 py-1 text-xs rounded-md truncate cursor-pointer
                                {booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}"
                            >
                                {booking.startTime} - {booking.eventType}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <!-- Mobile View - 1 column layout with larger day cells -->
    <div class="block sm:hidden">
        <div class="border-b border-gray-200 dark:border-gray-700">
            <div class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 text-center">
                Kalender
            </div>
        </div>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each Array(35) as _, index}
                {@const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index - new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 1)}
                {@const isCurrentMonth = date.getMonth() === currentMonth.getMonth()}
                {@const isToday = new Date().toDateString() === date.toDateString()}
                {@const bookingsOnDay = filteredBookings.filter(b => new Date(b.date).toDateString() === date.toDateString())}
                
                {#if isCurrentMonth}
                    <div class="p-3 bg-white dark:bg-gray-800">
                        <div class="flex items-center mb-2">
                            <div class={`flex-shrink-0 ${isToday ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 h-8 w-8 rounded-full flex items-center justify-center' : 'text-gray-900 dark:text-white'}`}>
                                <span class="font-medium">{date.getDate()}</span>
                            </div>
                            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                {formatDayOfWeek(date)}
                            </span>
                        </div>
                        
                        {#if bookingsOnDay.length > 0}
                            <div class="space-y-2">
                                {#each bookingsOnDay as booking}
                                    <div 
                                        on:click={() => viewBookingDetails(booking)}
                                        class="p-2 text-sm rounded-md cursor-pointer
                                        {booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}"
                                    >
                                        <div class="font-medium">{booking.startTime} - {booking.eventType}</div>
                                        <div class="text-xs mt-1 opacity-80">{booking.customer?.name || ''}</div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="text-sm text-gray-400 dark:text-gray-500 py-1">
                                Geen boekingen
                            </div>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>