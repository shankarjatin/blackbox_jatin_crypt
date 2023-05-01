const User = require("./../models/user");

exports.check_login = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/");
	}
}

exports.check_admin = (req, res, next) => {
	if (req.user.email == process.env.ADMIN_1_EMAIL || req.user.email == process.env.ADMIN_2_EMAIL) {
		next();
	}
	else {
		res.redirect("/");
	}
}

exports.check_registration = (req, res, next) => {

}