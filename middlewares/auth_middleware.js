const User = require("./../models/user");
const Team = require("../models/teams");

exports.check_login = async (req, res, next) => {
	const time = new Date();
	if (!req.isAuthenticated()) {
		return res.render("index", {
			message: "You need to log in first.",
			time_to_start: req.startTime - time // change if countdown timer doesn't work
		});
	}
	
	const team = req.user.team;
	if (team) {
		// Todo : remove this redundancy. It is already present in req.user
		// didn't do because it requires updating code in many places
		req.team = team;
		next();
	} else {
		res.render("index", {
			message: "You are not registered for the game.",
			time_to_start: req.startTime - time
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