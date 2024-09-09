const express = require('express');

const router = express.Router();

const finalReportController = require("../Controllers/finalReportController");
const authenticateUser = require("../Middleware/authenticateUser");

router.put("/updateFinalReport/:leadId", authenticateUser, finalReportController.updateFinalReport);


module.exports = router;