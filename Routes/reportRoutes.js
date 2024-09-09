const express = require('express');

const router = express.Router();

const reportController = require("../Controllers/reportController");


router.get("/", reportController.getAllInfo);

router.get("/getBillInfo", reportController.getBillInfo);


module.exports = router;