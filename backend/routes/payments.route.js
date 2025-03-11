const express = require("express");
const { getAllPayments, createPayment, getOnePayment, modifyPayment, deletePayment } = require("../controllers/admin/Payment.controller");

const router = express.Router();

router.get("/", (req, res) => getAllPayments(req,res));

router.get("/:id", (req, res) => getOnePayment(req, res));

router.post("/", (req, res) => createPayment(req, res));

router.patch("/", (req, res) => modifyPayment(req, res))

router.delete("/", (req, res) => deletePayment(req, res))

module.exports =  router;
