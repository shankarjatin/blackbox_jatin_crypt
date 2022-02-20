exports.rules = (req, res) => {
	res.render("rules", {
		user: req.user
	});
}

exports.leaderboard =	(req, res) => {
		res.render("leaderboard", {
			user: req.user
		});
	}

exports.game = (req, res) => {
		res.render("game", {
			user: req.user
		});
	}
