const mongoose = require("mongoose");
const Question = require("./../models/question");
const User = require("./../models/user.js");

exports.rules = (req, res) => {
	res.render("rules", {
		user: req.user
	});
}

exports.leaderboard = (req, res) => {
	res.render("leaderboard", {
		user: req.user
	});
}

exports.game = (req, res) => {
	if (req.user.level == process.env.MAX_LEVEL) {
		res.send("Well Done! You have solved all levels. <a href='/reset'>Reset</a>")
	} else {
		res.render("game", {
			user: req.user
		});
	}
}

exports.check = (req, res) => {
	const attempted_answer = req.body.answer;
	const userLevel = req.user.level;
	Question.find({
		level: userLevel
	}, function(err, result) {
		if (err) {
			console.log("Error in fetching answer");
			res.send("Some error occured");
		} else {
			User.findById(req.user._id, function(err, result2) {
				if (attempted_answer == result[0].answer) {
					result2.level += 1;
					result2.save(function() {
						res.redirect("/game");
					});
				} else {
					res.redirect("/game");
				}
			})
		}
	})
}
