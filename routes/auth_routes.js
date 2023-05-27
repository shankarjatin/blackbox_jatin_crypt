const express = require("express");
const passport = require("passport");
const google_auth_controllers = require("./../controllers/google_auth_controller.js");

const router = express.Router();
const rateLimiter = require("../middlewares/rate_limiter.js").ipRateLimiter

router.get(
  "/auth/google",
  rateLimiter,
  google_auth_controllers.passport_google_authenticate
);

router.get(
  "/auth/google/cb",
  rateLimiter,
  google_auth_controllers.passport_google_callback
);

router.get("/login", rateLimiter, (req, res) => {
  res.render("login");
})

router.get("/logout", rateLimiter, (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
