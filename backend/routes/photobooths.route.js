const express = require("express");
const { getAllPhotobooths, getOnePhotobooth, createPhotobooth, modifyPhotobooth } = require("../controllers/admin/Photobooth.controller.js");

const router = express.Router();

router.get("/", (req, res) => getAllPhotobooths(req, res));

router.get("/:id", (req, res) => getOnePhotobooth(req, res));

router.patch("/", (req, res) => modifyPhotobooth(req, res));

router.post("/", (req, res) => createPhotobooth(req, res));

module.exports =  router;
