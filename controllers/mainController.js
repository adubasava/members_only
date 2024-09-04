const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

async function renderIndexPage(req, res) {
  res.render("index", { user: req.user });
}

async function renderRegisterForm(req, res) {
  try {
    res.render("sign-up-form");
  } catch {
    res.redirect("/");
  }
}

async function register(req, res, next) {
  const errors = myValidationResult(req).array();
  if (errors.length > 0) {
    return res.render("sign-up-form", {
      errorMessage: errors.join(" "),
    });
  }
  const { firstname, lastname, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(firstname, lastname, email, hashedPassword);
    res.redirect("/users/membership");
  } catch (err) {
    return next(err);
  }
}

async function renderLoginForm(req, res, next) {
  res.render("login");
}

async function login(req, res) {
  res.render("index", { user: req.user });
}

async function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = {
  renderIndexPage,
  renderRegisterForm,
  renderLoginForm,
  register,
  login,
  logout,
};
