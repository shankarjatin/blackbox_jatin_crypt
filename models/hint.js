const mongoose = require("mongoose");

const hint_schema = new mongoose.Schema({
    level: {
        type: Number,
        required: true
    },
    hint: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    }
})

const Hint = new mongoose.model("Hint", hint_schema);

module.exports = Hint;