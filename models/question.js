const mongoose = require("mongoose");

const question_schema = new mongoose.Schema({
	qn : Number,
	level :Number,
	img : String,
	answer :String,
});

const Question = new mongoose.model("Question", question_schema);

module.exports = Question;

/*const qn = new Question({
	qn : 2,
	level: 2,
	img : "r2.png",
	answer : "starwars",
})

qn.save();*/
