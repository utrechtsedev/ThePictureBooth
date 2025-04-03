// src/routes/dashboard/klanten/api/+server.js
import { models } from "$lib/server/models/index.js";
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const customersData = await models.Customer.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: models.Reservation }
      ]
    });

    // Convert Sequelize models to plain JavaScript objects
    const customers = customersData.map(customer => {
      const plainCustomer = customer.toJSON();
      if (plainCustomer.Reservations) {
        plainCustomer.reservations = plainCustomer.Reservations.map(reservation => reservation);
        delete plainCustomer.Reservations;
      } else {
        plainCustomer.reservations = [];
      }
      return plainCustomer;
    });

    return json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    }, { status: 500 });
  }
}
