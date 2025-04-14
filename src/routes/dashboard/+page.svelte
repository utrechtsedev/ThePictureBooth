<script>
  import { onMount } from "svelte";
  import {
    PERIODS,
    getPeriod,
    setPeriod,
  } from "$lib/state/periodState.svelte.js";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import MetricCards from "$lib/components/dashboard/dashboard/MetricCards.svelte";
  import RevenueChart from "$lib/components/dashboard/dashboard/RevenueChart.svelte";
  import UpcomingEvents from "$lib/components/dashboard/dashboard/UpcomingEvents.svelte";
  import NotificationPanel from "$lib/components/dashboard/dashboard/NotificationPanel.svelte";
  import QuickActions from "$lib/components/dashboard/dashboard/QuickActions.svelte";
  import Tasks from "$lib/components/dashboard/dashboard/Tasks.svelte";
  import RecentActivity from "$lib/components/dashboard/dashboard/RecentActivity.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";

  const props = $props();

  let isLoading = $state(true);
  let dashboardData = $state({
    metrics: {
      totalRevenue: 0,
      totalBookings: 0,
      pendingBookings: 0,
      newCustomers: 0,
      averageRating: 0,
    },
    revenueChart: [],
    upcomingEvents: [],
    recentActivity: [],
    tasks: [],
    notifications: [],
  });

  let notifications = $state([]);
  let tasks = $state([]);
  let activities = $state([]);
  let revenueChart = $state([]);
  let metrics = $state([]);
  let upcomingEvents = $state([]);

  let currentPeriod = $derived(getPeriod());

  $effect(() => {
    if (!isLoading && props.data) {
      updateDashboardData(currentPeriod);
    }
  });

  onMount(async () => {
    await loadDashboardData();
    isLoading = false;
  });

  function updateDashboardData(period) {
    // Guard against undefined data
    if (!props.data || !props.data.dashboardData) return;

    const periodData = props.data.dashboardData[period];
    if (!periodData) return;

    revenueChart = periodData.revenueChart || [];
    metrics = periodData.metrics || {};
  }

  async function loadDashboardData() {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!props.data || !props.data.dashboardData) {
      console.error("Dashboard data is undefined");
      isLoading = false;
      return;
    }

    dashboardData = props.data.dashboardData;

    // Set individual data points if they exist
    if (props.data.dashboardData.notifications) {
      notifications = props.data.dashboardData.notifications;
    }

    if (props.data.dashboardData.tasks) {
      tasks = props.data.dashboardData.tasks;
    }

    if (props.data.dashboardData.activities) {
      activities = props.data.dashboardData.activities;
    }

    if (props.data.dashboardData.upcomingEvents) {
      upcomingEvents = props.data.dashboardData.upcomingEvents;
    }

    updateDashboardData(getPeriod());
  }
</script>

<div class="space-y-6">
  <PageHeader />
  {#if isLoading}
    <LoadingSpinner />
  {:else}
    <MetricCards {metrics} />

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="space-y-6 lg:col-span-2">
        <RevenueChart {revenueChart} />
        <UpcomingEvents {upcomingEvents} />
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <QuickActions />
        <NotificationPanel {notifications} />
        <Tasks {tasks} />
        <RecentActivity {activities} />
      </div>
    </div>
  {/if}
</div>
