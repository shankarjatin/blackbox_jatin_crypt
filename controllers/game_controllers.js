const mongoose = require("mongoose");
const Question = require("./../models/question");
const User = require("./../models/user.js");
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

exports.leaderboard = (req, res) => {
	console.log("req at leaderboard");
	User.find({}).lean().sort({
		level: -1
	}).exec(function (err, result) {
		if (err) {
			res.send("Some error occured in fetching leaderboard");
		} else {
			/*
			 * Below code is for calculating rank from sorted
			 * players data fetched from database
			 *  --> Players on equal level will have equal ranks.
			 */
			var rank = 0
			var current_rank = 0
			var level = 100;
			result.forEach((person, index) => {
				rank += 1;
				if (person.level != level) {
					result[index].rank = rank;
					current_rank = rank;
				} else {
					result[index].rank = current_rank;
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

exports.original_leaderboard = (req, res) => {
	res.render("original_leaderboard");
}

exports.submit = (req, res) => {
	req.user.submitted = true;
	req.user.save(function () {
		res.redirect("/final-leaderboard");
	})
}

exports.game = (req, res) => {
	var time = new Date();
	Game.findOne({ title: process.env.GAME_TITLE }, function (err, result) {
		if (err) {
			res.send("Error in fetching game");
		} else {
			if (req.user.submitted == true) {
				message = "You have already submitted. Please check your rank in the leaderboard";
				req.logout();
				var time_to_start = result.startTime - time;
				res.render("index", {
					message: message,
					time_to_start: time_to_start
				});
			}
			else if (req.user.level == process.env.MAX_LEVEL) {
				message = "Well Done! You have solved all levels. Please check your rank in the leaderboard";
				var time_to_start = result.startTime - time;
				console.log(time_to_start);
				res.render("index", {
					message: message,
					time_to_start: time_to_start
				});
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
	var attempted_answer = req.body.answer;
	attempted_answer = attempted_answer.replace(/\s/g, "").toLowerCase();
	console.log(attempted_answer);
	const userLevel = req.user.level;

	Game.findOne({ title: process.env.GAME_TITLE }, function (err, game_result) {
		if (err) {
			res.send("Error in fetching game");
		} else {
			if (req.user.submitted == true) {
				message = "You have already submitted. Please check your rank in the leaderboard";
				req.logout();
				var time_to_start = game_result.startTime - time;
				res.render("index", {
					message: message,
					time_to_start: time_to_start
				});
			} else {
				Question.find({
					level: userLevel
				}, function (err, result) {
					if (err) {
						console.log("Error in fetching answer");
						res.send("Some error occured");
					} else {
						User.findById(req.user._id, function (err, result2) {
							const attempt = {
								level: result2.level,
								answer: attempted_answer,
							}
							if (attempted_answer == result[0].answer) {
								result2.attempts.push(attempt);
								User.findOneAndUpdate({_id:result2._id},{$inc:{score:result[0].credit}}).then(update=>{
									console.log(update);
								}).catch(err=>{
									throw err;
								})
								result2.level += 1;
								result2.save(function () {
									res.redirect("/game");
								});
							} else {
								result2.attempts.push(attempt);
								result2.save(function () {
									message = "Wrong Answer";
									var remaining_time = game_result.endTime - time;
									res.render("game", {
										user: req.user,
										message: message,
										remaining_time: remaining_time
									});
								});
							}
						})
					}
				})
			}
		}
	})
}

exports.get_hints = (req, res) => {
	Hint.find({}, function (err, result) {
		if (err) {
			res.send("Error in fetching hints");
		} else {
			res.render("hints", {
				user: req.user,
				hints: result
			})
		}
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
	const { level, hint } = req.body;

	const new_hint = new Hint({
		level: level,
		hint: hint
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
	const {id} = req.body ;
	Hint.findByIdAndDelete(id, function (err) {
		if (err) {
			res.send("Error in deleting hint");
		} else {
			res.redirect("/hint_manager");
		}
	})
}

exports.updateQuestion=(req,res,next)=>{
	const {level,credit}=req.body;
	Question.findOneAndUpdate({level:level},{credit:credit}).then(updated=>{
		res.status(204).json({
			message:"updated Successfully",
			question:updated,
		})
	}).catch(err=>{
		throw err;
	})
}

// exports.finalLeaderBoard=(req,res,next)=>{
// 	User.find({}).lean().sort({score:-1}).select("name score -_id").then(result=>{
// 		console.log(result);
// 		res.status(200).json({
// 			message:"fetched Succeddfully",
// 			result:result,
// 		})
// 	}).catch(err=>{
// 		throw err;
// 	})
// }

exports.finalLeaderBoard = (req, res) => {
	console.log("req at leaderboard");
	User.find({}).lean().sort({score:-1}).select("name score -_id").exec(function (err, result) {
		if (err) {
			res.send("Some error occured in fetching leaderboard");
		} else {
			/*
			 * Below code is for calculating rank from sorted
			 * players data fetched from database
			 *  --> Players on equal level will have equal ranks.
			 */
			var rank = 0
			var current_rank = 0
			var score = 100;
			result.forEach((person, index) => {
				rank += 1;
				if (person.score != score) {
					result[index].rank = rank;
					current_rank = rank;
				} else {
					result[index].rank = current_rank;
				}
				score = person.score;
			})

			res.render("final_leaderboard", {
				user: req.user,
				leaderboard: result
			})
		}
	});
}