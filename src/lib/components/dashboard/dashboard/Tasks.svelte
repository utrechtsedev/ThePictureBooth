<script>
    export let tasks = []; // Provide default empty array
    
    // New task form state
    let showForm = false;
    let newTitle = '';
    let newPriority = 'medium';
    let newDueDate = new Date().toISOString().split('T')[0]; // Default to today
    let isSubmitting = false;
    let formError = null;
    
    async function toggleTaskComplete(id) {
      if (!tasks) return; // Guard against undefined tasks
      
      // Find the task
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      // Update the UI optimistically
      tasks = tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      
      try {
        // Send the update to the server
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            completed: !task.completed
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Kon taak niet bijwerken');
        }
        
        // Get the updated task from the response
        const result = await response.json();
        console.log('Task updated successfully:', result);
        
      } catch (err) {
        console.error('Error updating task completion:', err);
        
        // Revert the UI change if the API call failed
        tasks = tasks.map(t => 
          t.id === id ? { ...t, completed: task.completed } : t
        );
        
        // Could add an error notification here
        alert('Kon taak status niet bijwerken: ' + err.message);
      }
    }
    
    function getPriorityClass(priority) {
      if (!priority) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Default for undefined
      
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
      if (!dateString) return ''; // Guard against undefined
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('nl-NL', {
          day: 'numeric',
          month: 'long', 
          year: 'numeric'
        }).format(date);
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString; // Fallback to the original string
      }
    }
    
    function getPriorityLabel(priority) {
      if (!priority) return ''; // Guard against undefined
      
      switch(priority) {
        case 'high': return 'Hoog';
        case 'medium': return 'Middel';
        case 'low': return 'Laag';
        default: return priority;
      }
    }
    
    let showCompleted = false;
    
    function toggleForm() {
      showForm = !showForm;
      if (!showForm) {
        // Reset form when closing
        newTitle = '';
        newPriority = 'medium';
        newDueDate = new Date().toISOString().split('T')[0];
        formError = null;
      }
    }
    
    async function handleSubmit() {
      if (!newTitle.trim()) {
        formError = 'Titel is verplicht';
        return;
      }
      
      isSubmitting = true;
      formError = null;
      
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: newTitle,
            priority: newPriority,
            dueDate: newDueDate
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Er is een fout opgetreden');
        }
        
        // Add the new task to the list
        tasks = [...(tasks || []), result.task];
        
        // Reset form and hide it
        newTitle = '';
        newPriority = 'medium';
        newDueDate = new Date().toISOString().split('T')[0];
        showForm = false;
        
      } catch (err) {
        formError = err.message;
        console.error('Error submitting task:', err);
      } finally {
        isSubmitting = false;
      }
    }
    
    // Safe filters to avoid errors with undefined tasks
    $: incompleteTasks = tasks && Array.isArray(tasks) ? tasks.filter(t => t && !t.completed) : [];
    $: completedTasks = tasks && Array.isArray(tasks) ? tasks.filter(t => t && t.completed) : [];
    $: hasCompletedTasks = completedTasks.length > 0;
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Taken</h3>
      <button 
        class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        on:click={toggleForm}
      >
        Nieuwe taak
      </button>
    </div>
    
    {#if showForm}
      <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        {#if formError}
          <div class="mb-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded">
            {formError}
          </div>
        {/if}
        
        <form on:submit|preventDefault={handleSubmit} class="space-y-3">
          <div>
            <label for="newTitle" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Titel</label>
            <input 
              type="text" 
              id="newTitle" 
              bind:value={newTitle} 
              class="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Taak omschrijving"
            />
          </div>
          
          <div>
            <label for="newPriority" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prioriteit</label>
            <select 
              id="newPriority" 
              bind:value={newPriority} 
              class="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="high">Hoog</option>
              <option value="medium">Middel</option>
              <option value="low">Laag</option>
            </select>
          </div>
          
          <div>
            <label for="newDueDate" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
            <input 
              type="date" 
              id="newDueDate" 
              bind:value={newDueDate} 
              class="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="flex justify-end">
            <button 
              type="button" 
              on:click={toggleForm}
              class="mr-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              disabled={isSubmitting}
            >
              Annuleren
            </button>
            <button 
              type="submit" 
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Bezig...' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>
    {/if}
    
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      {#if !tasks || tasks.length === 0}
        <div class="p-5 text-center">
          <p class="text-gray-500 dark:text-gray-400">Geen taken</p>
        </div>
      {:else}
        {#each incompleteTasks as task (task.id)}
          <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
            <div class="flex items-start">
              <input 
                type="checkbox" 
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 mt-1"
                checked={task.completed || false}
                on:change={() => toggleTaskComplete(task.id)}
              />
              <div class="ml-3 flex-1">
                <div class="flex justify-between">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{task.title || ''}</p>
                  <span class="px-2 py-0.5 rounded text-xs font-medium {getPriorityClass(task.priority)}">
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Deadline: {formatDate(task.dueDate)}</p>
              </div>
            </div>
          </div>
        {/each}
        
        {#if hasCompletedTasks}
          <div class="p-4 bg-gray-50 dark:bg-gray-900/20">
            <button 
              class="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              on:click={() => showCompleted = !showCompleted}
            >
              {showCompleted ? 'Verberg' : 'Toon'} voltooide taken ({completedTasks.length})
            </button>
          </div>
          
          {#if showCompleted}
            {#each completedTasks as task (task.id)}
              <div class="p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors">
                <div class="flex items-start">
                  <input 
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 mt-1"
                    checked={task.completed || false}
                    on:change={() => toggleTaskComplete(task.id)}
                  />
                  <div class="ml-3 flex-1">
                    <div class="flex justify-between">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 line-through">{task.title || ''}</p>
                      <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Deadline: {formatDate(task.dueDate)}</p>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        {/if}
      {/if}
    </div>
  </div>
