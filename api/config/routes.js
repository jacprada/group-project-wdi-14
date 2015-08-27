var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// Used to manipulate POST methods
var methodOverride = require('method-override');
var passport = require("passport");
var usersController = require('../controllers/user');
var barsController = require('../controllers/bar');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

router.post('/login', login);
router.post('/signup', signup);

// router.use('/', expressJWT({secret: "barapp"}));

router.use(decode);

router.route('/users')
  .get(usersController.indexUsers)
  .post(usersController.createUser)

router.route('/users/:id')
  .get(usersController.showUser)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser)

router.route('/bars')
  .get(barsController.indexBars)
  .post(barsController.createBar)

router.route('/bars/:id')
  .get(barsController.showBar)
  .put(barsController.updateBar)
  .delete(barsController.deleteBar)

// Route to signup (login) a user
function signup(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
      if (err) return next(err)
        
      if (!user) {
        return res.status(401).send({ error: 'User already exists!' });
      }
      // User has authenticated so issue token 
      var token = jwt.sign(user, "barapp", { expiresInMinutes: 1440 });
      // Send back the token to the front-end to store
      res.status(200).send({ 
        message: "Thank you for authenticating",
        token: token,
        user: user
      });
    })(req, res, next);
};

// Route to authenticate (login) a user
function login(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (!user.validPassword(req.body.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = jwt.sign(user, "barapp", {
          expiresInMinutes: 1440 // expires in 24 hours
        });
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user: user
        });
      }   
    }
  });
};

// Route middleware to verify a token
function decode(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, "barapp", function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
      success: false, 
      message: 'No token provided.' 
    }); 
  }
};

module.exports = router