const express = require("express");
const router = express.Router();
const game_controller = require("./../controllers/game_controllers.js");
const auth_middleware = require("./../middlewares/auth_middleware.js");
const game_middleware = require("./../middlewares/game_middleware.js");
const blackbox_controller = require("./../controllers/blackbox_controller.js");



router.post("/update-question", auth_middleware.check_login, auth_middleware.check_admin, game_controller.updateQuestion);

router.get("/add-crypt-questions",auth_middleware.check_login, auth_middleware.check_admin,game_controller.getQuestions);

router.post("/post-add-questions",auth_middleware.check_login, auth_middleware.check_admin,game_controller.add_crypt_questions);

router.get("/team-delete",auth_middleware.check_login, auth_middleware.check_admin,game_controller.get_delete_team);

router.post("/delete-team",auth_middleware.check_login, auth_middleware.check_admin,game_controller.delete_team);

router.post("/add-question",
    auth_middleware.check_login,
    auth_middleware.check_admin,
    blackbox_controller.add_question
);

router.get("/add-question",
    auth_middleware.check_login,
	auth_middleware.check_admin,
	blackbox_controller.add_question_black
)

module.exports = router;