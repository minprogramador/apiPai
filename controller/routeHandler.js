"use strict;";

module.exports = function (req, res, next) {
	if (true) {
		res.send(404, 'not found');
	}else{
		next();
	}
}