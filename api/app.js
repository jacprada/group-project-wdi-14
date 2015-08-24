var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
// var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
// var passport = require('passport');
// var expressSession = require('express-session');
var cookieParser = require("cookie-parser");

mongoose.connect('mongodb://localhost:27017/bar-app');

app.use(cookieParser() );
// app.use(expressSession({secret: 'mySecretKey'}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));



// require("./config/passport")(passport, FacebookStrategy)

app.get('/', function(req, res){
  res.render('layout', { user: req.user });
});

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

// app.get('/auth/facebook/callback', passport.authenticate('facebook',
//   {
//     successRedirect: '/',
//     failureRedirect: '/'
//   })
// );

// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

// ADD CODE HERE
app.listen(3000);