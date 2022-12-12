const register= require('../models/register.js');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
	try {
	const verify = await jwt.verify(req.cookies.jwt, process.env.SECRET)
	const user = await register.findOne({_id: verify});

	// req.token = token;
	// req.user = user;
	//console.log(user);
	next();
     }
     catch (e) {
     	res.redirect('/login');
     }
}

module.exports = auth;