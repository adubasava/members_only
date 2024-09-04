const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

async function register(req, res) {
  const errors = myValidationResult(req).array();
  console.log(errors);
  if (errors.length > 0) {
    return res.render("sign-up-form", {
      errorMessage: errors.join(" "),
    });
  }
  const { firstname, lastname, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(firstname, lastname, email, hashedPassword);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
};
