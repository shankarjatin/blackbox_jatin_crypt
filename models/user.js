require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const Team = require("./teams");

const userSchema = new mongoose.Schema({
	name: String,
	alias: String,
	email: String,
	googleId: String,
},
	{ timestamps: true }
);

userSchema.pre('save', function (next) {
	// Convert the email to lowercase
	this.email = this.email.toLowerCase();
	next();
});

userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(new GoogleStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: "/auth/google/cb",
	userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
},
	function (accessToken, refreshToken, profile, cb) {
		// console.log(profile);
		User.findOrCreate({
			googleId: profile.id,
			username: profile.id,
			email: profile.emails[0].value,
			name: profile.displayName,
		},
			function (err, user) {
				return cb(err, user);
			});
	}));

// Below code is for putting info into cookie and for cracking open cookie to
// find info
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
	User.findById(id, async function (err, user) {
		const team = await Team.findOne({ "$or": [{ leader_email: user.email.toLowerCase() }, { member_email: user.email.toLowerCase() }] });
		if (team) {
			user.team = team; // attaching team to req
		} else {
			/*
				if team is not found i.e user is not registered for the game
				then we set req.user.team as null
				check_login middleware will check if req.user.team is null or not
				if it is null then it will render the index page with message "You are not registered for the game."
			*/
			user.team = null;
		}
		done(err, user);
	});
});

module.exports = User;
