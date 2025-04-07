// src/routes/+server.js
import { json } from '@sveltejs/kit';
import { models } from '$lib/server/models/index.js';
import { sequelize } from '$lib/server/models/database.js'; // Direct import of sequelize
import { generateInvoiceFromReservation } from '$lib/server/utils/invoiceGenerator.js';
import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } from '$env/static/private';
import bcrypt from 'bcrypt';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === '465',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * POST handler for booking form submissions
 */
export async function POST({ request }) {
  let transaction;

  try {
    const data = await request.json();

    // Step 1: Validate input
    const validationErrors = validateBookingData(data);
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return json({ error: true, message: validationErrors.join(', ') }, { status: 400 });
    }

    // Start transaction for data consistency
    transaction = await sequelize.transaction();

    try {
      // Step 2: Create Customer
      const customerData = buildCustomerData(data);
      const customer = await models.Customer.create(customerData, { transaction });

      // Step 3: Create Reservation
      const reservationData = buildReservationData(data, customer.id);
      const reservation = await models.Reservation.create(reservationData, { transaction });

      // Step 7: Create notification
      await models.Notification.create({
        title: 'Nieuwe Boeking',
        message: `Nieuwe boeking van ${customer.first_name} ${customer.last_name} voor ${reservation.event_type} op ${new Date(reservation.event_date).toLocaleDateString('nl-NL')}`,
        type: 'info',
        read: false
      }, { transaction });

      // Step 8: Create activity entries
      // Customer activity
      await models.Activity.create({
        type: 'customer',
        title: 'Nieuwe Klant',
        description: `${customer.first_name} ${customer.last_name} heeft zich geregistreerd`,
        icon: 'person'
      }, { transaction });

      // Booking activity
      await models.Activity.create({
        type: 'booking',
        title: 'Nieuwe Boeking',
        description: `Boeking voor ${reservation.event_type} op ${new Date(reservation.event_date).toLocaleDateString('nl-NL')}`,
        icon: 'calendar'
      }, { transaction });

      // Commit transaction first to prevent lock timeout
      await transaction.commit();
      transaction = null; // Mark as committed

      // Step 9 & 10: Generate invoice and create invoice entry
      // This is moved outside the transaction to prevent lock issues
      try {
        const reservationWithCustomer = await models.Reservation.findByPk(
          reservation.id,
          {
            include: [{ model: models.Customer }]
          }
        );

        await generateInvoiceFromReservation(reservationWithCustomer);
      } catch (invoiceError) {
        console.error('Failed to generate invoice:', invoiceError);
        // Continue processing - invoice generation failure shouldn't stop the booking
      }

      // Step 6: Send email notifications
      try {
        await sendEmailNotifications(customer, reservation);
      } catch (emailError) {
        console.error('Failed to send email notifications:', emailError);
        // Continue processing - email failure shouldn't stop the booking
      }

      // Step 4: Return payment URL for redirection
      // We return just the string as that's what the original form expects
      return json(`/api/payments/process?reservationId=${reservation.id}&amount=${reservation.deposit_amount}`);

    } catch (error) {
      // Rollback transaction on error
      if (transaction) await transaction.rollback();
      console.error('Booking process failed:', error);
      return json({ error: true, message: error.message }, { status: 500 });
    }
  } catch (error) {
    // Make sure to rollback transaction if it exists but there was an error
    if (transaction) await transaction.rollback();

    console.error('Request processing failed:', error);

    // Special handling for lock timeout errors
    if (error.message && error.message.includes('Lock wait timeout exceeded')) {
      return json({
        error: true,
        message: 'De server is momenteel erg druk. Probeer het over enkele ogenblikken opnieuw.'
      }, { status: 503 });
    }

    return json({ error: true, message: 'Server error' }, { status: 500 });
  }
}

/**
 * Validates the booking form data
 * @param {Object} data - Form data from request
 * @returns {Array} - Array of validation error messages
 */
