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

    return { invoices, expenses }




  } catch (error) {
    return { message: "Kon financiën niet ophalen", error: error.message }
  }
};
