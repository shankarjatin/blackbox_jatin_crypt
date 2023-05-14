const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const blackbox_controller = require("./../controllers/blackbox_controller.js");

router.get("/blackbox", 
    game_middleware.check_game_timing, 
    auth_middleware.check_login,
    blackbox_controller.getBlackbox
)

router.post("/blackbox", 
    game_middleware.check_game_timing, 
    auth_middleware.check_login,
    blackbox_controller.postBlackbox
)

router.post("/add-question", 
    auth_middleware.check_login,
    auth_middleware.check_admin, 
    blackbox_controller.add_question
);

//input evaluation
router.post("/black_ques", 
    auth_middleware.check_login,
    game_middleware.check_game_timing,
    blackbox_controller.black_ques
);

router.post("/submit_blackbox", 
    auth_middleware.check_login,
    game_middleware.check_game_timing,
    [
        body(`user_expression`).notEmpty().trim()
    ], 
    blackbox_controller.submit_blackbox
);

router.get("/blackbox_leaderboard", 
    blackbox_controller.leaderboard
);

module.exports = router;