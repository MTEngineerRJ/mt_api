const express = require('express');

const router = express.Router();

const driverOnlineDetailController = require("../Controllers/driverOnlineDetailController");
const authenticateUser = require('../Middleware/authenticateUser');

router.get("/getOnlineDriverDetails", authenticateUser,driverOnlineDetailController.getOnlineDriverDetails);

router.get("/getSpecificDriverDetails", authenticateUser,driverOnlineDetailController.getSpecificDriverDetails);

module.exports = router;