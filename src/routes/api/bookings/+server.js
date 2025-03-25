import { json } from "@sveltejs/kit";
import { models } from "$lib/server/models/index.js";

export async function PATCH({ params, request }) {
  try {
    const { id } = params;
    console.log("Updating reservation with ID:", id);
    
    // Parse the request body
    const requestBody = await request.json();
    
    // Find the reservation by public_id
    const reservation = await models.Reservation.findOne({ 
      where: { id: id }
    });
    
    if (!reservation) {
      return json({ message: "Boeking niet gevonden" }, { status: 404 });
    }
    
    // Update the reservation with the request body
    await reservation.update(requestBody);
    
    // Fetch the updated reservation to return complete data
    const updatedReservation = await models.Reservation.findOne({
      where: { public_id: id },
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
