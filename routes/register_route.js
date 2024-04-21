const express = require("express");
const router = express.Router();

const registerController = require("../controllers/registerController");
const auth_middleware = require("./../middlewares/auth_middleware.js");

router.get(
  "/register",
  //   auth_middleware.check_login,
  //   auth_middleware.check_admin,
  (req, res) => {
    return res.render("register", {
      message: "None",
    });
  }
);

router.post(
  "/register",
  //   auth_middleware.check_login,
  //   auth_middleware.check_admin,
  registerController
);

module.exports = router;
