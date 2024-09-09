const express = require('express');

const router = express.Router();

const reportController = require("../Controllers/reportDocumentController");

router.post("/uploadReportDocument",reportController.uploadDocument);

router.get("/getReportDocuments",reportController.getReportDocuments)

module.exports = router;