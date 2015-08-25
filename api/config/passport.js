var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

  passport.use('facebook', new FacebookStrategy({
    clientID        : process.env.FACEBOOK_BAR_API_KEY,
    clientSecret    : process.env.FACEBOOK_BAR_API_SECRET,
    callbackURL     : 'http://localhost:3000/auth/facebook/callback',
    enableProof     : true,
    profileFields   : ['name', 'emails']
  }, function(access_token, refresh_token, profile, done) {

    console.log(profile)
    process.nextTick(function() {

      User.findOne({ 'id' : profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser = new User();

          newUser.id           = profile.id;
          newUser.access_token = access_token;
          newUser.firstName    = profile.name.givenName;
          newUser.lastName     = profile.name.familyName;
          newUser.email        = profile.emails[0].value;
          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        };
      });
    });
  }));
}