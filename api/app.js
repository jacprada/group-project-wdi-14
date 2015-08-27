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

// app.post('/signup', function(req, res) {
//   passport.authenticate('local-signup', {
//     successRedirect : '/bars',
//     failureRedirect : '/users',
//     failureFlash : true
//   })(req, res, function(){
//     res.redirect('/bars');
//   });
// });

app.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
      if (err) return next(err)
        
      if (!user) {
        return res.status(401).send({ error: 'Something went wrong...' });
      }

      //user has authenticated correctly thus we create a JWT token 
      var token = jwt.sign(user, "barapp", { expiresInMinutes: 1440 });

      //send back the token to the front-end to store in a cookie
      res.status(200).send({ 
        message: "Thank you for authenticating",
        token: token,
        user: user
      });

    })(req, res, next);
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