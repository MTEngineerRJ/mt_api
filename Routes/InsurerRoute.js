const express = require('express');

const router = express.Router();

const InsurerController = require("../Controllers/InsurerController");


router.get("/getAll", InsurerController.getInsurers);


module.exports = router;