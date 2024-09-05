const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const messageController = require("../controllers/messageController");

const emptyErr = "should not be empty!";

const validateMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(`Title ${emptyErr}`)
    .isLength({ max: 20 })
    .withMessage(`Too long! Title must be at maximum 20 characters long!`),
  body("text").trim().notEmpty().withMessage(`Text ${emptyErr}`),
];

router.post("/:id/delete", messageController.deleteMessage);
router.get("/new", messageController.renderForm);
router.post("/new", [validateMessage], messageController.addNewMessage);

module.exports = router;
