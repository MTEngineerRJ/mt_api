const express = require('express');

const router = express.Router();

const reportController = require("../Controllers/fetchController");

router.get("/getServicingOffice",reportController.getServicingOffice);

module.exports = router;