import { getBookingMetrics } from "./funcs/bookingMetrics.js";
import { getCustomerMetrics } from "./funcs/customerMetrics.js";
import { getRatingMetrics } from "./funcs/ratingMetrics.js";
import { getRevenueChartData } from "./funcs/revenueMetrics.js";
import { models } from "$lib/server/models/index.js";
import { Op } from "sequelize";
export async function load({ locals }) {
  const customerMetrics = await getCustomerMetrics();
  const bookingMetrics = await getBookingMetrics();
  const ratingMetrics = await getRatingMetrics();
  const notifications = await models.Notification.findAll();
  const tasks = await models.Task.findAll({ where: { completed: false } });
  const activities = await models.Activity.findAll({ limit: 10 });
  const revenueChart = await getRevenueChartData();

  const upcomingEvents = await models.Reservation.findAll({
    where: {
      event_date: {
        [Op.gt]: new Date(), // Finds all reservations with event_date > current time
      },
    },
    include: [{ model: models.Customer }],
  });

  try {
    let dashboardData = {
      activities: activities,
      upcomingEvents: upcomingEvents.map((item) => {
        // Format the date: YYYY-MM-DD
        const date = new Date(item.event_date);
        const formattedDate = date.toISOString().split("T")[0];

        // Create time range based on event_duration
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const startTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        // Calculate end time based on duration
        let durationHours = 0;
        if (item.event_duration) {
          durationHours = parseInt(item.event_duration);
        }
        const endDate = new Date(date);
        endDate.setHours(endDate.getHours() + durationHours);
        const endHours = endDate.getHours();
        const endMinutes = endDate.getMinutes();
        const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

        // Format time range
        const timeRange = `${startTime} - ${endTime}`;

        // Map package name based on duration
        let packageName = "Unknown";
        switch (item.event_duration) {
          case "2":
            packageName = "Basic";
            break;
          case "3":
            packageName = "Popular";
            break;
          case "4":
            packageName = "Premium";
            break;
          case "5":
            packageName = "Deluxe";
            break;
        }

        // Map status (converting "accepted" to "confirmed")
        let statusText = item.status;
        if (statusText === "accepted") {
          statusText = "confirmed";
        }

        return {
          id: item.id,
          title: `${item.event_type}: ${item.Customer.first_name} ${item.Customer.last_name}`,
          date: formattedDate,
          time: timeRange,
          location: item.event_location,
          customer: `${item.Customer.first_name} ${item.Customer.last_name}`,
          status: statusText,
          package: packageName,
        };
      }),
      activities: activities.map((activity) => {
        const createdAt = new Date(activity.created_at);
        const now = new Date();
        const diffInSeconds = Math.floor((now - createdAt) / 1000);

        let timeAgo;

        if (diffInSeconds < 60) {
          timeAgo = `${diffInSeconds} seconden geleden`;
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          timeAgo = `${minutes} ${minutes === 1 ? "minuut" : "minuten"} geleden`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          timeAgo = `${hours} ${hours === 1 ? "uur" : "uren"} geleden`;
        } else if (diffInSeconds < 604800) {
          const days = Math.floor(diffInSeconds / 86400);
          timeAgo = `${days} ${days === 1 ? "dag" : "dagen"} geleden`;
        } else if (diffInSeconds < 2592000) {
          const weeks = Math.floor(diffInSeconds / 604800);
          timeAgo = `${weeks} ${weeks === 1 ? "week" : "weken"} geleden`;
        } else {
          const months = Math.floor(diffInSeconds / 2592000);
          timeAgo = `${months} ${months === 1 ? "maand" : "maanden"} geleden`;
        }
        return {
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          time: timeAgo,
        };
      }),
      tasks: tasks.map((task) => {
        return {
          id: task.public_id,
          title: task.title,
          priority: task.priority,
          dueDate: task.dueDate,
          completed: task.completed,
          created_at: task.created_at,
        };
      }),
      notifications: notifications.map((notification) => {
        const createdAt = new Date(notification.created_at);
        const now = new Date();
        const diffInSeconds = Math.floor((now - createdAt) / 1000);

        let timeAgo;

        if (diffInSeconds < 60) {
          timeAgo = `${diffInSeconds} seconden geleden`;
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          timeAgo = `${minutes} ${minutes === 1 ? "minuut" : "minuten"} geleden`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          timeAgo = `${hours} ${hours === 1 ? "uur" : "uren"} geleden`;
        } else if (diffInSeconds < 604800) {
          const days = Math.floor(diffInSeconds / 86400);
          timeAgo = `${days} ${days === 1 ? "dag" : "dagen"} geleden`;
        } else if (diffInSeconds < 2592000) {
          const weeks = Math.floor(diffInSeconds / 604800);
          timeAgo = `${weeks} ${weeks === 1 ? "week" : "weken"} geleden`;
        } else {
          const months = Math.floor(diffInSeconds / 2592000);
          timeAgo = `${months} ${months === 1 ? "maand" : "maanden"} geleden`;
        }

        return {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          time: timeAgo,
        };
      }),

      week: {
        metrics: {
          totalRevenue: bookingMetrics.revenue.week.amount,
          totalRevenueGrowth: bookingMetrics.bookings.week.growth,
          totalBookings: bookingMetrics.bookings.week.count,
          totalBookingsGrowth: bookingMetrics.bookings.week.growth,
          pendingBookings: bookingMetrics.pending.week,
          newCustomers: customerMetrics.week.count,
          newCustomersGrowth: customerMetrics.week.growth,
          averageRating: ratingMetrics.average,
        },
        revenueChart: revenueChart.week,
      },
      month: {
        metrics: {
          totalRevenue: bookingMetrics.revenue.month.amount,
          totalRevenueGrowth: bookingMetrics.bookings.month.growth,
          totalBookings: bookingMetrics.bookings.month.count,
          totalBookingsGrowth: bookingMetrics.bookings.month.growth,
          pendingBookings: bookingMetrics.pending.month,
          newCustomers: customerMetrics.month.count,
          newCustomersGrowth: customerMetrics.month.growth,
          averageRating: ratingMetrics.average,
        },
        revenueChart: revenueChart.month,
      },
      quarter: {
        metrics: {
          totalRevenue: bookingMetrics.revenue.quarter.amount,
          totalRevenueGrowth: bookingMetrics.bookings.quarter.growth,
          totalBookings: bookingMetrics.bookings.quarter.count,
          totalBookingsGrowth: bookingMetrics.bookings.quarter.growth,
          pendingBookings: bookingMetrics.pending.quarter,
          newCustomers: customerMetrics.quarter.count,
          newCustomersGrowth: customerMetrics.quarter.growth,
          averageRating: ratingMetrics.average,
        },
        revenueChart: revenueChart.quarter,
      },
      year: {
        metrics: {
          totalRevenue: bookingMetrics.revenue.year.amount,
          totalRevenueGrowth: bookingMetrics.bookings.year.growth,
          totalBookings: bookingMetrics.bookings.year.count,
          totalBookingsGrowth: bookingMetrics.bookings.year.growth,
          pendingBookings: bookingMetrics.pending.year,
          newCustomers: customerMetrics.year.count,
          newCustomersGrowth: customerMetrics.year.growth,
          averageRating: ratingMetrics.average,
        },
        revenueChart: revenueChart.year,
      },
    };

    return {
      user: locals.user || null,
      dashboardData,
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
          averageRating: 4.8,
        },
        revenueChart: [],
        upcomingEvents: [],
        recentActivity: [],
        tasks: [],
        notifications: [],
      },
    };
  }
}