function validateBookingData(data) {
  const errors = [];

  if (!data) {
    errors.push('Geen gegevens ontvangen');
    return errors;
  }

  // Required fields based on booking form with updated field names
  const requiredFields = [
    { field: 'naam', message: 'Naam is verplicht' },
    { field: 'email', message: 'Email is verplicht' },
    { field: 'phone', message: 'Telefoonnummer is verplicht' }, // Changed from telefoonnummer
    { field: 'event_location', message: 'Locatie is verplicht' }, // Changed from address
    { field: 'selectedTime', message: 'Tijd is verplicht' },
    { field: 'event_type', message: 'Type evenement is verplicht' }, // Changed from eventType
    { field: 'selectedDuration', message: 'Duur is verplicht' },
    { field: 'formattedStartDate', message: 'Datum is verplicht' }
  ];

  for (const { field, message } of requiredFields) {
    if (!data[field]) {
      errors.push(message);
    }
  }

  // Check terms acceptance
  if (!data.terms) {
    errors.push('U moet akkoord gaan met de voorwaarden');
  }

  // Email validation
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Ongeldig e-mailadres');
  }

  // Date validation
  if (data.formattedStartDate) {
    const [day, month, year] = data.formattedStartDate.split('-');
    const eventDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(eventDate.getTime())) {
      errors.push('Ongeldige datumnotatie');
    } else if (eventDate < today) {
      errors.push('De datum kan niet in het verleden liggen');
    }
  }

  // Check if durationPrices exists and has the selected duration
  if (!data.durationPrices || !data.durationPrices[data.selectedDuration]) {
    errors.push('Ongeldige duur geselecteerd');
  }

  return errors;
}

/**
 * Builds customer data object from form data
 * @param {Object} data - Form data
 * @returns {Object} - Customer data object
 */
function buildCustomerData(data) {
  // Generate a secure random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Extract first and last name from the full name field
  const nameParts = data.naam.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const password = generatePassword();
  const hashedPassword = bcrypt.hashSync(password, 10);

  return {
    first_name: firstName,
    last_name: lastName || '-', // Ensure last name isn't empty
    email: data.email,
    phone: data.phone, // Changed from telefoonnummer
    company_name: null, // Not in form
    password: hashedPassword
  };
}

/**
 * Builds reservation data object from form data
 * @param {Object} data - Form data
 * @param {String} customerId - Customer ID
 * @returns {Object} - Reservation data object
 */
function buildReservationData(data, customerId) {
  // Parse date and time
  const [day, month, year] = data.formattedStartDate.split('-');
  const [hours, minutes] = data.selectedTime.split(':');
  const eventDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

  // Get price info from durationPrices object
  const totalPrice = parseFloat(data.durationPrices[data.selectedDuration].price);
  const depositAmount = parseFloat(data.deposit_amount || 100);
  const finalPaymentAmount = totalPrice - depositAmount;

  return {
    customer_id: customerId,
    photobooth_id: "1", // Default value as in original code
    event_date: eventDate,
    event_location: data.event_location, // Changed from address
    total_price: totalPrice,
    deposit_amount: depositAmount, // Changed from deposit
    final_payment_amount: finalPaymentAmount,
    payment_status: "final_pending",
    event_type: data.event_type, // Changed from eventType
    event_duration: data.event_duration, // Changed from selectedDuration
    status: "pending",
    admin_notes: data.admin_notes || "" // Changed from notes
  };
}

/**
 * Sends email notifications to customer and admin
 * @param {Object} customer - Customer object
 * @param {Object} reservation - Reservation object
 * @returns {Promise} - Promise resolving when emails are sent
 */
async function sendEmailNotifications(customer, reservation) {
  // Check if SMTP settings are available
  if (!SMTP_USER || !SMTP_HOST) {
    console.warn('SMTP settings not configured, skipping email notifications');
    return;
  }

  const paymentUrl = `/payment/process?reservationId=${reservation.id}`;

  // Customer email
  const customerEmail = {
    from: SMTP_USER,
    to: customer.email,
    subject: 'Je boeking bevestiging - The Picture Booth',
    html: `
      <h1>Bedankt voor je boeking!</h1>
      <p>Beste ${customer.first_name},</p>
      <p>We hebben je boeking ontvangen voor ${reservation.event_type} op ${new Date(reservation.event_date).toLocaleDateString('nl-NL')}.</p>
      <p>Om je boeking te bevestigen, kun je de aanbetaling voltooien via de onderstaande link:</p>
      <p><a href="${paymentUrl}">Voltooi je betaling</a></p>
      <p>Als je vragen hebt, neem gerust contact met ons op.</p>
      <p>Met vriendelijke groet,<br>Het team van The Picture Booth</p>
    `
  };

  // Admin email
  const adminEmail = {
    from: SMTP_USER,
    to: ADMIN_EMAIL || SMTP_USER, // Fallback to sender if admin email not defined
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
  } catch (error) {
    console.error('Error sending emails:', error);
    // Don't throw the error - we want to continue processing even if emails fail
  }
}
