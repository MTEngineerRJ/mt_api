const express = require('express');

const router = express.Router();

const claimsController = require("../Controllers/claimsController")
const commentController = require("../Controllers/commentController")
const loginController = require("../Controllers/loginUserController");
const uploadDocumentController = require("../Controllers/uploadDocumentController")

router.post("/addComment", commentController.addComment);
router.get("/getAllClaims", claimsController.getAllClaims);
router.get("/getComments", commentController.getComments);
router.get("/getDocuments", uploadDocumentController.getDocuments)
router.post("/loginUser", loginController.loginUser);
router.post("/uploadDocument", uploadDocumentController.uploadDocument)

module.exports = router;