const express = require("express");
const router = express.Router();
const game_controller = require("./../controllers/game_controllers.js");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const controller = require("./../controllers/controller.js");
const blackbox_controller = require("./../controllers/blackbox_controller.js");
router.get("/blackbox",
blackbox_controller.FirstPage
)

router.post("/add-question",blackbox_controller.add_question);
module.exports = router;