const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const router = require('./routes/articles');
const mongoose = require('mongoose');
const article = require('./models/article');
const data = require('./models/register');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/bog2', {
	useNewUrlParser: true, useUnifiedtopology: true
});

app.set("view engine", 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use("/articles", router);

app.get('/', auth, async (req, res) => {
	try {
	console.log("Connected");
	
	const blogs = await article.find().sort({date: 'desc'});
	res.render('index', {articles: blogs});
}
catch(e) {
	console.log(e);
}
})

app.get('/login', (req, res) => {
	res.render('login');
})

app.post('/login', async (req, res) => {
	try {
		const key = await data.findOne({email: req.body.email});
		const match = await bcryptjs.compare(req.body.password, key.password);
	if(match)
	{
		const token = await key.getdata();
		// console.log("token" + token);
		//console.log(bcryptjs.compare(req.body.password, key.password))
		res.cookie('jwt', token);
		res.redirect('/');
	}
	else
	{
		//console.log(bcryptjs.compare(req.body.password, key.password))
		//console.log("login");
		res.redirect("/login");
	}
	}
	catch(e) {
		res.send("Invalid Details")
		console.log("Invalid Details");
	}
})

app.get('/signup', (req, res) => {
	res.render('signup');
})

app.post('/signup', async (req, res) => {
	if(req.body.password == req.body.cpassword)
	{
	try {
		let details = new data({
		email: req.body.email,
		password: req.body.password,
		cpassword: req.body.cpassword
	})
		const token = await details.getdata();
		console.log("token" + token);
	await details.save();
	res.cookie('jwt', token);
	//console.log(cookie);
	res.redirect('/');
	}

	catch(e)
	{
		console.log(e);
	}
}
    else
    {
    	res.redirect('/sigunp');
    }

})

app.get('/account', auth, async (req, res) => {
	const verify = await jwt.verify(req.cookies.jwt, process.env.SECRET)
	const user = await data.findOne({_id: verify});
	const articles = await article.find({email: user.email});
	const users = user.email;
	//console.log(articles);
	res.render('account', {articles, users});
})

app.get('/logout', (req, res) => {
  res.clearCookie('jwt');
 // console.log(req.user);
  res.redirect('login');
})
app.listen(3000);