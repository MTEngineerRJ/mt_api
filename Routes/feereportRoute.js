const express = require('express');

const router = express.Router();

const feeReportController = require("../Controllers/feeReportController");
const authenticateUser = require("../Middleware/authenticateUser");

router.post("/uploadFeeReport",feeReportController.upload);

router.get("/getFeeReport",authenticateUser,feeReportController.getFeeReport);

module.exports = router;