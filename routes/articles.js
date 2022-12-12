const express = require('express');
const router = express.Router();

const Article = require('./../models/article');
const register = require('../models/register');
const jwt = require('jsonwebtoken');



router.get('/new', (req, res) => {
	res.render("new", {article: new Article()});
})



router.get('/:slug', async (req, res) => {
	const article = await Article.findOne({slug: req.params.slug});
	if(article == null) res.redirect('/');

console.log("Hello");
console.log(article.description);
	res.render('show', {article: article});
})


router.post('/', async (req, res, next) => {
	req.article = new Article();
	next()
}, Save('new'))



      router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})



      router.get('/edit/:id', async (req, res) => {
     const article = await Article.findById(req.params.id);
	res.render('edit', {article:article});
})



      router.put('/:id', async (req, res, next) => {
      	req.article = await Article.findById(req.params.id)
      	next()
      }, Save('edit'))

      function Save(path)
      {
      	return async (req, res) => {
          const verify = await jwt.verify(req.cookies.jwt, process.env.SECRET)
  const user = await register.findOne({_id: verify});
  console.log(user);
  // if(!verify) {res.redirect('/login');}
      		let article = req.article
		article.title = req.body.title
		article.markdown = req.body.markdown
		article.description = req.body.description
    article.email = user.email

	try {
	article = await article.save();
	res.redirect('/articles/' + article.slug);
      }
      catch (e) {
      	console.log(e);
      	res.redirect('/articles/' + path, {article:article});
      }
      	}
      }

module.exports = router;