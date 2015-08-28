var express           = require('express');
var cors              = require('cors');
var path              = require('path');
var logger            = require('morgan');
var bodyParser        = require('body-parser');
var app               = express();
var mongoose          = require('mongoose');
var passport          = require('passport');
var cookieParser      = require("cookie-parser");
var methodOverride    = require("method-override");
var jwt               = require('jsonwebtoken');
var expressJWT        = require('express-jwt');
var flash             = require('connect-flash'); 
var config            = require('./config');
var User              = require('./models/user');

mongoose.connect(config.database);
require('./config/passport')(passport);
app.set('superSecret', config.secret);

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(flash());

var routes = require('./config/routes');
app.use(routes);

app.listen(3000);