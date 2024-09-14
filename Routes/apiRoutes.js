const express = require('express');

const router = express.Router();

const loginController = require("../Controllers/loginUserController");
const claimsController = require("../Controllers/claimsController")


const surveyController = require("../Controllers/surveyController")
const uploadDocumentController = require("../Controllers/uploadDocumentController")


router.post("/loginUser", loginController.loginUser);
router.get("/getAllClaims",claimsController.getAllClaims);

router.get("/surveyDetails", surveyController.surveyDetails);
router.post("/updateSurveyDetails", surveyController.updateSurveyDetails);

router.post("/uploadDocument", uploadDocumentController.uploadDocument)

module.exports = router;