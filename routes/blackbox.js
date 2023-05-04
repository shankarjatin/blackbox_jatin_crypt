const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const game_controller = require("./../controllers/game_controllers.js");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const controller = require("./../controllers/controller.js");



const blackbox_controller = require("./../controllers/blackbox_controller.js");
router.get("/blackbox", game_middleware.check_game_timing, auth_middleware.check_login,
    blackbox_controller.FirstPage
)

router.post("/add-question", blackbox_controller.add_question);

//input evaluation
router.post("/black_ques", blackbox_controller.black_ques);

router.post("/submit_blackbox", [body(`user_expression`).notEmpty().trim()], blackbox_controller.submit_blackbox);

router.get("/blackbox_leaderboard", blackbox_controller.leaderboard);

module.exports = router;