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
    const reservation_data = reservation.get({ plain: true });
    const customer = reservation_data.Customer;

    // Get event date as a proper Date object
    const event_date = new Date(reservation_data.event_date);

    // Format date as YYYY-MM-DD for date property (needed for calendar view)
    // Use UTC methods to avoid timezone conversion
    const year = event_date.getUTCFullYear();
    const month = String(event_date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(event_date.getUTCDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    // Format times using UTC methods to preserve the original database time
    const hours = String(event_date.getUTCHours()).padStart(2, '0');
    const minutes = String(event_date.getUTCMinutes()).padStart(2, '0');
    const start_time = `${hours}:${minutes}`;

    // Calculate end time based on duration (also using UTC methods)
    let end_time;
    let duration_hours = 0;

    if (reservation_data.event_duration) {
      // Try to parse duration like "3u" or "3u 30m"
      const durationMatch = reservation_data.event_duration.match(/(\d+)u(?:\s+(\d+)m)?/);
      if (durationMatch) {
        duration_hours = parseInt(durationMatch[1]) || 0;
        const duration_minutes = parseInt(durationMatch[2] || 0);

        // Create end time
        const end_date = new Date(event_date);
        end_date.setUTCHours(end_date.getUTCHours() + duration_hours);
        end_date.setUTCMinutes(end_date.getUTCMinutes() + duration_minutes);

        const end_hours = String(end_date.getUTCHours()).padStart(2, '0');
        const end_minutes = String(end_date.getUTCMinutes()).padStart(2, '0');
        end_time = `${end_hours}:${end_minutes}`;
      } else {
        // Fallback: try to parse just a number
        duration_hours = parseInt(reservation_data.event_duration) || 3;
        const end_hour = (event_date.getUTCHours() + duration_hours) % 24;
        end_time = `${String(end_hour).padStart(2, '0')}:${minutes}`;
      }
    } else {
      // Default 3-hour duration if no valid duration
      duration_hours = 3;
      const end_hour = (event_date.getUTCHours() + 3) % 24;
      end_time = `${String(end_hour).padStart(2, '0')}:${minutes}`;
    }

    // Determine package type based on price
    let package_type = "Standard";
    const total_price = parseFloat(reservation_data.total_price);
    if (total_price <= 400) {
      package_type = "Basic";
    } else if (total_price >= 500) {
      package_type = "Premium";
    }

    // Build customer object with consistent naming
    const customer_obj = {
      name: customer ? `${customer.first_name} ${customer.last_name}` : 'Onbekend',
      email: customer ? customer.email : '',
      phone: customer ? customer.phone : '',
      id: customer ? customer.id : ''
    };

    // Return the booking with snake_case keys exactly matching the database
    return {
      id: reservation_data.id,
      customer: customer_obj,
      customer_id: reservation_data.customer_id,
      event_date: date,
      event_type: reservation_data.event_type || 'Onbekend',
      event_location: reservation_data.event_location,
      event_duration: reservation_data.event_duration,
      start_time: start_time,
      end_time: end_time,
      total_price: total_price,
      deposit_amount: parseFloat(reservation_data.deposit_amount),
      final_payment_amount: parseFloat(reservation_data.final_payment_amount),
      payment_status: reservation_data.payment_status,
      status: reservation_data.status, // Keep original status from DB
      admin_notes: reservation_data.admin_notes || '',
      package: package_type, // This is a derived field, not in DB
      created_at: reservation_data.created_at,
      updated_at: reservation_data.updated_at
    };
  });

  return {
    bookings: bookings,
  };
}
