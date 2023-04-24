require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./user");

const DB = process.env.DB_URI;
//const DB = "mongodb://localhost:27017/crypthunt";
//connecting with db
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Sucessful");
  })
  .catch((err) => console.log(err));

module.exports = User;
