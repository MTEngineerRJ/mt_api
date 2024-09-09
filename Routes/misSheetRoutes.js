const express = require('express');

const router = express.Router();

const misSheetController = require("../Controllers/misSheetController");


router.get("/getMisSheet", misSheetController.getMISSheet);


module.exports = router;