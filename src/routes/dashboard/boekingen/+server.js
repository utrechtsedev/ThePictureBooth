// src/routes/dashboard/boekingen/+server.js
import { json } from "@sveltejs/kit";
import { models } from "$lib/server/models/index.js";

export async function PATCH({ params, request }) {
  try {
    // Parse the request body
    const requestBody = await request.json();

    // Create a copy for modification
    const updateData = { ...requestBody };

    // Check for start_time (what both forms should now send)
    if (updateData.event_date && updateData.start_time) {

      // Handle different date formats
      let combinedDateTime;

      // Check if the date is already in JavaScript Date string format (like "Wed May 07 2025")
      if (/^\w{3}\s+\w{3}\s+\d{1,2}\s+\d{4}/.test(updateData.event_date)) {
        // Extract date components from JS Date string format
        const dateMatch = updateData.event_date.match(/^\w{3}\s+(\w{3})\s+(\d{1,2})\s+(\d{4})/);
        if (dateMatch) {
          // Convert month name to month number
          const monthMap = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
            'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
          };

          const year = dateMatch[3];
          const month = monthMap[dateMatch[1]];
          const day = String(dateMatch[2]).padStart(2, '0');

          // Create ISO-formatted date + provided time
          combinedDateTime = `${year}-${month}-${day}T${updateData.start_time}:00`;
        } else {
          // If we couldn't parse it properly, just use the original date
          // and append time without validation (database will validate)
          combinedDateTime = `${updateData.event_date}T${updateData.start_time}:00`;
        }
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(updateData.event_date)) {
        // It's already an ISO date (YYYY-MM-DD), combine with time
        combinedDateTime = `${updateData.event_date}T${updateData.start_time}:00`;
      } else {
        // For any other format, try to create a valid date string
        // This is a fallback that tries to handle various formats
        try {
          // Use string as-is, database will validate
          combinedDateTime = updateData.event_date;
        } catch (e) {
          console.error("Date parsing error:", e);
          // Just concatenate as a last resort
          combinedDateTime = `${updateData.event_date} ${updateData.start_time}`;
        }
      }

      // Assign to the event_date field
      updateData.event_date = combinedDateTime;

      // Remove the separate time field so it doesn't confuse Sequelize
      delete updateData.start_time;
    }

    // Find the reservation by id
    const reservation = await models.Reservation.findOne({
      where: { id: updateData.id }
    });

    if (!reservation) {
      return json({ message: "Boeking niet gevonden" }, { status: 404 });
    }

    // Update the reservation with the processed data
    await reservation.update(updateData);

    // Fetch the updated reservation to return complete data
    const updatedReservation = await models.Reservation.findOne({
      where: { id: updateData.id },
      include: [{ model: models.Customer }]
    });

    return json({
      message: "Boeking bijgewerkt",
      reservation: updatedReservation
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return json(
      { message: "Kon boeking niet bijwerken", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST({ request }) {
  try {
    // Parse request body
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['customer_id', 'event_date', 'event_location', 'total_price',
      'deposit_amount', 'final_payment_amount'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return json({
          success: false,
          message: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Handle different date formats for POST as well
    let eventDate;
    if (data.event_date && data.start_time) {

      // Check if the date is in JavaScript Date string format
      if (/^\w{3}\s+\w{3}\s+\d{1,2}\s+\d{4}/.test(data.event_date)) {
        // Extract date components from JS Date string format
        const dateMatch = data.event_date.match(/^\w{3}\s+(\w{3})\s+(\d{1,2})\s+(\d{4})/);
        if (dateMatch) {
          // Convert month name to month number
          const monthMap = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
            'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
          };

          const year = dateMatch[3];
          const month = monthMap[dateMatch[1]];
          const day = String(dateMatch[2]).padStart(2, '0');

          // Create ISO-formatted date + provided time
          eventDate = `${year}-${month}-${day}T${data.start_time}:00`;
        } else {
          // If we couldn't parse it properly, just use the original date and time
          eventDate = `${data.event_date}T${data.start_time}:00`;
        }
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(data.event_date)) {
        // It's already an ISO date (YYYY-MM-DD), combine with time
        eventDate = `${data.event_date}T${data.start_time}:00`;
      } else {
        // For any other format, try to create a valid date string
        try {
          // Use string as-is, database will validate
          eventDate = data.event_date;
        } catch (e) {
          console.error("Date parsing error:", e);
          // Just concatenate as a last resort
          eventDate = `${data.event_date} ${data.start_time}`;
        }
      }
    } else {
      eventDate = data.event_date;
    }

    const formattedData = {
      customer_id: data.customer_id,
      event_date: eventDate,
      event_location: data.event_location,
      total_price: parseFloat(data.total_price),
      deposit_amount: parseFloat(data.deposit_amount),
      final_payment_amount: parseFloat(data.final_payment_amount),
      payment_status: data.payment_status || 'not_paid',
      event_type: data.event_type || 'Onbekend',
      event_duration: data.event_duration || null,
      status: data.status || 'pending',
      admin_notes: data.admin_notes || null
    };


    // Create the reservation
    const reservation = await models.Reservation.create(formattedData);

    return json({
      success: true,
      message: 'Reservation created successfully',
      reservation: reservation
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      }, { status: 400 });
    }
    return json({
      success: false,
      message: 'Failed to create reservation',
      error: error.message
    }, { status: 500 });
  }
}
