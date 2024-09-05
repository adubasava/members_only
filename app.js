if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
require("./auth/passport");
const pool = require("./db/pool");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new pgSession({
  pool: pool,
  createTableIfMissing: true,
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  }),
);

app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");

app.use("/", indexRouter);
app.use("/log-in", indexRouter);
app.use("/sign-up", indexRouter);
app.use("/sign-up", indexRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
