const express = require('express');

const router = express.Router();

const labourerController = require("../Controllers/labourerController");
const authenticateUser = require('../Middleware/authenticateUser');

router.get("/getLabrorer/:leadId",authenticateUser,labourerController.getSpecificLabourer);

router.put("/updateLabrorer1/:leadId", authenticateUser, labourerController.updateLabrorer);


module.exports = router;