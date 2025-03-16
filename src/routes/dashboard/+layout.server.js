import { getBookingMetrics } from './funcs/bookingMetrics.js';
import { getCustomerMetrics } from './funcs/customerMetrics.js';
import { getRatingMetrics } from './funcs/ratingMetrics.js';
import { getRevenueChartData } from './funcs/revenueMetrics.js';

export async function load({ locals }) {

const customerMetrics = await getCustomerMetrics();
const bookingMetrics = await getBookingMetrics();
const ratingMetrics = await getRatingMetrics();





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
      recentActivity: [
        {
          id: 1,
          type: 'booking',
          title: 'Nieuwe boeking',
          description: 'Bruiloft Laura & Pieter is bevestigd',
          time: '2 uur geleden',
          icon: 'calendar'
        },
        {
          id: 2,
          type: 'payment',
          title: 'Betaling ontvangen',
          description: '€395 van Bedrijf XYZ',
          time: '5 uur geleden',
          icon: 'payment'
        },
        {
          id: 3,
          type: 'customer',
          title: 'Nieuwe klant',
          description: 'Mark Jansen heeft zich aangemeld',
          time: '1 dag geleden',
          icon: 'person'
        },
        {
          id: 4,
          type: 'review',
          title: 'Nieuwe recensie',
          description: '5-sterren recensie van Emma de Vries',
          time: '2 dagen geleden',
          icon: 'star'
        }
      ],
      tasks: [
        {
          id: 1,
          title: 'Bevestig boeking Verjaardag Mark',
          priority: 'high',
          dueDate: '2025-03-18',
          completed: false
        },
        {
          id: 2,
          title: 'Stuur factuur naar Café De Kroon',
          priority: 'medium',
          dueDate: '2025-03-20',
          completed: false
        },
        {
          id: 3,
          title: 'Bereid apparatuur voor - Bruiloft Laura',
          priority: 'low',
          dueDate: '2025-04-14',
          completed: false
        },
        {
          id: 4,
          title: 'Bestel nieuwe props voor themapakket',
          priority: 'medium',
          dueDate: '2025-03-28',
          completed: true
        }
      ],
      notifications: [
        {
          id: 1,
          title: 'Nieuwe boeking',
          message: 'Je hebt een nieuwe boeking voor 15 april',
          type: 'info',
          read: false,
          time: '2 uur geleden'
        },
        {
          id: 2,
          title: 'Boeking moet bevestigd worden',
          message: 'Verjaardag Mark wacht op bevestiging',
          type: 'warning',
          read: false,
          time: '1 dag geleden'
        },
        {
          id: 3,
          title: 'Betaling ontvangen',
          message: 'Betaling van €395 is ontvangen',
          type: 'success',
          read: true,
          time: '5 uur geleden'
        }
      ]
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