// src/routes/dashboard/klanten/+page.server.js

import { models } from "$lib/server/models/index.js";
import bcrypt from "bcrypt";
import { fail } from "@sveltejs/kit";

export async function load({ fetch }) {
  try {
    const customersData = await models.Customer.findAll({
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: models.Reservation
        }
      ]
    });

    // Converteer Sequelize modellen naar plain JavaScript objects
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

    return { customers };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    };
  }
};

export const actions = {
  default: async ({ request }) => {
    try {
      // Parse form data
      const formData = await request.formData();

      // Extract values
      const first_name = formData.get('first_name');
      const last_name = formData.get('last_name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const company_name = formData.get('company_name') || '';
      const password = formData.get('password');

      // Validate required fields
      if (!first_name || !last_name || !email || !phone || !password) {
        return fail(400, {
          success: false,
          message: 'Alle verplichte velden moeten ingevuld zijn',
          data: { first_name, last_name, email, phone, company_name }
        });
      }

      // Check if email already exists
      const existingCustomer = await models.Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return fail(400, {
          success: false,
          message: 'Er bestaat al een klant met dit e-mailadres',
          data: { first_name, last_name, email, phone, company_name }
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new customer
      const newCustomer = await models.Customer.create({
        first_name,
        last_name,
        email,
        phone,
        company_name,
        password: hashedPassword
      });

      // Return success without password
      const customerData = newCustomer.toJSON();
      delete customerData.password;

      return {
        success: true,
        message: 'Klant succesvol aangemaakt',
        customer: customerData
      };

    } catch (error) {
      console.error('Error creating customer:', error);
      return fail(500, {
        success: false,
        message: 'Er is een fout opgetreden bij het aanmaken van de klant',
        error: error.message
      });
    }
  }
};
