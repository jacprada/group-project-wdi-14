var LocalStrategy = require('passport-local').Strategy;
var User          = require("../models/user");

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
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err) return done(err);

        // If there already is a user with this email 
        if (user) {
          return done(null, false, req.flash('signupMessage', 'This email is already used.'));
        } else {
        // There is no email registered with this email

          // Create a new user
          var newUser            = new User();
          newUser.local.email    = email;
          newUser.local.password = newUser.encrypt(password);

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // passport.use('local-login', new LocalStrategy({
  //   usernameField : 'email',
  //   passwordField : 'password',
  //   passReqToCallback : true
  // }, function(req, email, password, done){

  //   // Search for a user with an email from the login form
  //   User.findOne({ 'local.email' : email }, function(err, user) {
  //     // If an exception occurred while verifying the credentials (for example, if the database is not available), done should be invoked with an error, in conventional Node style.
  //     if (err) { return done(err) };

  //     // If no user has been found
  //     if (!user) {
  //       // Strategies require what is known as a verify callback.
  //       // If the credentials are not valid (for example, if the password is incorrect), 
  //       // done should be invoked with false instead of a user to indicate an authentication failure.
  //       return done(null, false, req.flash('loginMessage', 'Incorrect email.'))
  //     };

  //     // If password is invalid
  //     if (!user.validPassword(password)) {
  //       return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
  //     } 
        
  //     // User has been authenticated, return user
  //     return done(null, user);
  //   });
  // }));
}