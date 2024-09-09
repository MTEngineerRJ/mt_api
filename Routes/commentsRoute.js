const express = require('express');

const router = express.Router();

const commentController = require("../Controllers/commentController");

router.post("/addComment", commentController.addComment);

router.get("/getCommentsById", commentController.getCommentsById);

module.exports = router;