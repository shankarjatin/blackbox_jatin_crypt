const path = require("path");
const fs = require("fs");

exports.assets = (req, res, next) => {
	/*
	 * This middleware function is for serving static files,
	 * located in "assets" folder
	 * assets
	 *  |--public
	 *  |--private
	 *
	 *  for assets located in public folder it serves them without any
	 *  extra conditions,
	 *  however for assets located in private folder, it serves them onlu when
	 *    #1 user is logged in
	 *    #2 user game level (i.e. req.user,level) is >= id of asset (i.e. <id>.ext)
	 * 
	 * **/
	const public_asset = req.url.substring(0, 8) == "/public/";
	const private_asset = req.url.substring(0, 9) == "/private/";

	console.log("asstets middleware");
	const filePath = path.join(__dirname, "..", "assets", req.url);
	fs.stat(filePath, function(err, fileInfo) {
		if (err) {
			next();
			return;
		}
		if (fileInfo.isFile() && public_asset) {
			res.sendFile(filePath);
		} else if (fileInfo.isFile() && private_asset && typeof req.user !== 'undefined' && req.url.substring(10, 11) <= req.user.level) {
			res.sendFile(filePath);
		} else {
			next();
		}
	});
}

exports.error404 = (req, res, next) => {
	res.status(404);
	res.send("404 not found / You don't have permission to access the file.");
}
