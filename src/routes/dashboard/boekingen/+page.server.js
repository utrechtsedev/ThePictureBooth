// routes/dashboard/boekingen/+page.server.js
import { models } from "$lib/server/models/index.js";

export async function load() {
  const reservations = await models.Reservation.findAll({
    include: [{
      model: models.Customer,
    }]
  });

  const bookings = reservations.map(reservation => {
    const reservation_data = reservation.get({ plain: true });
    const customer = reservation_data.Customer;
    const customer_obj = {
      name: customer ? `${customer.first_name} ${customer.last_name}` : 'Onbekend',
      email: customer ? customer.email : '',
      phone: customer ? customer.phone : '',
      id: customer ? customer.id : ''
    };
    return {
      id: reservation_data.id,
      customer: customer_obj,
      customer_id: reservation_data.customer_id,
      event_date: reservation_data.event_date,
      event_type: reservation_data.event_type || 'Onbekend',
      event_location: reservation_data.event_location,
      event_duration: reservation_data.event_duration,
      total_price: reservation_data.total_price,
      deposit_amount: parseFloat(reservation_data.deposit_amount),
      final_payment_amount: parseFloat(reservation_data.final_payment_amount),
      payment_status: reservation_data.payment_status,
      status: reservation_data.status,
      admin_notes: reservation_data.admin_notes || '',
      created_at: reservation_data.created_at,
      updated_at: reservation_data.updated_at
    };
  });

  return {
    bookings: bookings,
  };
}