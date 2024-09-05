const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { validationResult } = require("express-validator");
const passport = require("passport");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

async function renderIndexPage(req, res) {
  try {
    const messages = await db.getAllMessages();
    res.render("index", { user: req.user, messages: messages });
  } catch {
    res.redirect("/");
  }
}

async function renderRegisterForm(req, res) {
  try {
    res.render("sign-up-form", {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    });
  } catch {
    res.redirect("/");
  }
}

async function register(req, res, next) {
  const errors = myValidationResult(req).array();
  const { firstname, lastname, email, isadmin, password } = req.body;
  if (errors.length > 0) {
    return res.render("sign-up-form", {
      errorMessage: errors.join(" "),
      firstname: firstname,
      lastname: lastname,
      email: email,
      isadmin: isadmin,
      password: password,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(firstname, lastname, email, isadmin, hashedPassword);
    res.render("login", { email: email, password: password });
  } catch (err) {
    return next(err);
  }
}

async function renderLoginForm(req, res, next) {
  res.render("login", { email: "", password: "" });
}

async function login(req, res) {
  res.redirect("/");
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
