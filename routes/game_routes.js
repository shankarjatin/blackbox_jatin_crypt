const express = require("express");
const router = express.Router();
const game_controller = require("./../controllers/game_controllers.js");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const controller = require("./../controllers/controller.js");
const leaderBoard = require("../controllers/leaderboard.js")
const rateLimit = require("../middlewares/rate_limiter.js");

router.get("/",
	rateLimit.ipRateLimiter,
	game_controller.index
);

// router.get("/home",
// 	controller.homeRoute
// )

router.get("/rules",
	rateLimit.ipRateLimiter,
	game_controller.rules
);
router.get("/home",
	game_middleware.check_game_timing,
	auth_middleware.check_login,
	rateLimit.rateLimiter,
	game_controller.home
);
router.get("/about_us",
	rateLimit.ipRateLimiter,
	game_controller.about_us
);

router.get("/blackbox_leaderboard",
	rateLimit.ipRateLimiter,
	leaderBoard.blackbox)

router.get("/original_leaderboard",
	rateLimit.ipRateLimiter,
	leaderBoard.original
);

router.get("/crypthunt_leaderboard",
	rateLimit.ipRateLimiter,
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

router.get("/test", function (req, res) {
	res.send(req.isAuthenticated())
});

module.exports = router;
