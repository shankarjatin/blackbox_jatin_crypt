exports.check_login = (req, res, next)=>{
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect("/login");
	}
}
