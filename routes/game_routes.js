const express = require("express");
const router = express.Router();
const game_controller = require("./../controllers/game_controllers.js");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const controller = require("./../controllers/controller.js");
router.get("/",
	game_controller.index
);

router.get("/home",
controller.homeRoute
)



router.get("/rules",
	game_controller.rules
);

router.get("/leaderboard",
	game_controller.leaderboard
);

router.get("/original_leaderboard",
	game_controller.original_leaderboard
);

router.get("/game",
	auth_middleware.check_login,
	game_middleware.check_game_timing,
	game_controller.game
);

router.post("/game",
	auth_middleware.check_login,
	game_middleware.check_game_timing,
	game_controller.check
);

router.post("/submit",
	auth_middleware.check_login,
	game_controller.submit
);

router.get("/submit",
	auth_middleware.check_login,
	game_controller.submit
);

router.get("/hints",
	game_controller.get_hints
)

router.get("/hint_manager",
	auth_middleware.check_login,
	auth_middleware.check_admin,
	game_controller.hint_manager
)

router.post("/hints",
	auth_middleware.check_login,
	auth_middleware.check_admin,
	game_controller.submit_hint
)

router.post("/delete_hint",
	auth_middleware.check_login,
	auth_middleware.check_admin,
	game_controller.delete_hint
)


router.get("/test", function (req, res) {
	res.send(req.isAuthenticated())
});

module.exports = router;
