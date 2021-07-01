const User = require("../models/UserModel");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("login");
  }
};

const isLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/secrets");
  } else {
    next();
  }
};

const isUser = (req, res, next) => {
  const username = req.body.username;

  User.findOne({ username: username }).then((user) => {
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
  });
};

module.exports.isAuth = isAuth;
module.exports.isLoggedin = isLoggedin;
module.exports.isUser = isUser;
