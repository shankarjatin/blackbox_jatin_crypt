require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
	name: String,
	alias: String,
	email: String,
	googleId: String,
	level: {
		type: Number,
		default: 1
	},
	score: {
		type: Number,
		default: 0
	},
	attempts: [],
	submitted: {
		type: Boolean,
		default: false
	}
},
	{ timestamps: true }
);

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

passport.deserializeUser(function (
	id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = User;
