const express = require('express');

const router = express.Router();

const regionController = require("../Controllers/regionController");

router.get("/getRegions", regionController.getRegions);

module.exports = router;