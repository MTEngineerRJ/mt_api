const express = require('express');

const router = express.Router();

const emailController = require("../Controllers/emailController");
const authenticateUser = require('../Middleware/authenticateUser');

router.post("/sendEmail/1", authenticateUser,emailController.sendEmail1);

router.post("/sendCustomEmail", authenticateUser,emailController.sendCustomEmail);

router.post("/acknowledgmentEmail", authenticateUser,emailController.acknowledgmentMail);

router.post("/sendEmail/2", authenticateUser,emailController.sendEmail2);

router.post("/sendEmail/3", authenticateUser,emailController.sendEmail3);


module.exports = router;