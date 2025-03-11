const { sendConfirmationEmail } = require('../constants');
const { models } = require('../models/index')
var Paynl = require('paynl-sdk');
Paynl.Config.setApiToken(process.env.PAYNL_API_TOKEN);
Paynl.Config.setServiceId(process.env.PAYNL_SERVICE_ID);

exports.createReservationClient = async (req, res) => {
    try {
      const reservation = await models.Reservation.create(req.body);
      Paynl.Transaction.start({
        //the amount in euro
        amount: 100,
        enduser: {
          lastName: req.body.last_name,
          emailAddress: req.body.email,
          phoneNumber: req.body.phone
        },
        extra1: reservation.id,
        exchangeUrl: 'https://thepicturebooth.nl/api/reservations/payment',
        currency: 'EUR',
        invoiceDate: new Date(),
        deliveryDate: new Date(),
        language: "NL",
        returnUrl: "https://thepicturebooth.nl",
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }).subscribe(
        function (result) {
          //redirect the user to this url to complete the payment
          return res.status(200).json(result.paymentURL)
        },
        function (error) {
          console.error(error);
        }
      );
    } catch (error) {
      res.status(400).json({ error: "Kon reservering niet aanmaken, neem contact op met ons." });
      console.log(error)
  
    }
}


// this function receives a payload from the payment-provider (PAYNL) and updates and confirms the reservation - do not modify unless certain
exports.updatePaymentStatus = async (req, res) => {
    const { extra1 } = req.body
    try {
      const reservation = await models.Reservation.findOne({ where: { id: extra1 } });
      if (!reservation) { return res.status(200).json({ status: "not ok" }) }
      if (reservation.payment_status !== "deposit_paid") {
        try {
          await reservation.update({ payment_status: "deposit_paid" })
        } catch (e) {
          return
  
        } finally {
          // Vind klant en stuur bevestigingsemail
          const customer = await models.Customer.findOne({ where: { id: reservation.customer_id } })
          if (!customer) { return res.status(200).json({ status: "not ok" }) }
  
          // console.log(reservation.event_date.toISOString())
          let date = reservation.event_date.toISOString()
          let datum = date.split("T")[0];
          let time = date.split("T")[1];
          let tijd = time.split(":")[0];
          tijd = tijd + ":00";
          sendConfirmationEmail(customer.email, datum, tijd, reservation.event_duration, reservation.event_location)
        }
      }
      res.status(200).json({ status: "ok" })
    } catch (e) {
      res.status(200).json({ status: "not ok" });
      console.log(e)
  
    }
}