const express = require('express');

const router = express.Router();

const loginController = require("../Controllers/apis/loginUserController");
const leadsController = require("../Controllers/apis/leadsController")
const surveyController = require("../Controllers/apis/surveyController")


router.post("/loginUser", loginController.loginUser);

router.get("/pendingLeads", leadsController.pendingLeads);
router.get("/historyLeads", leadsController.historyLeads);

router.get("/surveyDetails", surveyController.surveyDetails);
router.post("/updateSurveyDetails", surveyController.updateSurveyDetails);

module.exports = router;