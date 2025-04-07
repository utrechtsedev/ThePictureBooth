// src/lib/server/utils/invoiceGenerator.js
import { models } from '$lib/server/models/index.js';
import PDFDocument from 'pdfkit';
import { uploadFile } from './s3Client.js';

/**
 * Generate an invoice for a reservation and save it to the database
 * @param {Object} reservation - The Sequelize reservation instance with included Customer
 * @returns {Promise<Object>} The created invoice object
 */
export async function generateInvoiceFromReservation(reservation) {
  try {
    // Ensure we have a valid reservation with customer data
    if (!reservation || !reservation.Customer) {
      throw new Error('Invalid reservation or missing customer data');
    }

    // Generate invoice number (you could implement a more sophisticated numbering system)
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    // Set invoice dates
    const invoiceDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Due in 14 days

    // Create invoice items based on reservation
    const items = [{
      description: `${reservation.event_type || 'Evenement'} - Photobooth services`,
      quantity: 1,
      price: parseFloat(reservation.total_price)
    }];

    // Add optional items if relevant (example)
    if (reservation.event_duration) {
      items.push({
        description: `Event duration: ${reservation.event_duration}`,
        quantity: 1,
        price: 0 // Already included in total price
      });
    }

    // Create invoice PDF
    const pdfBuffer = await createInvoicePDF({
      invoiceNumber,
      customer: reservation.Customer,
      invoiceDate,
      dueDate,
      reservation,
      items,
      notes: ''
    });

    // Upload PDF to S3
    const pdfPath = await uploadFile(
      pdfBuffer,
      `${invoiceNumber}.pdf`,
      'application/pdf'
    );

    // Create invoice in database
    const invoice = await models.Invoice.create({
      invoice_number: invoiceNumber,
      customer_id: reservation.customer_id,
      reservation_id: reservation.id,
      amount: parseFloat(reservation.total_price),
      invoice_type: 'final',
      payment_status: 'unpaid',
      invoice_date: invoiceDate,
      due_date: dueDate,
      pdf_path: pdfPath
    });

    return invoice.toJSON();
  } catch (error) {
    console.error('Error generating invoice from reservation:', error);
    throw error;
  }
}

/**
 * Generate a standalone invoice PDF without saving to database
 * @param {Object} invoiceData - The invoice data
 * @returns {Promise<String>} The URL of the uploaded PDF
 */
export async function generateStandaloneInvoice(invoiceData) {
  try {
    // Create invoice PDF
    const pdfBuffer = await createInvoicePDF(invoiceData);

    // Upload PDF to S3
    const pdfUrl = await uploadFile(
      pdfBuffer,
      `${invoiceData.invoiceNumber}.pdf`,
      'application/pdf'
    );

    return pdfUrl;
  } catch (error) {
    console.error('Error generating standalone invoice:', error);
    throw error;
  }
}

/**
 * Create a PDF for an invoice
 * @param {Object} data - The invoice data
 * @returns {Promise<Buffer>} Buffer containing the PDF
 */
async function createInvoicePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Company info
      doc.fontSize(20).text('The Picture Booth', { align: 'right' });
      doc.fontSize(10).text('KvK: 12345678', { align: 'right' });
      doc.text('BTW: NL123456789B01', { align: 'right' });
      doc.text('Email: info@thepicturebooth.nl', { align: 'right' });
      doc.moveDown();

      // Invoice header
      doc.fontSize(18).text('FACTUUR', { align: 'center' });
      doc.moveDown();

      // Invoice details
      doc.fontSize(12);
      doc.text(`Factuurnummer: ${data.invoiceNumber}`);
      doc.text(`Factuurdatum: ${data.invoiceDate.toLocaleDateString('nl-NL')}`);
      doc.text(`Vervaldatum: ${data.dueDate.toLocaleDateString('nl-NL')}`);
      doc.moveDown();

      // Customer info
      doc.text('Klantgegevens:');
      if (data.customer) {
        // For reservation-based invoices with Customer object
        doc.text(`${data.customer.first_name} ${data.customer.last_name}`);
        if (data.customer.company_name) {
          doc.text(data.customer.company_name);
        }
        doc.text(data.customer.email);
        doc.text(data.customer.phone);
      } else if (data.customerName) {
        // For standalone invoices
        doc.text(data.customerName);
        if (data.customerEmail) {
          doc.text(data.customerEmail);
        }
      }
      doc.moveDown();

      // Add event details if available
      if (data.reservation) {
        doc.text('Evenement details:');
        doc.text(`Type: ${data.reservation.event_type || 'Onbekend'}`);
        doc.text(`Datum: ${new Date(data.reservation.event_date).toLocaleDateString('nl-NL')}`);
        doc.text(`Locatie: ${data.reservation.event_location}`);
        doc.moveDown();
      }

      // Invoice table
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Omschrijving', 50, tableTop);
      doc.text('Aantal', 300, tableTop);
      doc.text('Prijs', 350, tableTop);
      doc.text('Totaal', 450, tableTop);
      doc.font('Helvetica');

      let tableY = tableTop + 20;
      let subtotal = 0;

      // Invoice items
      data.items.forEach(item => {
        const itemTotal = item.quantity * item.price;
        subtotal += itemTotal;

        doc.text(item.description, 50, tableY);
        doc.text(item.quantity.toString(), 300, tableY);
        doc.text(`€ ${item.price.toFixed(2)}`, 350, tableY);
        doc.text(`€ ${itemTotal.toFixed(2)}`, 450, tableY);

        tableY += 20;
      });

      // Totals
      const vat = subtotal * 0.21;
      const total = subtotal + vat;

      tableY += 10;
      doc.text('Subtotaal:', 350, tableY);
      doc.text(`€ ${subtotal.toFixed(2)}`, 450, tableY);

      tableY += 20;
      doc.text('BTW (21%):', 350, tableY);
      doc.text(`€ ${vat.toFixed(2)}`, 450, tableY);

      tableY += 20;
      doc.font('Helvetica-Bold');
      doc.text('Totaal:', 350, tableY);
      doc.text(`€ ${total.toFixed(2)}`, 450, tableY);
      doc.font('Helvetica');

      // Payment details
      doc.moveDown(2);
      doc.text('Betalingsgegevens:');
      doc.text('IBAN: NL12 RABO 0123 4567 89');
      doc.text('Ten name van: The Picture Booth');
      doc.text(`Vermeld bij betaling: ${data.invoiceNumber}`);

      // Notes
      if (data.notes) {
        doc.moveDown();
        doc.text('Notities:');
        doc.text(data.notes);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).text('Betaling binnen 14 dagen na factuurdatum. Op al onze diensten zijn onze algemene voorwaarden van toepassing.', {
        align: 'center'
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
