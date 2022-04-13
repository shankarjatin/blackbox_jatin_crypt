const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  startTime: Date,
  endTime: Date,
  description: String,
},
  { timestamps: true }
);

const Game = mongoose.model("Game", GameSchema);

module.exports = Game ;