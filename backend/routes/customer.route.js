const express = require("express");
const { deleteCustomer, modifyCustomer, createCustomer, getAllCustomers, getOneCustomer } = require("../controllers/admin/Customer.controller");
const router = express.Router();

router.get("/", (req, res) => getAllCustomers(req, res));

router.get("/:id", (req, res) => getOneCustomer(req, res));

router.post("/", (req, res) => createCustomer(req, res));

router.patch("/:id", (req, res) => modifyCustomer(req, res));

router.delete("/:id", (req, res) => deleteCustomer(req, res));

module.exports = router;