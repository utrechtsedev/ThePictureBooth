import { getBookingMetrics } from './funcs/bookingMetrics.js';
import { getCustomerMetrics } from './funcs/customerMetrics.js';
import { getRatingMetrics } from './funcs/ratingMetrics.js';
import { getRevenueChartData } from './funcs/revenueMetrics.js';
import { models } from '../../lib/server/models/index.js'; // TODO: edit to $lib instead of ../../lib
export async function load({ locals }) {

const customerMetrics = await getCustomerMetrics();
const bookingMetrics = await getBookingMetrics();
const ratingMetrics = await getRatingMetrics();
const notifications = await models.Notification.findAll({where: {read: false}})
const tasks = await models.Task.findAll({where: {completed: false}})
const activities = await models.Activity.findAll({limit: 10})

  try {
    let dashboardData = {
      metrics: {
        totalRevenue: bookingMetrics.revenue.week.amount,
        totalRevenueGrowth: bookingMetrics.bookings.week.growth,
        totalBookings: bookingMetrics.bookings.week.count,
        totalBookingsGrowth: bookingMetrics.bookings.week.growth,
        pendingBookings: bookingMetrics.pending.week,
        newCustomers: customerMetrics.week.count,
        newCustomersGrowth: customerMetrics.week.growth,
        averageRating: ratingMetrics.average
      },
      revenueChart: await getRevenueChartData('week'),

      upcomingEvents: [
        {
          id: 1,
          title: 'Bruiloft Laura & Pieter',
          date: '2025-04-15',
          time: '16:00 - 22:00',
          location: 'Landgoed Wolfslaar, Breda',
          customer: 'Laura van den Berg',
          status: 'confirmed',
          package: 'Premium'
        },
        {
          id: 2,
          title: 'Bedrijfsfeest XYZ',
          date: '2025-04-05',
          time: '19:00 - 23:00',
          location: 'Kantoor XYZ, Amsterdam',
          customer: 'Bedrijf XYZ',
          status: 'confirmed',
          package: 'Basic'
        },
        {
          id: 3,
          title: 'Verjaardag Mark',
          date: '2025-03-22',
          time: '20:00 - 01:00',
          location: 'Café De Kroon, Utrecht',
          customer: 'Mark Jansen',
          status: 'pending',
          package: 'Standard'
        },
        {
          id: 4,
          title: 'Themafeest De Kroon',
          date: '2025-04-20',
          time: '21:00 - 02:00',
          location: 'Café De Kroon, Utrecht',
          customer: 'Café De Kroon',
          status: 'pending',
          package: 'Standard'
        }
      ],
      activities: activities.map(activity => {
          const createdAt = new Date(activity.created_at);
          const now = new Date();
          const diffInSeconds = Math.floor((now - createdAt) / 1000);
  
          let timeAgo;
  
  if (diffInSeconds < 60) {
    timeAgo = `${diffInSeconds} seconden geleden`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    timeAgo = `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'} geleden`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    timeAgo = `${hours} ${hours === 1 ? 'uur' : 'uren'} geleden`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    timeAgo = `${days} ${days === 1 ? 'dag' : 'dagen'} geleden`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    timeAgo = `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    timeAgo = `${months} ${months === 1 ? 'maand' : 'maanden'} geleden`;
  }
        return {
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          time: timeAgo, 
        }
 
      }),
      tasks: tasks.map(task => {
        return {
          id: task.public_id,
          title: task.title,
          priority: task.priority,
          dueDate: task.dueDate,
          completed: task.completed,
          created_at: task.created_at,
        }
      }),
notifications: notifications.map(notification => {
  const createdAt = new Date(notification.created_at);
  const now = new Date();
  const diffInSeconds = Math.floor((now - createdAt) / 1000);
  
  let timeAgo;
  
  if (diffInSeconds < 60) {
    timeAgo = `${diffInSeconds} seconden geleden`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    timeAgo = `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'} geleden`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    timeAgo = `${hours} ${hours === 1 ? 'uur' : 'uren'} geleden`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    timeAgo = `${days} ${days === 1 ? 'dag' : 'dagen'} geleden`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    timeAgo = `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    timeAgo = `${months} ${months === 1 ? 'maand' : 'maanden'} geleden`;
  }
  
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    read: notification.read,
    time: timeAgo
  };
}),
    };

    return {
      user: locals.user || null,
      dashboardData
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Return basic data structure on error
    return {
      user: locals.user || null,
      dashboardData: {
        metrics: {
          totalRevenue: 28750,
          totalBookings: 42,
          pendingBookings: 8,
          newCustomers: 0, // Default on error
          averageRating: 4.8
        },
        revenueChart: [],
        upcomingEvents: [],
        recentActivity: [],
        tasks: [],
        notifications: []
      }
    };
  }
}
