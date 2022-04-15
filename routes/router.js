const express = require("express");
const router = express.Router();
const auth_routes = require("./auth_routes");
const game_routes = require("./game_routes.js");

router.use("/",auth_routes);
router.use("/",game_routes);

module.exports = router;
