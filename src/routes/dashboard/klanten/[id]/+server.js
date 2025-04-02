import { models } from "$lib/server/models/index.js";
import bcrypt from "bcrypt";
import { json } from "@sveltejs/kit";

/**
 * PATCH handler voor het bijwerken van een klant
 */
export async function PATCH({ request, params }) {
  try {
    const id = params.id;

    // Controleer of de klant bestaat
    const customer = await models.Customer.findByPk(id);
    if (!customer) {
      return json({
        success: false,
        message: 'Klant niet gevonden'
      }, { status: 404 });
    }

    // Parse de request body
    const data = await request.json();
    const { first_name, last_name, email, phone, company_name, password, type } = data;

    // Valideer verplichte velden
    if (!first_name || !last_name || !email || !phone) {
      return json({
        success: false,
        message: 'Alle verplichte velden moeten ingevuld zijn'
      }, { status: 400 });
    }

    // Als type 'business' is, moet company_name aanwezig zijn
    if (type === 'business' && !company_name) {
      return json({
        success: false,
        message: 'Bedrijfsnaam is verplicht voor bedrijfsklanten'
      }, { status: 400 });
    }

    // Controleer of email al bestaat bij een andere klant
    const existingEmail = await models.Customer.findOne({
      where: { email },
      attributes: ['id']
    });

    if (existingEmail && existingEmail.id !== id) {
      return json({
        success: false,
        message: 'Er bestaat al een andere klant met dit e-mailadres'
      }, { status: 400 });
    }

    // Update data voorbereiden
    const updateData = {
      first_name,
      last_name,
      email,
      phone,
      company_name: company_name || ''
    };

    // Als wachtwoord aanwezig is, hash en update
    if (password && password.trim() !== '') {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Update de klant
    await customer.update(updateData);

    // Haal de bijgewerkte klant op zonder wachtwoord
    await customer.reload();
    const updatedCustomer = customer.toJSON();
    delete updatedCustomer.password;

    return json({
      success: true,
      message: 'Klant succesvol bijgewerkt',
      customer: updatedCustomer
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    return json({
      success: false,
      message: 'Er is een fout opgetreden bij het bijwerken van de klant',
      error: error.message
    }, { status: 500 });
  }
}
