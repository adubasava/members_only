const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const db = require("../db/queries");
const passport = require("passport");

const mainController = require("../controllers/mainController");

const alphaErr = "must only contain letters and hyphens!";

const validateUser = [
  body("firstname")
    .trim()
    .isAlpha("en-US", { ignore: "-" })
    .withMessage(`First name ${alphaErr}`),
  body("lastname")
    .trim()
    .isAlpha("en-US", { ignore: "-" })
    .withMessage(`Last name ${alphaErr}`),
  body("email").custom(async (value) => {
    const user = await db.findUserByEmail(value);
    if (user.length > 0) {
      throw new Error("E-mail already in use");
    }
  }),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage(`The password must be at least 5 characters long`),
  body("passwordConfirmation")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return value === req.body.password;
    }),
];

const check = passport.authenticate("local", {
  failureRedirect: "/log-in",
  failureMessage: true,
});

router.get("/", mainController.renderIndexPage);
router.get("/sign-up", mainController.renderRegisterForm);
router.post("/sign-up", [validateUser], mainController.register);

router.get("/log-in", mainController.renderLoginForm);
router.post("/log-in", [check], mainController.login);

router.get("/log-out", mainController.logout);

module.exports = router;
