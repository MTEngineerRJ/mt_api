const express = require('express');

const router = express.Router();

const loginController = require("../Controllers/apis/loginUserController");
const leadsController = require("../Controllers/apis/leadsController")
const surveyController = require("../Controllers/apis/surveyController")
const uploadDocumentController = require("../Controllers/apis/uploadDocumentController")


router.post("/loginUser", loginController.loginUser);

router.get("/pendingLeads", leadsController.pendingLeads);
router.get("/historyLeads", leadsController.historyLeads);

router.get("/getAllSurvey",leadsController.getAllSurvey);

router.get("/surveyDetails", surveyController.surveyDetails);
router.post("/updateSurveyDetails", surveyController.updateSurveyDetails);

router.post("/uploadDocument", uploadDocumentController.uploadDocument)

module.exports = router;