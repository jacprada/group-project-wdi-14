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
var config            = require('./config');
var User              = require('./models/user');

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());

// passport.initialize() middleware is required to initialize Passport. 
app.use(passport.initialize());

// app.use(flash()); 

require('./config/passport')(passport);

// app.use(function(req, res, next) {
//   global.user = req.user;
//   next();
// })

app.post('/signup', function(req, res) {
  passport.authenticate('local-signup', {
    successRedirect : '/bars',
    failureRedirect : '/users',
    failureFlash : true
  })(req, res, function(){
    res.redirect('/bars');
  });
});

// route to authenticate a user
app.post('/login', function(req, res) {
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
        var token = jwt.sign(user, app.get('superSecret'), {
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
});

// route middleware to verify a token
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
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
});

// app.use('/', expressJWT({secret: config.secret}));

// app.get('/bars',
//   expressJWT({secret: config.secret}),
//   function(req, res) {
//     if (!req.user) return res.send(401);
//     res.send(200);
//     console.log("accessed")
//   });


var routes = require('./config/routes');
app.use(routes);

app.listen(3000);