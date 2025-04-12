// src/routes/api/exchange/+server.js
import { models } from '$lib/server/models/index.js';
import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Sends email notifications to customer and admin after successful payment
 * @param {Object} customer - Customer object
 * @param {Object} reservation - Reservation object
 * @returns {Promise} - Promise resolving when emails are sent
 */
async function sendEmailNotifications(customer, reservation) {

  const customerEmail = {
    from: process.env.SMTP_USER,
    to: customer.email,
    subject: 'Je boeking bevestiging - The Picture Booth',
    html: `
      <h1>Bedankt voor je boeking!</h1>
      <p>Beste ${customer.first_name},</p>
      <p>We hebben je boeking ontvangen voor ${reservation.event_type} op ${new Date(reservation.event_date).toLocaleDateString('nl-NL')}.</p>
      <p>Details van je boeking:</p>
      <ul>
        <li>Datum: ${new Date(reservation.event_date).toLocaleDateString('nl-NL')}</li>
        <li>Tijd: ${new Date(reservation.event_date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</li>
        <li>Locatie: ${reservation.event_location}</li>
        <li>Duur: ${reservation.event_duration} uur</li>
        <li>Totaalbedrag: €${parseFloat(reservation.total_price).toFixed(2)}</li>
      </ul>
      <p>Je aanbetaling van €${parseFloat(reservation.deposit_amount).toFixed(2)} is ontvangen.</p>
      <p>We zullen je boeking zo snel mogelijk bevestigen. Als je vragen hebt, neem gerust contact met ons op.</p>
      <p>Met vriendelijke groet,<br>Het team van The Picture Booth</p>
    `
  };

  // Admin email
  const adminEmail = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER, // Fallback to sender if admin email not defined
    subject: 'Nieuwe boeking - The Picture Booth',
    html: `
      <h1>Nieuwe Boeking Ontvangen</h1>
      <p>Er is een nieuwe boeking gemaakt:</p>
      <ul>
        <li>Klant: ${customer.first_name} ${customer.last_name}</li>
        <li>Email: ${customer.email}</li>
        <li>Telefoon: ${customer.phone}</li>
        <li>Evenement: ${reservation.event_type}</li>
        <li>Datum: ${new Date(reservation.event_date).toLocaleDateString('nl-NL')}</li>
        <li>Locatie: ${reservation.event_location}</li>
        <li>Aanbetaald bedrag: €${parseFloat(reservation.deposit_amount).toFixed(2)}</li>
        <li>Totaalbedrag: €${parseFloat(reservation.total_price).toFixed(2)}</li>
      </ul>
      <p>Bekijk het admin dashboard voor meer details.</p>
    `
  };

  // Send emails
  try {
    await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(adminEmail)
    ]);
    console.log('Booking confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending booking confirmation emails:', error);
    // Don't throw the error - we want to continue processing even if emails fail
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    let reservation_id = data.extra1;
    if (!reservation_id) {
      console.error('No reservation ID provided in payment data');
      return json({ status: "not ok" }, { status: 200 });
    }
    const reservation = await models.Reservation.findOne({
      where: { id: reservation_id },
      include: [{ model: models.Customer }]
    });
    if (!reservation) {
      console.error(`Reservation with ID ${reservation_id} not found`);
      return json({ status: "not ok" }, { status: 200 });
    }
    if (reservation.payment_status === "final_pending" || reservation.payment_status === "final_paid") {
      console.log(`Payment for reservation ${reservation_id} already processed (status: ${reservation.payment_status}). Skipping duplicate processing.`);
      return json({
        status: "ok",
        message: "Betaling is al verwerkt. Geen dubbele verwerking uitgevoerd."
      }, { status: 200 });
    }

    const customer = await models.Customer.findOne({ where: { id: reservation.customer_id } });

    if (!customer) {
      console.error(`Customer for reservation ${reservation_id} not found`);
      return json({ status: "not ok" }, { status: 200 });
    }

    // Update reservation payment status only
    await reservation.update({
      payment_status: "final_pending"
    });

    // Create payment record
    await models.Payment.create({
      customer_id: customer.id,
      reservation_id: reservation.id,
      payment_type: "deposit",
      amount: reservation.deposit_amount,
      method: "online",
      payment_date: new Date(),
      status: "paid"
    });

    // Create notification for admin dashboard
    await models.Notification.create({
      title: 'Nieuwe Boeking',
      message: `Nieuwe boeking van ${customer.first_name} ${customer.last_name} voor ${reservation.event_type} op ${new Date(reservation.event_date).toLocaleDateString('nl-NL')} is betaald`,
      type: 'info',
      read: false
    });

    // Create activity entry
    await models.Activity.create({
      type: 'payment',
      title: 'Nieuwe Boeking',
      description: `Aanbetaling voor boeking voor ${reservation.event_type} op ${new Date(reservation.event_date).toLocaleDateString('nl-NL')}`,
      icon: 'payment'
    });

    // Optionally send email notifications after successful payment processing
    try {
      await sendEmailNotifications(customer, reservation);
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // Continue - email errors shouldn't stop the process
    }

    return json({
      status: "ok",
      message: "Betaling succesvol verwerkt."
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing payment exchange:', error);
    return json({ status: "not ok", error: error.message }, { status: 200 });
  }
}
