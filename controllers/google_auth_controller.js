const passport = require("passport");

exports.passport_google_authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.passport_google_callback = passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/game",
});
