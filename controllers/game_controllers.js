const mongoose = require("mongoose");
const Question = require("./../models/question");
const User = require("./../models/user.js");
const Game = require("./../models/game");

exports.rules = (req, res) => {
	res.render("rules", {
		user: req.user
	});
}

exports.leaderboard = (req, res) => {
	console.log("req at leaderboard");
	User.find({}).lean().sort({
		level: -1
	}).exec(function(err, result) {
		if (err) {
			res.send("Some error occured in fetching leaderboard");
		} else {
			/*
			 * Below code is for calculating rank from sorted
			 * players data fetched from database
			 *  --> Players on equal level will have equal ranks.
			 */
			var rank = 0
			var level = 100;
			result.forEach((person, index) => {
				if (person.level != level) {
					rank += 1;
					result[index].rank = rank;
				} else {
					result[index].rank = rank;
				}
				level = person.level;
			})
			
			res.render("leaderboard", {
				user: req.user,
				leaderboard: result
			})
		}
	});
}

exports.submit = (req, res) => {
	console.log(req.user);
	req.user.submitted = true;
	req.user.save(function() {
		res.redirect("/leaderboard");
	})
}

exports.game = (req, res) => {
	var time = new Date();
	Game.findOne({title: process.env.GAME_TITLE}, function(err, result) {
		if(err){
			res.send("Error in fetching game");
		} else {
			if (req.user.submitted == true){
				message = "You have already submitted. Please check your rank in the leaderboard";
				req.logout();
				res.render("index", {
					message: message
				});
			}
			else if (req.user.level == process.env.MAX_LEVEL) {
				res.send("Well Done! You have solved all levels. <a href='/reset'>Reset</a>")
			} else {
				message = "None";
				var remaining_time = result.endTime - time;
				res.render("game", {
					user: req.user,
					message: message,
					remaining_time: remaining_time
				});
			}
		}
	})
}

exports.check = (req, res) => {
	var time = new Date();
	const attempted_answer = req.body.answer;
	const userLevel = req.user.level;

	Game.findOne({title: process.env.GAME_TITLE}, function(err, game_result) {
		if(err){
			res.send("Error in fetching game");
		} else {
			if (req.user.submitted == true){
				message = "You have already submitted. Please check your rank in the leaderboard";
				req.logout();
				res.render("index", {
					message: message
				});
			} else {
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
								message = "Wrong Answer";
								var remaining_time = game_result.endTime - time;
								res.render("game", {
									user: req.user,
									message: message,
									remaining_time: remaining_time
								});
							}
						})
					}
				})
			}
		}
	})
}
