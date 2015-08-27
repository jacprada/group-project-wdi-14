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

router.post('/login', authenticate);

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

// route to authenticate a user
function authenticate(req, res, next) {
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

// route middleware to verify a token
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