//src/routes/(index)/+server.js
import { json } from '@sveltejs/kit';
import { models } from '$lib/server/models/index.js';
import { sequelize } from '$lib/server/database/database.js'; // Direct import of sequelize
import dotenv from 'dotenv'; dotenv.config();
import bcrypt from 'bcrypt';
import Paynl from 'paynl-sdk';

Paynl.Config.setApiToken(process.env.PAYNL_API_TOKEN);
Paynl.Config.setServiceId(process.env.PAYNL_SERVICE_ID);

/**
 * Helper function to get client IP reliably across different SvelteKit versions
 * @param {Request} request - Request object
 * @returns {string} - IP address or fallback
 */
function getClientIP(request) {
  return request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-client-ip') ||
    request.socket?.remoteAddress ||
    '127.0.0.1';
}

/**
 * POST handler for booking form submissions
 */
export async function POST({ request }) {
  let transaction;
  const clientIP = getClientIP(request);

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
      // Step 2: Check if customer already exists by email
      let customer = await models.Customer.findOne({
        where: { email: data.email }
      }, { transaction });

      let customerCreated = false;

      // If customer doesn't exist, create a new one
      if (!customer) {
        const customerData = buildCustomerData(data);
        customer = await models.Customer.create(customerData, { transaction });
        customerCreated = true;
      } else {
      }

      // Step 3: Create Reservation with the customer ID
      const reservationData = buildReservationData(data, customer.id);
      const reservation = await models.Reservation.create(reservationData, { transaction });

      // Step 5: Create activity entries
      // Only create customer activity if a new customer was created
      if (customerCreated) {
        await models.Activity.create({
          type: 'customer',
          title: 'Nieuwe Klant',
          description: `${customer.first_name} ${customer.last_name} heeft zich geregistreerd`,
          icon: 'person'
        }, { transaction });
      }

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

      // Step 6: Generate invoice and create invoice entry
      // This is moved outside the transaction to prevent lock issues
      try {
        const reservationWithCustomer = await models.Reservation.findByPk(
          reservation.id,
          {
            include: [{ model: models.Customer }]
          }
        );

      } catch (invoiceError) {
        console.error('Failed to generate invoice:', invoiceError);
        // Continue processing - invoice generation failure shouldn't stop the booking
      }

      // NOTE: Email notifications are removed from here
      // They will be sent by the exchange API after payment confirmation

      // Step 7: Return payment URL for redirection
      // Use a Promise to properly handle the asynchronous PayNL API
      return new Promise((resolve, reject) => {

        Paynl.Transaction.start({
          // Use the actual deposit amount from the reservation in cents
          amount: reservation.deposit_amount,
          enduser: {
            // Use the properly parsed customer data
            initials: customer.first_name.charAt(0),
            lastName: customer.last_name,
            emailAddress: customer.email,
            phoneNumber: customer.phone,
          },
          extra1: reservation.id,
          exchangeUrl: 'https://thepicturebooth.nl/api/exchange',
          currency: 'EUR',
          invoiceDate: new Date(),
          deliveryDate: new Date(),
          language: "NL",
          returnUrl: "https://thepicturebooth.nl",
          ipAddress: clientIP,
        }).subscribe(
          function(result) {
            // Resolve the promise with the payment URL
            resolve(new Response(result.paymentURL, {
              headers: {
                'Content-Type': 'text/plain'
              }
            }));
          },
          function(error) {
            console.error('PayNL transaction error:', error);
            reject(json({ error: true, message: 'Payment processing failed' }, { status: 500 }));
          }
        );
      });

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
    payment_status: "not_paid",
    event_type: data.event_type, // Changed from eventType
    event_duration: data.selectedDuration, // Fixed: was event_duration, should match the form field
    status: "pending",
    admin_notes: data.admin_notes || "" // Changed from notes
  };
}
