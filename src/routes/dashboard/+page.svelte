<script>
    import { onMount } from 'svelte';
    import LoadingSpinner from "../../lib/components/LoadingSpinner.svelte";
    import MetricCards from '../../lib/components/dashboard/dashboard/MetricCards.svelte';
    import RevenueChart from '../../lib/components/dashboard/dashboard/RevenueChart.svelte';
    import UpcomingEvents from '../../lib/components/dashboard/dashboard/UpcomingEvents.svelte';
    import NotificationPanel from '../../lib/components/dashboard/dashboard/NotificationPanel.svelte';
    import QuickActions from '../../lib/components/dashboard/dashboard/QuickActions.svelte';
    import Tasks from '../../lib/components/dashboard/dashboard/Tasks.svelte';
    import RecentActivity from '../../lib/components/dashboard/dashboard/RecentActivity.svelte';
    import PageHeader from '../../lib/components/PageHeader.svelte';
    export let data;
    
    let isLoading = true;
    let dashboardData = {
      metrics: {
        totalRevenue: 0,
        totalBookings: 0,
        pendingBookings: 0,
        newCustomers: 0,
        averageRating: 0
      },
      revenueChart: [],
      upcomingEvents: [],
      recentActivity: [],
      tasks: [],
      notifications: []
    };
    let notifications = [];
    let tasks = [];
    onMount(async () => {
      await loadDashboardData();
      isLoading = false;
    });
    
    async function loadDashboardData() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock dashboard data
      dashboardData = data.dashboardData;
      console.log(dashboardData)
      notifications = data.dashboardData.notifications;
      tasks = data.dashboardData.tasks;
}

  </script>
  <div class="space-y-6">
    <PageHeader />
    {#if isLoading}
     <LoadingSpinner />
    {:else}
      <MetricCards {dashboardData} />
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="space-y-6 lg:col-span-2">
          <RevenueChart {dashboardData} />
          <UpcomingEvents {dashboardData} />
        </div>
        
        <!-- Right Column -->
        <div class="space-y-6">
          <QuickActions />
          <NotificationPanel {notifications} />          
          <Tasks {tasks} />
          <RecentActivity {dashboardData} />
        </div>
      </div>
    {/if}
  </div>
