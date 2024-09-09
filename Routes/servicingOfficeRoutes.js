const express = require('express');

const router = express.Router();

const servicingOfficeController = require("../Controllers/servicingOfficeController");

router.get("/getServicingOffice",servicingOfficeController.getServicingOffice);

module.exports = router;