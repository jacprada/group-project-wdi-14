var LocalStrategy = require('passport-local').Strategy;
var User          = require("../models/user");
var jwt               = require('jsonwebtoken');

// In app.js require('./config/passport')(passport) is expecting a function
module.exports = function(passport) {

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {
    //  process.nextTick() actually does is defer the execution of an action till the next pass around the event loop.
    // http://howtonode.org/understanding-process-next-tick 
    process.nextTick(function() {

      // Find a user with this e-mail
      User.findOne({ 'email' :  email }, function(err, user) {
        if (err) return done(err);

        // If there already is a user with this email 
        if (user) {
          return done(null, false);
        } else {
        // There is no email registered with this email

          // Create a new user
          var newUser       = new User();
          newUser.email     = email;
          newUser.password  = newUser.encrypt(password);
          newUser.firstName = req.body.firstName;
          newUser.lastName  = req.body.lastName;

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
}