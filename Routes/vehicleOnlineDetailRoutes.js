const express = require('express');

const router = express.Router();

const vehicleOnlineDetailController = require("../Controllers/vehicleOnlineDetailController");
const authenticateUser = require('../Middleware/authenticateUser');

router.get("/getOnlineVehicleData", authenticateUser,vehicleOnlineDetailController.getOnlineVehicleData);

router.get("/getSpecificVehicleDetails", authenticateUser,vehicleOnlineDetailController.getSpecificVehicleDetails);

module.exports = router;