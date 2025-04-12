import { json } from "@sveltejs/kit";
import { models } from "$lib/server/models/index.js";

export async function PATCH({ params, request }) {
  try {
    // Parse the request body
    const requestBody = await request.json();
    console.log(requestBody)
    // Find the reservation by public_id
    const reservation = await models.Reservation.findOne({
      where: { id: requestBody.id }
    });

    if (!reservation) {
      return json({ message: "Boeking niet gevonden" }, { status: 404 });
    }

    // Update the reservation with the request body
    await reservation.update(requestBody);

    // Fetch the updated reservation to return complete data
    const updatedReservation = await models.Reservation.findOne({
      where: { id: requestBody.id },
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

    const formattedData = {
      customer_id: data.customer_id,
      event_date: new Date(data.event_date),
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
