const express = require('express');

const router = express.Router();

const statusController = require("../Controllers/statusController");
const authenticateUser = require('../Middleware/authenticateUser');

router.get("/getStatus",statusController.getStatus);

router.put("/updateStatus/:leadId", authenticateUser, statusController.updateStatus);


module.exports = router;