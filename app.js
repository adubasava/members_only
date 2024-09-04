const { Pool } = require("pg");
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
const bcrypt = require("bcryptjs");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

const indexRouter = require("./routes/index");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", indexRouter);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("app listening on port 3000!"));
