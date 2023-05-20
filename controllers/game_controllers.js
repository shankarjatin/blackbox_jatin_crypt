const mongoose = require("mongoose");
const Question = require("./../models/question");
const User = require("./../models/user.js");
const Team = require("./../models/teams.js");
const Game = require("./../models/game");
const Hint = require("./../models/hint");

exports.index = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect("/game");
	} else {
		var time = new Date();
		Game.findOne({ title: process.env.GAME_TITLE }, function (err, result) {
			if (err) {
				res.send("Error in fetching game");
			} else {
				message = "None";
				var time_to_start = result.startTime - time;
				console.log(time_to_start);
				res.render("index", {
					message: message,
					time_to_start: time_to_start
				});
			}
		});
	}
};

exports.rules = (req, res) => {
	res.render("rules", {
		user: req.user
	});
}
exports.home = (req, res) => {
	res.render("home", {
		user: req.user
	});
}
exports.About = (req, res) => {
	res.render("Aboutpage")
}
	


exports.submit = (req, res) => {
	req.user.team.submitted = true;
	req.user.team.save(function (err) {
		res.redirect("/");
	})
}

exports.game = (req, res) => {
	var time = new Date();

	if (req.user.team.submitted == true) {
		message = "You have already submitted. Please check your rank in the leaderboard";
		req.logout();
		var time_to_start = req.startTime - time;
		res.render("index", {
			message: message,
			time_to_start: time_to_start
		});
	}
	else if (req.user.team.level >= process.env.MAX_LEVEL) {
		message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
		var time_to_start = req.startTime - time;
		res.render("game", {
			redirectUrl: "/home",
			user: req.user,
			level: req.team.level,
			message: message,
			remaining_time: remaining_time
		})
	} else {
		message = "None";
		var remaining_time = req.endTime - time;
		res.render("game", {
			redirectUrl: "",
			user: req.user,
			level: req.team.level,
			message: message,
			remaining_time: remaining_time
		});
	}

}

exports.check = async (req, res) => {
	var time = new Date();
	var attempted_answer = req.body.answer.replace(/\s/g, "").toLowerCase();
	const startTime = req.startTime;
	const endTime = req.endTime;
	const team = req.team;

	if (req.user.team.submitted == true) {
		message = "You have already submitted. Please check your rank in the leaderboard";
		req.logout();
		var time_to_start = startTime - time;
		return res.render("index", {
			message: message,
			time_to_start: time_to_start
		});
	}

	const question = await Question.find({ level: req.team.level });

	if (!question) {
		return res.send("Some Error occurred") //Todo : Implement error page.
	}

	const attempt = {
		level: team.level,
		answer: attempted_answer
	}

	if (attempted_answer == question[0].answer) {
		team.attempts.push(attempt);
		team.level += 1;  //increment crypthunt level
		team.score += question[0].credit;  //increment team score
		await team.save();
		res.redirect("/game"); // redirect will load the next level automatically.
	} else {
		team.attempts.push(attempt);
		await team.save();
		var remaining_time = endTime - time;
		res.render("game", {
			redirectUrl: "",
			user: req.user,
			level: req.team.level,
			message: "Wrong Answer",
			remaining_time: remaining_time
		});
	}
}

exports.get_hints = async (req, res) => {
	console.log(req.body);
	await Hint.find({ level: req.body.level, game: req.body.game }
	).then((data) => {
		res.json({ result: data });
	}).catch((err) => {
		console.log(err);
		res.json({
			error: err
		})
	})
}



exports.hint_manager = (req, res) => {
	Hint.find({}, function (err, result) {
		if (err) {
			res.send("Error in fetching hints");
		} else {
			res.render("hint_manager", {
				user: req.user,
				hints: result
			})
		}
	})
}


exports.submit_hint = (req, res) => {
	console.log(req.body);
	const { game, level, hint } = req.body;

	const new_hint = new Hint({
		level: level,
		hint: hint,
		game: game
	})

	new_hint.save(function (err) {
		if (err) {
			console.log(err);
			res.send("Error in saving hints");
		} else {
			res.redirect("/hint_manager");
		}
	})
}

exports.delete_hint = (req, res) => {
	const { id } = req.body;
	Hint.findByIdAndDelete(id, function (err) {
		if (err) {
			res.send("Error in deleting hint");
		} else {
			res.redirect("/hint_manager");
		}
	})
}

exports.updateQuestion = (req, res, next) => {
	const { level, credit } = req.body;
	Question.findOneAndUpdate({ level: level }, { credit: credit }).then(updated => {
		res.status(204).json({
			message: "updated Successfully",
			question: updated,
		})
	}).catch(err => {
		throw err;
	})
}
