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

app.use(morgan("short"));
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
app.use(middleware.error404);

app.listen(process.env.PORT || 8000, function() {
	console.log("Server started at port 8000.");
});
