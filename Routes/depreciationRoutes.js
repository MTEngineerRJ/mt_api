const express = require('express');

const router = express.Router();

const depreciationController = require("../Controllers/depreciationController");

router.get("/getDepreciationRates",depreciationController.getDepreciationRates);

module.exports = router;