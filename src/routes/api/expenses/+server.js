// src/routes/api/expenses/+server.js
import { models } from "$lib/server/models/index.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  try {
    const data = await request.json();
    // Create the expense
    const expense = await models.Expense.create({
      description: data.description,
      category: data.category,
      amount: data.amount,
      date: data.date,
      supplier: data.supplier,
      payment_method: data.payment_method,
      deductible: data.deductible,
      url: data.url || null
    });
    return json({
      success: true,
      message: "Uitgave aangemaakt",
      expense: expense.toJSON()
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return json({
      success: false,
      message: "Kon uitgave niet aanmaken",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const expenses = await models.Expense.findAll();
    return json({
      expenses: expenses.map(expense => expense.toJSON())
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return json({
      success: false,
      message: "Kon uitgaven niet ophalen",
      error: error.message
    }, { status: 500 });
  }
}
