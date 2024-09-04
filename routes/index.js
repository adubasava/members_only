const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/", messageController.getMessages);

router.get("/new", messageController.renderForm);
router.post("/new", messageController.addNewMessage);

router.get("/message/:id", messageController.renderMessage);

module.exports = router;
