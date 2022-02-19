require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./user");

const DB ="mongodb+srv://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@cluster0.7oiby.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//connecting with db
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Sucessful");
  })
  .catch((err) => console.log(err));

module.exports = User;
