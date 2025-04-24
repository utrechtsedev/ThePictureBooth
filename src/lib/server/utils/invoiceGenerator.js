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
 * Create a PDF for an invoice - Dutch style
 * @param {Object} data - The invoice data
 * @returns {Promise<Buffer>} Buffer containing the PDF
 */
async function createInvoicePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Add a subtle background color for a more professional look
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fbfbfb');

      // Add a header bar
      doc.rect(0, 0, doc.page.width, 15).fill('#333333');

      // Company logo placeholder (you can add an actual logo here)
      doc.fontSize(18).fillColor('#333333').text('ThePictureBooth', 60, 45);

      // TOP LEFT: Company Information and Invoice Details
      const companyInfoY = 100;
      doc.fontSize(9).fillColor('#555555');
      doc.text('ThePictureBooth', 50, companyInfoY);
      doc.text('KvK: 12345678');
      doc.text('BTW: NL123456789B01');
      doc.text('Email: info.thepictureboothnl@gmail.com');
      doc.text('IBAN: NL12 RABO 0123 4567 89');

      doc.moveDown();
      doc.fontSize(10).fillColor('#333333');
      doc.text(`Factuurnummer: ${data.invoiceNumber}`);
      doc.text(`Factuurdatum: ${data.invoiceDate.toLocaleDateString('nl-NL')}`);
      doc.text(`Vervaldatum: ${data.dueDate.toLocaleDateString('nl-NL')}`);

      // TOP RIGHT: Customer Details
      const customerX = 350;
      const customerY = 100;
      doc.fontSize(11).fillColor('#333333');
      doc.font('Helvetica-Bold').text('FACTUUR VOOR:', customerX, customerY);
      doc.font('Helvetica').fontSize(9).fillColor('#555555');

      if (data.customer) {
        // For reservation-based invoices with Customer object
        doc.text(`${data.customer.first_name} ${data.customer.last_name}`, customerX);
        if (data.customer.company_name) {
          doc.text(data.customer.company_name, customerX);
        }
        if (data.customer.address) {
          doc.text(data.customer.address, customerX);
        }
        if (data.customer.postal_code && data.customer.city) {
          doc.text(`${data.customer.postal_code} ${data.customer.city}`, customerX);
        }
        doc.text(data.customer.email, customerX);
        doc.text(data.customer.phone, customerX);
      } else if (data.customerName) {
        // For standalone invoices
        doc.text(data.customerName, customerX);
        if (data.customerEmail) {
          doc.text(data.customerEmail, customerX);
        }
        if (data.customerPhone) {
          doc.text(data.customerPhone, customerX);
        }
      }

      // MIDDLE: Invoice Title
      doc.fontSize(18).fillColor('#333333');
      doc.text('FACTUUR', 50, 220, { align: 'center', width: doc.page.width - 100 });

      // Add event details if available
      let startY = 260;
      if (data.reservation) {
        doc.roundedRect(50, startY, doc.page.width - 100, 60, 3).fillAndStroke('#f5f5f5', '#e0e0e0');
        doc.fontSize(10).fillColor('#333333');
        doc.text('Evenement details:', 60, startY + 10);
        doc.fontSize(9).fillColor('#555555');
        doc.text(`Type: ${data.reservation.event_type || 'Onbekend'}`, 60);
        doc.text(`Datum: ${new Date(data.reservation.event_date).toLocaleDateString('nl-NL')}`, 60);
        doc.text(`Locatie: ${data.reservation.event_location}`, 60);
        startY += 80;
      }

      // MIDDLE: Invoice Table
      // Table header with background
      doc.rect(50, startY, doc.page.width - 100, 20).fill('#333333');
      doc.fillColor('#ffffff').fontSize(10);
      doc.text('Omschrijving', 60, startY + 5);
      doc.text('Aantal', 350, startY + 5);
      doc.text('Prijs', 400, startY + 5);
      doc.text('Totaal', 470, startY + 5);

      let tableY = startY + 25;
      let total = 0;

      // Alternating row colors for better readability
      let isEven = false;

      // Invoice items
      data.items.forEach(item => {
        if (isEven) {
          doc.rect(50, tableY - 5, doc.page.width - 100, 20).fill('#f5f5f5');
        }

        const itemTotal = item.quantity * item.price;
        total += itemTotal;

        doc.fillColor('#333333').fontSize(9);
        doc.text(item.description, 60, tableY);
        doc.text(item.quantity.toString(), 350, tableY);
        doc.text(`€ ${item.price.toFixed(2)}`, 400, tableY);
        doc.text(`€ ${itemTotal.toFixed(2)}`, 470, tableY);

        tableY += 20;
        isEven = !isEven;
      });

      // Since VAT is included, we need to calculate it from the total
      // For 9% VAT: VAT = total - (total / 1.09)
      const vatIncluded = total - (total / 1.09);
      const netAmount = total - vatIncluded;

      // Add a separator line
      doc.moveTo(50, tableY + 5).lineTo(doc.page.width - 50, tableY + 5).stroke('#cccccc');
      tableY += 15;

      // Totals section
      doc.fillColor('#555555').fontSize(10);
      doc.text('Netto bedrag:', 350, tableY);
      doc.text(`€ ${netAmount.toFixed(2)}`, 470, tableY);

      tableY += 20;
      doc.text('BTW (9%, inclusief):', 350, tableY);
      doc.text(`€ ${vatIncluded.toFixed(2)}`, 470, tableY);

      tableY += 20;
      doc.fillColor('#333333').fontSize(12).font('Helvetica-Bold');
      doc.text('TOTAAL:', 350, tableY);
      doc.text(`€ ${total.toFixed(2)}`, 470, tableY);
      doc.font('Helvetica');

      // BOTTOM: Payment Instructions
      const paymentBoxY = tableY + 40;
      doc.roundedRect(50, paymentBoxY, doc.page.width - 100, 100, 5).fillAndStroke('#f5f5f5', '#e0e0e0');

      doc.fillColor('#333333').fontSize(11).font('Helvetica-Bold');
      doc.text('Betalingsinformatie', 60, paymentBoxY + 10);
      doc.font('Helvetica').fontSize(9).fillColor('#555555');

      // Calculate bank transfer and cash amounts
      const bankAmount = Math.min(total, 100);
      const cashAmount = total > 100 ? total - 100 : 0;

      doc.moveDown();
      doc.text('Te betalen binnen 14 dagen na factuurdatum.', 60);
      doc.text(`Betaling in twee delen:`, 60);
      doc.text(`1. Bank overschrijving: € ${bankAmount.toFixed(2)}`, 60);
      doc.text('   IBAN: NL12 RABO 0123 4567 89', 60);
      doc.text('   Ten name van: ThePictureBooth', 60);
      doc.text(`   Vermeld bij betaling: ${data.invoiceNumber}`, 60);

      if (cashAmount > 0) {
        doc.text(`2. Contant te betalen bij het evenement: € ${cashAmount.toFixed(2)}`, 60);
      }

      // Notes
      if (data.notes) {
        doc.moveDown();
        doc.fillColor('#333333').fontSize(10);
        doc.text('Notities:', 60);
        doc.fillColor('#555555').fontSize(9);
        doc.text(data.notes, 60);
      }

      // Footer
      const footerY = doc.page.height - 50;
      doc.rect(0, footerY - 5, doc.page.width, 30).fill('#333333');
      doc.fillColor('#ffffff').fontSize(8).text('Op al onze diensten zijn onze algemene voorwaarden van toepassing.', 50, footerY, {
        align: 'center',
        width: doc.page.width - 100
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
