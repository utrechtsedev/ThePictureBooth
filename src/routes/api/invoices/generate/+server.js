import { json } from '@sveltejs/kit';
import { generateStandaloneInvoice } from '$lib/server/utils/invoiceGenerator.js';

export async function POST({ request }) {
  try {
    const data = await request.json();

    // Generate invoice number if not provided
    if (!data.invoiceNumber) {
      data.invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    }

    // Parse dates
    data.invoiceDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date();
    data.dueDate = data.dueDate ? new Date(data.dueDate) : new Date(data.invoiceDate);

    if (data.dueDate <= data.invoiceDate) {
      // Default due date is 14 days after invoice date if not specified correctly
      data.dueDate = new Date(data.invoiceDate);
      data.dueDate.setDate(data.dueDate.getDate() + 14);
    }

    // Generate the invoice PDF and get the URL
    const pdfUrl = await generateStandaloneInvoice(data);

    return json({
      success: true,
      message: 'Invoice generated successfully',
      url: pdfUrl
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return json({
      success: false,
      message: 'Failed to generate invoice',
      error: error.message
    }, { status: 500 });
  }
}
