'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes.js');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
var User = require('./models/user');
const MongoStore = require('connect-mongo')(session);
const app = express();


mongoose.connect("mongodb://Tagada85:kallon85@ds021026.mlab.com:21026/nightlife");
const db = mongoose.connection;
mongoose.Promise = global.Promise;


passport.use(new TwitterStrategy({
    consumerKey: 'xcs1oKNJo5FRDbgjXqYaMr24P',
    consumerSecret: 'YyWog5XnTD79aRbQQ0Qpoja6iICXwRibazzRiW3FLQ8GiCzSqB',
    callbackURL: "https://pure-cove-13344.herokuapp.com/auth/twitter/return"
  },
  function(token, tokenSecret, profile, done) {
    User.findOneAndUpdate({ username: profile.displayName},
    	{
    		username: profile.displayName
    	},
    	{upsert: true},
    	done);
 	}
));

db.on('open', ()=>{
	console.log('Connected to db');
});

db.on('error', (err)=>{
	console.log('An error occured ', err)
});

//initialize passport
app.use(passport.initialize());

//Restore Session
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});
var sessionOptions = {
  secret: "this is a super secret dadada",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
};



app.use(session(sessionOptions));

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');
app.use(express.static('./public'));
app.use(router);

app.listen(port, ()=>{
	console.log('Listening at', port);
});