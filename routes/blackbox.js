const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const blackbox_controller = require("./../controllers/blackbox_controller.js");

router.get("/blackbox", 
    game_middleware.check_game_timing, 
    auth_middleware.check_login,
    auth_middleware.check_registration,
    blackbox_controller.getBlackbox
)

router.post("/blackbox", 
    game_middleware.check_game_timing, 
    auth_middleware.check_login,
    auth_middleware.check_registration,
    blackbox_controller.postBlackbox
)

router.post("/add-question", 
    auth_middleware.check_login,
    auth_middleware.check_registration, // admin needs to be registered as a team too !!!
    auth_middleware.check_admin, 
    blackbox_controller.add_question
);

//input evaluation
router.post("/black_ques", 
    auth_middleware.check_login,
    auth_middleware.check_registration,
    game_middleware.check_game_timing,
    blackbox_controller.black_ques
);

router.post("/submit_blackbox", 
    auth_middleware.check_login,
    auth_middleware.check_registration,
    game_middleware.check_game_timing,
    [
        body(`user_expression`).notEmpty().trim()
    ], 
    blackbox_controller.submit_blackbox
);

router.get("/blackbox_leaderboard",
    // remove this comment after making sure check_registration is not needed
    blackbox_controller.leaderboard
);

module.exports = router;