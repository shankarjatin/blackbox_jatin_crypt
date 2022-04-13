const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const Router = require("./routes/router");
const middleware = require("./middlewares/middleware");

require("dotenv").config(); // for using env variables
require("./models/model");

const app = express();

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.urlencoded({
	extended: true
}));

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize()); // initialising passport
app.use(passport.session()); // making express use passport.sessions

app.use(middleware.assets);
app.use("/", Router);
///////// delete in production
const User = require("./models/user");
const auth_middleware = require("./middlewares/auth_middleware.js");
app.get("/reset", auth_middleware.check_login, function(req, res) {
	User.findById(req.user._id, function(err, result) {
		result.level = 1;
		result.save(function() {
			res.redirect("/");
		})
	})
})
////////
app.use(middleware.error404);

// const Game = require("./models/game");

// const newGame = new Game({
// 	title: "Test",
// 	startTime: 1649836980000,  
// 	endTime: 1649836980000,  
// 	description: "starts at 1:00 pm"
// });

// newGame.save();

app.listen(process.env.PORT || 8000, function() {
	console.log("Server started at port 8000.");
});
