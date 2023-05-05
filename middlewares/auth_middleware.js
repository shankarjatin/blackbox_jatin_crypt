const User = require("./../models/user");
const Team = require("../models/teams");

exports.check_login = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/");
	}
}

exports.check_admin = (req, res, next) => {
	console.log("email", req.user.email);
	console.log(process.env.ADMIN_1_EMAIL, process.env.ADMIN_2_EMAIL);
	if (req.user.email == process.env.ADMIN_1_EMAIL || req.user.email == process.env.ADMIN_2_EMAIL) {
		next();
	}
	else {
		res.redirect("/");
	}
}

exports.check_registration = async (req, res, next) => {
	const user = await Team.findOne({ "$or": [{ leader_email: req.user.email }, { member_email: req.user.email }] });
	if (user) {
		next();
	}
	else {
		res.redirect("/");
	}
}