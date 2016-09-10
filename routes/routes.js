'use strict';
const express = require('express');
const router = express.Router();
const request_api = require('../yelp_api').request_api;
const mongoose = require('mongoose');
const passport = require('passport');
const Bars = require('../models/bars');
const User = require('../models/user');


router.get('/', (req, res, next)=>{
	if(req.session.user){
		User.findOne({username: req.session.user.username}, (err, user)=>{
			if(err) return next(err);
			res.render('index', {bars: req.session.bars, user: req.session.user, userBars: user});
		});
	}else{
		res.render('index');
	}
});

router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect("/");
  });

router.post('/', (req, res, next)=>{
	request_api({location: req.body.location}, (err,data)=>{
		if(err) throw err;	
		let jsonBody = JSON.parse(data.body);
		req.session.bars = jsonBody;
	});
	if(req.session.user){
		let promise = findUser(req.session.user.username);
		promise.then((user)=>{
			res.render('index', {bars: req.session.bars, user: req.session.user, userBars: user});
		});
	}

	res.render('index', {bars: req.session.bars});
});


router.post('/going', (req,res, next)=>{
	let name = req.body.name;
	let bar_id = req.body.bar;
	User.findOne({username: req.session.user.username}, (err, user)=>{
		if(err) return next(err);
		if(user.barsEvent.indexOf(bar_id) >= 0){
			let i = user.barsEvent.indexOf(bar_id);
			user.barsEvent.splice(i, 1);
		}else{
			user.barsEvent.push(bar_id);
		}

		user.save();
		res.render('index', {bars: req.session.bars, user: req.session.user, userBars: user});
	});
});

function findUser(username){
	let promise = User.find({username: username}).exec();
	return promise;
}

module.exports = router;