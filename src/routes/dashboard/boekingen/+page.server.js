// routes/dashboard/boekingen/+page.server.js
import { models } from "../../../lib/server/models/index.js";
export async function load() {
  const reservations = await models.Reservation.findAll({
    include: [{
      model: models.Customer,
    }]
  });
  
  // Transform the reservations to match the bookings structure
  const bookings = reservations.map(reservation => {
    // Convert Sequelize model to plain JS object
    const reservationData = reservation.get({ plain: true });
    const customer = reservationData.Customer;
    
    // Get event date as a proper Date object
    const eventDate = new Date(reservationData.event_date);
    
    // Format date as YYYY-MM-DD for date property (needed for calendar view)
    const formattedDate = eventDate.toISOString().split('T')[0];
    
    // Format times
    const hours = String(eventDate.getHours()).padStart(2, '0');
    const minutes = String(eventDate.getMinutes()).padStart(2, '0');
    const startTime = `${hours}:${minutes}`;
    
    // Calculate end time based on duration
    let endTime;
    const durationHours = parseInt(reservationData.event_duration);
    if (!isNaN(durationHours)) {
      const endHour = (eventDate.getHours() + durationHours) % 24;
      endTime = `${String(endHour).padStart(2, '0')}:${minutes}`;
    } else {
      // Default 3-hour duration if no valid duration
      const endHour = (eventDate.getHours() + 3) % 24;
      endTime = `${String(endHour).padStart(2, '0')}:${minutes}`;
    }
    
    // Determine package type based on price
    let packageType = "Standard";
    const price = parseFloat(reservationData.total_price);
    if (price <= 400) {
      packageType = "Basic";
    } else if (price >= 500) {
      packageType = "Premium";
    }
    
    return {
      id: reservationData.id,
      customer: {
        name: customer ? `${customer.first_name} ${customer.last_name}` : 'Onbekend',
        email: customer ? customer.email : '',
        phone: customer ? customer.phone : '',
        id: customer ? customer.id : ''
      },
      eventType: reservationData.event_type || 'Onbekend',
      date: formattedDate,
      startTime: startTime,
      endTime: endTime,
      location: reservationData.event_location,
      package: packageType,
      price: price,
      status: mapStatus(reservationData.status),
      notes: reservationData.admin_notes || '',
      paymentStatus: mapPaymentStatus(reservationData.payment_status),
      created: reservationData.created_at ? new Date(reservationData.created_at).toISOString().split('T')[0] : ''
    };
  });
  
  // Debug the statuses in your bookings
  console.log("Booking statuses:", bookings.map(b => b.status));
  
  return {
    bookings: bookings,
  };
}

// This function maps database status to frontend display status
// Make sure these match EXACTLY what the frontend is expecting
function mapStatus(dbStatus) {
  const statusMap = {
    'pending': 'pending',      // Keep "pending" as is for "In afwachting" filter
    'accepted': 'confirmed',   // Map "accepted" to "confirmed" for "Aankomend" filter
    'declined': 'declined',    // This should be properly filtered
    'cancelled': 'cancelled',  // This should match the "Geannuleerd" filter
    'completed': 'completed'   // This should match the "Voltooid" filter
  };
  
  return statusMap[dbStatus] || 'pending';
}

function mapPaymentStatus(dbPaymentStatus) {
  const paymentStatusMap = {
    'deposit_paid': 'deposit_paid',
    'final_pending': 'deposit_paid', // Map "final_pending" to "deposit_paid" for frontend
    'final_paid': 'paid'             // Map "final_paid" to "paid" for frontend
  };
  
  return paymentStatusMap[dbPaymentStatus] || 'unpaid';
}
