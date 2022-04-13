const Game = require("./../models/game");

exports.check_game_timing = (req, res, next) => {
	const game_title = process.env.GAME_TITLE;

	Game.findOne({ title: game_title }, function (err, result) {
		var time = new Date();
		if (err) {
			console.log(err);
			res.status(500).send("Internal Server Error. Can't find game");
		}
		else {
			if (time > result.startTime) {
				if (time < result.endTime) {
					next();
				}
				else {
					console.log(time);
					console.log(result.endTime);
					message = "Game has ended. ";
					res.render("index", {
						message: message
					});
				}
			}
			else {
				message = "Game has not started yet";
				res.render("index", {
					message: message
				});
			}
		}
	})
}