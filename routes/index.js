const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const isAuth = require("../lib/userUtils").isAuth;
const isLoggedin = require("../lib/userUtils").isLoggedin;
const isUser = require("../lib/userUtils").isUser;
const User = require("../models/UserModel");

// -------------- POST ROUTES --------------

router.post(
  "/login",
  isUser,
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/bookmarks",
  })
);

router.post("/register", (req, res) => {
  const genSaltHash = genPassword(req.body.password);

  const salt = genSaltHash.salt;
  const hash = genSaltHash.hash;

  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    hash: hash,
    salt: salt,
  });

  newUser.save().then(res.redirect("secrets"));
});

// -------------- GET ROUTES --------------

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", isLoggedin, (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get("/bookmarks", isAuth, (req, res) => {
  var cuki = req.session.cookie;
  cuki = {
    cocaina: true,
  };
  req.session.cookie = cuki;
  console.log(req.session);

  const user = req.session.passport.user;
  res.render("secrets", { name: user.name, id: user.id });
});

module.exports = router;
