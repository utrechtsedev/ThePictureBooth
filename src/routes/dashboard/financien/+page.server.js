// src/routes/dashboard/financien/+page.server.js
import { models } from "$lib/server/models/index.js";
export async function load({ fetch }) {
  try {
    const invoices = await models.Invoice.findAll(
      {
        include: [
          {
            model: models.Customer,
          },
          {
            model: models.Reservation,
          }
        ]
      }
    );
    const expenses = await models.Expense.findAll();

    // Convert Sequelize models to plain objects for serialization
    return {
      invoices: invoices.map(invoice => invoice.toJSON()),
      expenses: expenses.map(expense => expense.toJSON())
    }
  } catch (error) {
    return { message: "Kon financiën niet ophalen", error: error.message }
  }
};
