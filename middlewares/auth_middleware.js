const User = require("./../models/user");
const Team = require("../models/teams");

exports.check_login = async (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.render("index", {
			message: "You need to log in first.",
			time_to_start: req.remainingTime
		});
	}
	
	const team = await Team.findOne({ "$or": [{ leader_email: req.user.email }, { member_email: req.user.email }] });
	if (team) {
		req.team = team; // attaching team to req
		next();
	} else {
		res.render("index", {
			message: "You are not registered for the game.",
			time_to_start: req.remainingTime
		});
	}
}

exports.check_admin = (req, res, next) => {
	if (req.user.email == process.env.ADMIN_1_EMAIL || req.user.email == process.env.ADMIN_2_EMAIL || req.user.email == process.env.ADMIN_3_EMAIL || req.user.email == process.env.ADMIN_4_EMAIL) {
		next();
	}
	else {
		res.redirect("/");
	}
}