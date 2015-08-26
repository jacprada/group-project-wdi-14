var passport = require("passport")

// POST /signup
function postSignup(req, res) {
  passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
  })(req, res);
}

module.exports = {
  postSignup: postSignup
}