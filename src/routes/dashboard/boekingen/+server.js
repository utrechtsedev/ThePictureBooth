// src/routes/dashboard/boekingen/+server.js
import { json } from "@sveltejs/kit";
import { models } from "$lib/server/models/index.js";

export async function PATCH({ params, request }) {
  try {
    // Parse the request body
    const requestBody = await request.json();
    console.log("Received PATCH data:", requestBody);

    // Create a copy for modification
    const updateData = { ...requestBody };

    // Check for start_time (what both forms should now send)
    if (updateData.event_date && updateData.start_time) {
      console.log("Original date:", updateData.event_date, "Original time:", updateData.start_time);

      // FIXED: SUBTRACT 2 hours for UTC+2 instead of adding
      // This converts local time to UTC time (e.g., 15:00 local → 13:00 UTC)
      const [hours, minutes] = updateData.start_time.split(':').map(Number);
      let adjustedHours = hours - 2; // Subtract 2 hours for UTC+2
      // Handle negative hours
      if (adjustedHours < 0) adjustedHours += 24;

      const adjustedTime = `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      console.log("Time adjusted for timezone:", adjustedTime);

      // Combine date and adjusted time
      const combinedDateTime = `${updateData.event_date}T${adjustedTime}:00`;
      console.log("Combined date time with timezone adjustment:", combinedDateTime);

      // Assign to the event_date field
      updateData.event_date = combinedDateTime;

      // Remove the separate time field so it doesn't confuse Sequelize
      delete updateData.start_time;
    }

    // Find the reservation by public_id
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
    console.log("Received POST data:", data);

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

    // Create a date object with the time if available, adjusting for timezone
    let eventDate;
    if (data.event_date && data.start_time) {
      console.log("Combining date:", data.event_date, "with time:", data.start_time);

      // FIXED: SUBTRACT 2 hours for UTC+2 instead of adding
      // This converts local time to UTC time (e.g., 15:00 local → 13:00 UTC)
      const [hours, minutes] = data.start_time.split(':').map(Number);
      let adjustedHours = hours - 2; // Subtract 2 hours for UTC+2
      // Handle negative hours
      if (adjustedHours < 0) adjustedHours += 24;

      const adjustedTime = `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      console.log("Time adjusted for timezone:", adjustedTime);

      // Combine date and adjusted time
      const combinedDateTime = `${data.event_date}T${adjustedTime}:00`;
      console.log("Combined date time with timezone adjustment:", combinedDateTime);

      eventDate = combinedDateTime;
    } else {
      eventDate = data.event_date;
    }

    const formattedData = {
      customer_id: data.customer_id,
      event_date: eventDate, // Now includes the timezone-adjusted time
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

    console.log("Saving reservation with date:", formattedData.event_date);

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
