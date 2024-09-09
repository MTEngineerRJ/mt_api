const express = require('express');

const router = express.Router();

const uploadController = require("../Controllers/uploadController");
const authenticateUser = require('../Middleware/authenticateUser');

router.get("/getUploadDocuments",uploadController.getReportDocument);

router.get("/getDocuments",uploadController.getDocuments);


router.post("/addDocumentLabel",uploadController.addDocumentLabel);


router.get("/getDocumentsLabels",uploadController.getReportDocumentsLabels);
         
router.post("/uploadDocument",uploadController.uploadDocumentV2);

router.post("/uploadManualDocument",uploadController.uploadDocument);

router.post("/verifyReportUpload", uploadController.verifyReportUpload);

module.exports = router;