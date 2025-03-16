<script>
    export let dashboardData;
    function toggleTaskComplete(id) {
      dashboardData.tasks = dashboardData.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
    }
    function getPriorityClass(priority) {
      switch(priority) {
        case 'high':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'low':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }

    function getPriorityLabel(priority) {
      switch(priority) {
        case 'high': return 'Hoog';
        case 'medium': return 'Middel';
        case 'low': return 'Laag';
        default: return priority;
      }
    }
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Taken</h3>
      <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
        Nieuwe taak
      </button>
    </div>
    
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      {#if dashboardData.tasks.length === 0}
        <div class="p-5 text-center">
          <p class="text-gray-500 dark:text-gray-400">Geen taken</p>
        </div>
      {:else}
        {#each dashboardData.tasks.filter(t => !t.completed).slice(0, 3) as task}
          <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
            <div class="flex items-start">
              <input 
                type="checkbox" 
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 mt-1"
                checked={task.completed}
                on:change={() => toggleTaskComplete(task.id)}
              />
              <div class="ml-3 flex-1">
                <div class="flex justify-between">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                  <span class="px-2 py-0.5 rounded text-xs font-medium {getPriorityClass(task.priority)}">
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Deadline: {formatDate(task.dueDate)}</p>
              </div>
            </div>
          </div>
        {/each}
        
        {#if dashboardData.tasks.some(t => t.completed)}
          <div class="p-4 bg-gray-50 dark:bg-gray-900/20">
            <button class="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Toon voltooide taken ({dashboardData.tasks.filter(t => t.completed).length})
            </button>
          </div>
        {/if}
      {/if}
    </div>
  </div>