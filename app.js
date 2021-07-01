const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");
const routes = require("./routes");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

// -------------- GENERAL SETUP --------------

require("dotenv").config();
require("ejs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(logger("dev"));

// -------------- PASSPORT CONFIG --------------

require("./config/passport");

// -------------- SESSION SETUP --------------

const sessionStore = new MongoStore({
  mongoUrl: process.env.DB_STRING,
  collectionName: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// -------------- DB CONNECTION --------------

const conn = process.env.DB_STRING;

mongoose
  .connect(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("DB connected"));

// -------------- PASSPORT AUTH --------------

app.use(passport.initialize());
app.use(passport.session());

// -------------- ROUTES --------------

app.use(routes);

// -------------- SERVER --------------

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
