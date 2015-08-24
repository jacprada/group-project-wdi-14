var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");

mongoose.connect('mongodb://localhost:27017/bar-app2');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use( cookieParser() );
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));

app.listen(3000);

var User = require('./models/user');

// FACEBOOK

// require("./config/passport")(passport, FacebookStrategy)

app.get('/', function(req, res){
  res.render('layout', { user: req.user });
});

app.get('/users', function(req, res){
  User.find({}, function(err, users){
    if (err) console.log(err);
    res.json(users);
  });
});

app.get('/users/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) console.log(err);
    res.json(user);
  });
});

app.post('/users', function(req, res){
  User.create(req.body, function(err, user){
    if(err) console.log(err);
    res.json(user);
    console.log(user)
  });
})

app.post('/users/:id', function(req, res){
  User.update({_id: req.params.id}, {
    email: req.body.email, 
    firstName: req.body.firstName
  }, function(err, user){
    if(err) console.log(err);
    res.json(user.get)
  });
})

function userDelete(req, res){
  User.findByIdAndRemove({_id: req.params.id}, function(err){
    if (err) {
      res.send(err)
    } else {
      res.json("202 Accepted");
    }
  });
}



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

// DATA
// var u1 = new User({
//     email: 'dami@dami.com',
//     firstName: 'Dami'
// });

// u1.save(function(err){
//   if(err) console.log(err);
//   console.log('User saved');
// });



















