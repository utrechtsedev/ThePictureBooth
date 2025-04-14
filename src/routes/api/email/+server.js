import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from '$env/static/private';

/**
 * Email verzendservice met SMTP
 */
export async function POST({ request }) {
  try {
    const data = await request.json();
    const {
      recipients,
      subject,
      body,
      isHtml,
      sendCopy
    } = data;

    // Controleer of we wel recipients hebben
    if (!recipients || recipients.length === 0) {
      return json({
        success: false,
        message: 'Geen ontvangers opgegeven'
      }, { status: 400 });
    }

    // Controleer andere verplichte velden
    if (!subject || !body) {
      return json({
        success: false,
        message: 'Onderwerp en bericht zijn verplicht'
      }, { status: 400 });
    }

    // Configureer SMTP transporter met env variabelen
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true voor poort 465, false voor andere poorten
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    // Bereid de ontvangers voor
    let to;
    let placeholders = {}; // Voor bulk emails met placeholders

    if (recipients.length === 1) {
      // Enkele ontvanger
      to = recipients[0].email;
      placeholders = {
        first_name: recipients[0].first_name,
        last_name: recipients[0].last_name,
        email: recipients[0].email
      };
    } else {
      // Meerdere ontvangers - we willen BCC gebruiken voor privacy
      to = SMTP_FROM; // Stuur naar onszelf
    }

    // Vervang placeholders in bulk mails
    let processedBody = body;

    if (recipients.length === 1) {
      // Vervang de placeholders voor één ontvanger
      Object.entries(placeholders).forEach(([key, value]) => {
        processedBody = processedBody.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
      });
    }

    // Basis email opties
    const mailOptions = {
      from: SMTP_FROM,
      subject: subject,
      // Gebruik HTML of platte tekst op basis van de isHtml parameter
      ...(isHtml ? { html: processedBody } : { text: processedBody })
    };

    // Voeg ontvangers toe afhankelijk van de situatie
    if (recipients.length === 1) {
      // Enkele ontvanger
      mailOptions.to = to;
    } else {
      // Bulk email met BCC
      mailOptions.to = SMTP_FROM;
      mailOptions.bcc = recipients.map(r => r.email);
    }

    // Verstuur kopie naar afzender indien gewenst
    if (sendCopy) {
      mailOptions.cc = SMTP_USER;
    }

    // Stuur de email
    const info = await transporter.sendMail(mailOptions);

    // Voor bulk emails, we moeten meerdere emails versturen als we placeholders willen vervangen
    if (recipients.length > 1 && body.includes('{{')) {
      // We hebben placeholders in een bulk email, dus we moeten individuele mails sturen
      const bulkResults = await Promise.allSettled(
        recipients.map(async (recipient) => {
          // Vervang placeholders voor deze specifieke ontvanger
          let recipientBody = body;
          Object.entries({
            first_name: recipient.first_name,
            last_name: recipient.last_name,
            email: recipient.email
          }).forEach(([key, value]) => {
            recipientBody = recipientBody.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value || '');
          });

          // Stuur individuele email
          const individualOptions = {
            ...mailOptions,
            to: recipient.email,
            bcc: undefined, // Verwijder BCC
            ...(isHtml ? { html: recipientBody } : { text: recipientBody })
          };

          return await transporter.sendMail(individualOptions);
        })
      );

      // Check resultaten van bulk versturen
      const failedEmails = bulkResults
        .filter(result => result.status === 'rejected')
        .length;

      if (failedEmails > 0) {
        return json({
          success: true,
          warning: `${failedEmails} van de ${recipients.length} emails konden niet worden verzonden`,
          sentCount: recipients.length - failedEmails
        });
      }
    }

    return json({
      success: true,
      message: recipients.length === 1
        ? 'E-mail succesvol verzonden'
        : `${recipients.length} e-mails succesvol verzonden`,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return json({
      success: false,
      message: 'Fout bij versturen van e-mail',
      error: error.message
    }, { status: 500 });
  }
}
