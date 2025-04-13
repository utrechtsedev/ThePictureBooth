// routes/dashboard/boekingen/+page.server.js
import { models } from "$lib/server/models/index.js";

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

    // Store original datetime as string for debugging
    const original_datetime = reservation_data.event_date ? reservation_data.event_date.toString() : '';

    // Extract time from the original datetime
    let start_time = '';
    if (original_datetime) {
      // Extract time part from something like "2025-04-16T13:00:00.000Z" or "Wed Apr 16 2025 13:00:00 GMT+0000"
      const timeMatch = original_datetime.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        start_time = `${String(timeMatch[1]).padStart(2, '0')}:${timeMatch[2]}`;
      }
    }

    // Calculate end time based on duration and start time
    let end_time = '';
    if (start_time && reservation_data.event_duration) {
      // Extract duration hours (e.g., "3u" → 3)
      const durationMatch = reservation_data.event_duration.match(/(\d+)u/);
      if (durationMatch && durationMatch[1]) {
        const durationHours = parseInt(durationMatch[1], 10);
        const [startHour, startMinute] = start_time.split(':').map(Number);

        // Calculate end time
        const endHour = (startHour + durationHours) % 24;
        end_time = `${String(endHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
      }
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
      event_date: original_datetime, // Keep the original datetime string
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
      updated_at: reservation_data.updated_at,
      // Add the original datetime string for debugging
      original_datetime: original_datetime
    };
  });

  return {
    bookings: bookings,
  };
}
