var nodemailer = require("nodemailer");

async function sendConfirmationEmail(recipient, date, tijd, duur, locatie) {
    var smtpTransport = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 2525, // 8025, 587 and 25 can also be used.
      auth: {
        user: "thepicturebooth.nl",
        pass: "Wahedbatata23",
      },
    });
let email = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>📸 Ontvangstbevestiging - The PhotoBooth</title>
</head>
<body style="background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Hoofd Container -->
                <div style="max-width: 600px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="font-size: 28px; color: #0000FF; font-weight: 600; margin: 0;">
                            📸 Boeking Bevestigd
                        </h1>
                        <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">
                            Bedankt voor je boeking bij The Picture Booth! Dit is een geautomatiseerd bericht. Wij zullen deze boeking binnen 24 uur bevestigen.
                        </p>
                    </div>

                    <!-- Reserveringsdetails -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Reserveringsdetails
                        </h2>
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                            <table style="width: 100%; color: #374151;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">📅 Datum:</td>
                                    <td style="padding: 8px 0;">${date}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">⏰ Tijd:</td>
                                    <td style="padding: 8px 0;">${tijd}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">⏳ Duur:</td>
                                    <td style="padding: 8px 0;">${duur} uur</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">📍 Locatie:</td>
                                    <td style="padding: 8px 0;">${locatie}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <!-- Betalingsbevestiging -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Betalingsbevestiging
                        </h2>
                        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px;">
                            <p style="color: #15803d; margin: 0;">
                                €100 succesvol ontvangen via iDEAL.
                            </p>
                            <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
                                
                            </p>
                        </div>
                    </div>

                    <!-- Belangrijke Informatie -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Belangrijke Informatie
                        </h2>
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Het resterend bedrag moet worden voldaan bij aanvang.</li>
                                <li style="margin-bottom: 8px;">Annuleren kan gratis tot 48 uur van tevoren.</li>
                                <li>Neem contact op bij wijzigingen.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Contact Footer -->
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 32px; text-align: center;">
                        <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                            Vragen? Stuur een mail naar
                            <a href="mailto:info.thepictureboothnl@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                                info.thepictureboothnl@gmail.com
                            </a>
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            PKDeals | KvK-nummer: 91583675<br>
                            © 2025 Alle rechten voorbehouden
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
`
smtpTransport.sendMail({
    from: "info@thepicturebooth.nl",
    to: recipient,
    subject: "Ontvangstbevestiging Reservering",
    html: email
  },
    function (error, response) {
      if(error){
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }
    }
  );

  smtpTransport.sendMail({
    from: "info@thepicturebooth.nl",
    to: "info.thepictureboothnl@gmail.com",
    subject: "Nieuwe reservering",
    html: `<h1>Nieuwe Reservering<h1><br><p>
    Beste admin, er is een nieuwe reservering. Als je de volledige reservering wilt bekijken, log dan in op https://thepicturebooth.nl/login.<br>
    Reservering van: ${recipient}<br>
    Datum: ${date}<br>
    Tijd: ${tijd}<br>
    Duratie: ${duur} uur<br>
    Locatie: ${locatie}<br><br>
    Deze reservering is aanbetaald.
    <p>
    
    `
  },
    function (error, response) {
      if(error){
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }
    }
  );
}

async function sendAcceptedEmail(recipient, restbedrag) {
    var smtpTransport = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 2525, // 8025, 587 and 25 can also be used.
      auth: {
        user: "thepicturebooth.nl",
        pass: "Wahedbatata23",
      },
    });
let email = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>✅ Boeking Geaccepteerd - The PhotoBooth</title>
</head>
<body style="background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <div style="max-width: 600px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="font-size: 28px; color: #10B981; font-weight: 600; margin: 0;">
                            ✅ Boeking Definitief
                        </h1>
                        <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">
                            Gefeliciteerd! Je boeking voor de Picture Booth is goedgekeurd. Zie hieronder de details.
                        </p>
                    </div>

                    <!-- Reserveringsdetails (zelfde als origineel) -->

                    <!-- Betalingsherinnering -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Te Voldagen Bedrag
                        </h2>
                        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px;">
                            <p style="color: #15803d; margin: 0;">
                                Restbedrag: €${restbedrag} contant te voldaan bij aanvang.
                            </p>
                        </div>
                    </div>

                    <!-- Voorbereiding -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Voorbereiding
                        </h2>
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Zorg voor een vlakke opstelruimte (2x2 meter)</li>
                                <li>Wij zijn 30 minuten voor aanvang aanwezig</li>
                            </ul>
                        </div>
                    </div>

                    <div style="border-top: 1px solid #e5e7eb; padding-top: 32px; text-align: center;">
                        <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                            Vragen? Stuur een mail naar
                            <a href="mailto:info.thepictureboothnl@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                                info.thepictureboothnl@gmail.com
                            </a>
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            PKDeals | KvK-nummer: 91583675<br>
                            © 2025 Alle rechten voorbehouden
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
`
smtpTransport.sendMail({
    from: "info@thepicturebooth.nl",
    to: recipient,
    subject: "Uw reservering is bevestigd",
    html: email
  },
    function (error, response) {
      if(error){
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }
    }
  );
}

