const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel");
const validPassword = require("../lib/passwordUtils").validPassword;

// -------------- STRETEGY CONFIG --------------

const verifyCallback = (username, password, done) => {
  User.findOne({ username: username })
    .then((user) => {
      const isValid = validPassword(password, user.hash, user.salt);
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err));
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

// -------------- SERIALISATION CONFIG --------------

passport.serializeUser((user, done) => {
  done(null, { id: user.id, name: user.name });
});

passport.deserializeUser((user, done) => {
  User.findById(user.id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});
