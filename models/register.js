const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const data = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},

	password: {
		type: String,

		required: true
	},
	 cpassword: {

	 	type: String,
	 	required: true
	 },
	 tokens: [{
	 	token: {
	 	type: String,
	 	required: true
	 }
	 }]
})

data.methods.getdata = async function() {
	try {
	const token = jwt.sign(this._id.toString(), process.env.SECRET);
	console.log("Id" + token);
	this.tokens = this.tokens.concat({token: token});
	await this.save();
	return token;
    }
    catch (e)
    {
    	console.log(e);
    }
}

data.pre('save', async function(next) {
	if(this.isModified('password'))
	{
	this.password = await bcrypt.hash(this.password, 8);
	this.cpassword = this.password;
	//console.log(this.password);
    }
	next();
})

module.exports = mongoose.model('Data', data);