async function sendCancelledEmail(recipient) {
    var smtpTransport = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 2525, // 8025, 587 and 25 can also be used.
      auth: {
        user: "thepicturebooth.nl",
        pass: "Wahedbatata23",
      },
    });
let email = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>🚫 Boeking Geannuleerd - The PhotoBooth</title>
</head>
<body style="background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Hoofd Container -->
                <div style="max-width: 600px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="font-size: 28px; color: #6b7280; font-weight: 600; margin: 0;">
                            🚫 Boeking Geannuleerd
                        </h1>
                        <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">
                            Je boeking is geannuleerd. Hieronder vind je alle details.
                        </p>
                    </div>

                    <!-- Reserveringsdetails -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Reserveringsdetails
                        </h2>
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                            <table style="width: 100%; color: #374151;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">📅 Datum:</td>
                                    <td style="padding: 8px 0;">${date}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">⏰ Tijd:</td>
                                    <td style="padding: 8px 0;">${tijd}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">⏳ Duur:</td>
                                    <td style="padding: 8px 0;">${duur} uur</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 500;">📍 Locatie:</td>
                                    <td style="padding: 8px 0;">${locatie}</td>
                                </tr>
                            </table>
                        </div>
                    </div>


                    <!-- Restitutie -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Restitutie
                        </h2>
                        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px;">
                            <p style="color: #B45309; margin: 0;">
                                €100 wordt binnen 5 werkdagen teruggestort naar je rekening.
                            </p>
                            <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
                                *Bij annulering binnen 48 uur voor de boeking wordt een administratiekosten van €25 in rekening gebracht.
                            </p>
                        </div>
                    </div>

                    <!-- Belangrijke Informatie -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: #111827; font-weight: 600; margin-bottom: 16px;">
                            Vervolgstappen
                        </h2>
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Je ontvangt een aparte bevestiging van de terugbetaling.</li>
                                <li style="margin-bottom: 8px;">Boek opnieuw via <a href="https://thepicturebooth.nl" style="color: #3b82f6;">onze website</a>.</li>
                                <li>Neem contact op bij vragen over de annulering.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Contact Footer -->
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 32px; text-align: center;">
                        <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                            Vragen? Stuur een mail naar
                            <a href="mailto:info.thepictureboothnl@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                                info.thepictureboothnl@gmail.com
                            </a>
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            PKDeals | KvK-nummer: 91583675<br>
                            © 2025 Alle rechten voorbehouden
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`
smtpTransport.sendMail({
    from: "info@thepicturebooth.nl",
    to: recipient,
    subject: "Uw reservering is geannuleerd",
    html: email
  },
    function (error, response) {
      if(error){
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }
    }
  );
}




module.exports = {sendConfirmationEmail, sendAcceptedEmail, sendCancelledEmail};