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

    // Extract date and time parts directly from the ISO string WITHOUT Date objects
    let date = "";
    let start_time = "";
    let end_time = "";

    if (reservation_data.event_date) {
      // Convert the date to a string to ensure consistent handling
      const dateTimeStr = reservation_data.event_date.toString();

      // Extract the date part (YYYY-MM-DD)
      const dateParts = dateTimeStr.split('T');
      if (dateParts[0]) {
        date = dateParts[0];
      }

      // Extract the time part (HH:MM)
      if (dateParts[1]) {
        const timeMatch = dateParts[1].match(/(\d{2}):(\d{2})/);
        if (timeMatch) {
          start_time = `${timeMatch[1]}:${timeMatch[2]}`;
        }
      }

      // Calculate end time based on duration without Date objects
      if (start_time && reservation_data.event_duration) {
        // Try to parse duration like "3u" or "3u 30m"
        const durationMatch = reservation_data.event_duration.match(/(\d+)u(?:\s+(\d+)m)?/);
        if (durationMatch) {
          const [startHours, startMinutes] = start_time.split(':').map(Number);
          const durationHours = parseInt(durationMatch[1]) || 0;
          const durationMinutes = parseInt(durationMatch[2] || 0);

          // Calculate end time
          let endHours = startHours + durationHours;
          let endMinutes = startMinutes + durationMinutes;

          // Handle minute overflow
          if (endMinutes >= 60) {
            endHours += Math.floor(endMinutes / 60);
            endMinutes = endMinutes % 60;
          }

          // Handle 24-hour format
          endHours = endHours % 24;

          // Format end time
          end_time = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
        } else {
          // Fallback: try to parse just a number
          const duration = parseInt(reservation_data.event_duration) || 3;
          const [startHours, startMinutes] = start_time.split(':').map(Number);
          const endHours = (startHours + duration) % 24;
          end_time = `${String(endHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
        }
      } else {
        // Default 3-hour duration if no valid duration
        if (start_time) {
          const [startHours, startMinutes] = start_time.split(':').map(Number);
          const endHours = (startHours + 3) % 24;
          end_time = `${String(endHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
        }
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
      event_date: date, // Just the date part
      event_type: reservation_data.event_type || 'Onbekend',
      event_location: reservation_data.event_location,
      event_duration: reservation_data.event_duration,
      start_time: start_time, // Just the time part
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
      original_datetime: reservation_data.event_date?.toString()
    };
  });

  return {
    bookings: bookings,
  };
}
