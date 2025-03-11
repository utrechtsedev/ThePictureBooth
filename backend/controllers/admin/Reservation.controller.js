const { models } = require('../../models/index')
var Paynl = require('paynl-sdk');
const { sendConfirmationEmail, sendAcceptedEmail, sendCancelledEmail } = require("../../constants.js");
Paynl.Config.setApiToken(process.env.PAYNL_API_TOKEN);
Paynl.Config.setServiceId(process.env.PAYNL_SERVICE_ID);

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await models.Reservation.findAll({ 
            include: 
            [
                {
                    model: models.Customer
                },
                {
                    model: models.Photobooth
                }
            ] 
        });

        if (!reservations) {
            return res.status(404).json({error: "Kon reservering niet vinden"})
        }

        res.json(reservations);
      } catch (error) {
        res.status(500).json({ error: "Kon reserveringen niet ophalen" });
      }
}

exports.createReservation = async (req, res) => {
      try {
        const reservation = await models.Reservation.create(req.body);
        res.status(201).json(reservation);
      } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error)
    
      }
}

exports.modifyReservation = async (req, res) => {
      try {
        const reservation = await models.Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).json({ error: "Reservering niet gevonden" });
    
        await reservation.update(req.body);
        res.json({ message: "Reservering succesvol bijgewerkt", reservation });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

exports.deleteReservation = async (req, res) => {
      try {
        const reservation = await models.Reservation.findOne({where: {id: req.body.id}});
    
        if (!reservation) {
          return res.status(404).json({ error: "Reservering niet gevonden" });
        }
        await reservation.destroy();
        res.json({ message: `Reservering is succesvol verwijderd.` });
      } catch (error) {
        console.error("Fout bij verwijderen reservering:", error);
        res.status(500).json({ error: "Interne serverfout bij verwijderen reservering" });
      }
}
exports.sendEmailUpdateToCustomer = async (req, res) => {
    if (!req.body.id) { return res.status(200).json({ status: "not ok" }) }
    try {
      const reservation = await models.Reservation.findOne({where: {id: req.body.id}});
      if (!reservation) { return res.status(201).json({ status: "not ok" }) }
      const customer = await models.Customer.findOne({ where: { id: reservation.customer_id } })
      if (!customer) { return res.status(202).json({ status: "not ok" }) }
      // console.log(reservation.event_date.toISOString())
      let date = reservation.event_date.toISOString()
      let datum = date.split("T")[0]
      let time = date.split("T")[1]
      let tijd = time.split(":")[0]
      tijd = tijd + ":00"
  
  
      switch (reservation.status) {
        case "pending":
          await sendConfirmationEmail(customer.email, datum, tijd, reservation.event_duration, reservation.event_location)
          return res.status(200).json({ status: "OK" })
        case "accepted":
          await sendAcceptedEmail(customer.email, reservation.final_payment_amount)
          return res.status(200).json({ status: "OK" })
        case "cancelled":
          await sendCancelledEmail(customer.email)
          return res.status(200).json({ status: "OK" })
        // TODO: CASE "COMPLETED" (review achterlaten etc.)
        default:
          return res.status(200).json({ status: "OK" })
      }
    } catch (error) {
  
    }
}
