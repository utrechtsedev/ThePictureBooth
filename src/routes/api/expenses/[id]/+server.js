import { models } from "$lib/server/models/index.js";
import { json } from "@sveltejs/kit";

export async function PATCH({ params, request }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Find the expense
    const expense = await models.Expense.findByPk(id);

    if (!expense) {
      return json({
        success: false,
        message: "Uitgave niet gevonden"
      }, { status: 404 });
    }

    // Update the expense
    await expense.update({
      description: data.description,
      category: data.category,
      amount: data.amount,
      date: data.date,
      supplier: data.supplier,
      payment_method: data.payment_method,
      deductible: data.deductible,
      url: data.url
    });

    return json({
      success: true,
      message: "Uitgave bijgewerkt",
      expense: expense.toJSON()
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return json({
      success: false,
      message: "Kon uitgave niet bijwerken",
      error: error.message
    }, { status: 500 });
  }
}
