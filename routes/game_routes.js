const express = require("express");
const router = express.Router();
const game_controller = require("./../controllers/game_controllers.js");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const controller = require("./../controllers/controller.js");
const leaderBoard = require("../controllers/leaderboard.js")
const rateLimit = require("../middlewares/rate_limiter.js");

router.get("/",
	game_controller.index
);

// router.get("/home",
// 	controller.homeRoute
// )

router.get("/rules",
	game_controller.rules
);
router.get("/home",
	game_middleware.check_game_timing,
	auth_middleware.check_login,
	rateLimit.rateLimiter,
	game_controller.home
);
router.get("/about_us",
	// rateLimit.rateLimiter,
	game_controller.about_us
);

router.get("/blackbox_leaderboard",
	leaderBoard.blackbox)

router.get("/original_leaderboard",
	leaderBoard.original
);

router.get("/crypthunt_leaderboard",
	leaderBoard.crypthunt);

router.get("/game",
	game_middleware.check_game_timing,
	auth_middleware.check_login,
	rateLimit.rateLimiter,
	game_controller.game
);

router.post("/game",
	game_middleware.check_game_timing,
	auth_middleware.check_login,
	rateLimit.rateLimiter,
	game_controller.check
);

router.post("/submit",
	auth_middleware.check_login,
	rateLimit.rateLimiter,
	game_controller.submit
);

router.get("/submit",
	auth_middleware.check_login,
	rateLimit.rateLimiter,
	game_controller.submit
);

router.post("/get_hints",
	auth_middleware.check_login,
	rateLimit.rateLimiter,
	game_controller.get_hints
)

router.get("/hint_manager",
	auth_middleware.check_login,
	auth_middleware.check_admin,
	rateLimit.rateLimiter,
	game_controller.hint_manager
)

router.post("/hints",
	auth_middleware.check_login,
	auth_middleware.check_admin,
	rateLimit.rateLimiter,
	game_controller.submit_hint
)

router.post("/delete_hint",
	auth_middleware.check_login,
	auth_middleware.check_admin,
	rateLimit.rateLimiter,
	game_controller.delete_hint
)


router.get("/test", function (req, res) {
	res.send(req.isAuthenticated())
});

module.exports = router;
