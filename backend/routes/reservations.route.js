const express = require("express");
const { models } = require("../models/index.js");
const { getAllReservations, createReservation, modifyReservation, deleteReservation, sendEmailUpdateToCustomer } = require("../controllers/admin/Reservation.controller.js");
const { createReservationClient, updatePaymentStatus } = require("../controllers/Reservation.controller.js");

const router = express.Router();


// ✅ Haal alle reserveringen op
router.get("/", (req, res) => getAllReservations(req, res));



router.post("/vdash", (req, res) => createReservation(req, res));

// ✅ Update volledige reservering (één of meerdere velden)
router.patch("/:id", (req, res) => modifyReservation(req, res));

router.delete("/", (req, res) => deleteReservation(req, res));

// for payment provider use
router.post("/payment", (req, res) => updatePaymentStatus(req, res));

router.post("/email", (req, res) => sendEmailUpdateToCustomer(req, res));


// ✅ Klant maakt reservering aan
router.post("/", (req, res) => createReservationClient(req, res));


// ✅ Update alleen de locatie van een reservering
router.patch("/:id/location", async (req, res) => {
  try {
    const { event_location } = req.body;
    const reservation = await models.Reservation.findByPk(req.params.id);

    if (!reservation) return res.status(404).json({ error: "Reservering niet gevonden" });

    reservation.event_location = event_location;
    await reservation.save();
    res.json({ message: "Locatie succesvol bijgewerkt", reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Update alleen de boekingsdatum van een reservering
router.patch("/:id/date", async (req, res) => {
  try {
    const { event_date } = req.body;
    const reservation = await models.Reservation.findByPk(req.params.id);

    if (!reservation) return res.status(404).json({ error: "Reservering niet gevonden" });

    reservation.event_date = event_date;
    await reservation.save();
    res.json({ message: "Boekingsdatum succesvol bijgewerkt", reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Update alleen de status van een reservering
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await models.Reservation.findByPk(req.params.id);

    if (!reservation) return res.status(404).json({ error: "Reservering niet gevonden" });

    reservation.status = status;
    await reservation.save();
    res.json({ message: "Status succesvol bijgewerkt", reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
