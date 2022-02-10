const express = require("express");
const router = express.Router();
const auth_routes = require("./auth_routes");

router.use("/",auth_routes);

router.get("/", (req,res)=>{
	res.send("Server is up and running");
})

module.exports = router;
