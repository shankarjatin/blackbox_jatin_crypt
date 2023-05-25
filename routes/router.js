const express = require("express");
const router = express.Router();
const auth_routes = require("./auth_routes");
const game_routes = require("./game_routes.js");
const blackbox = require("./blackbox.js");
const register = require("./register_route");
const admin_routes=require("../routes/admin_routes");

router.use("/", admin_routes);
router.use("/", auth_routes);
router.use("/", game_routes);
router.use("/", blackbox);
router.use("/", register);

module.exports = router;
