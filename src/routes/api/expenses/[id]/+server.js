// src/routes/api/expenses/[id]/+server.js
import { models } from "$lib/server/models/index.js";
import { json } from "@sveltejs/kit";
import { deleteFile } from '$lib/server/utils/s3Client';

export async function PATCH({ params, request }) {
  try {
    const { id } = params;
    const data = await request.json();

    console.log("PATCH request received for ID:", id);
    console.log("Received data:", JSON.stringify(data));

    // Find the expense
    const expense = await models.Expense.findByPk(id);

    if (!expense) {
      console.error("Expense not found:", id);
      return json({
        success: false,
        message: "Uitgave niet gevonden"
      }, { status: 404 });
    }

    console.log("Current expense:", JSON.stringify(expense.toJSON()));

    // Prepare data for update (with type safety)
    const updateData = {
      description: String(data.description || ''),
      category: String(data.category || ''),
      amount: typeof data.amount === 'number' ? data.amount : parseFloat(data.amount || 0),
      date: data.date || new Date().toISOString().slice(0, 10),
      supplier: String(data.supplier || ''),
      payment_method: String(data.payment_method || ''),
      deductible: Boolean(data.deductible)
    };

    // Handle URL separately (it can be null)
    if (data.url !== undefined) {
      updateData.url = data.url === null || data.url === '' ? null : String(data.url);
    }

    // Handle notes separately (it can be null)
    if (data.notes !== undefined) {
      updateData.notes = data.notes === null || data.notes === '' ? null : String(data.notes);
    }

    console.log("Formatted update data:", JSON.stringify(updateData));

    // Check if URL has changed and delete old file if needed
    if (data.url !== expense.url && expense.url) {
      try {
        console.log("URL changed, deleting old file:", expense.url);
        await deleteFile(expense.url);
        console.log("Old file deleted successfully");
      } catch (fileError) {
        console.error("Error deleting old file:", fileError);
        // Continue with update even if file deletion fails
      }
    }

    // Update the expense
    await expense.update(updateData);

    const updatedExpense = await models.Expense.findByPk(id);
    console.log("Updated expense:", JSON.stringify(updatedExpense.toJSON()));

    return json({
      success: true,
      message: "Uitgave bijgewerkt",
      expense: updatedExpense.toJSON()
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    // Return more detailed error info
    return json({
      success: false,
      message: "Kon uitgave niet bijwerken",
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;
    console.log("DELETE request received for ID:", id);

    // Find the expense
    const expense = await models.Expense.findByPk(id);

    if (!expense) {
      console.error("Expense not found:", id);
      return json({
        success: false,
        message: "Uitgave niet gevonden"
      }, { status: 404 });
    }

    console.log("Found expense to delete:", JSON.stringify(expense.toJSON()));

    // If there's a URL, delete the file from S3
    if (expense.url) {
      try {
        console.log("Deleting file:", expense.url);
        await deleteFile(expense.url);
        console.log("File deleted successfully");
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue with deletion even if file deletion fails
      }
    }

    // Delete the expense
    await expense.destroy();
    console.log("Expense deleted successfully");

    return json({
      success: true,
      message: "Uitgave verwijderd"
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return json({
      success: false,
      message: "Kon uitgave niet verwijderen",
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    }, { status: 500 });
  }
}
