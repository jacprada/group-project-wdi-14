var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// Used to manipulate POST methods
var methodOverride = require('method-override');
var passport = require("passport");
var usersController = require('../controllers/user');
var barsController = require('../controllers/bar');

function authenticatedUser(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

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

module.exports = router