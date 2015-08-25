var express           = require('express');
var cors              = require('cors');
var path              = require('path');
var logger            = require('morgan');
var bodyParser        = require('body-parser');
var app               = express();
var FacebookStrategy  = require('passport-facebook').Strategy;
var mongoose          = require('mongoose');
var passport          = require('passport');
var cookieParser      = require("cookie-parser");
var methodOverride    = require("method-override");
var jwt               = require('jsonwebtoken');
var config            = require('./config');

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
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(cors());

var User            = require('./models/user');
var Bar             = require('./models/bar');
var userController  = require('./controllers/user');
var barController   = require('./controllers/bar');

app.get('/setup', function(req, res) {
  // create a sample user
  var u1 = new User({
    email: 'emily@emily.com',
    firstName: 'Emily',
    lastName: 'Isacke',
    password: 'password'
  });
  // save the sample user
  u1.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// route to authenticate a user
app.post('/login', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
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

var routes = require('./config/routes');
app.use(routes);

app.listen(3000);

// FACEBOOK

// require("./config/passport")(passport, FacebookStrategy)

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

// app.get('/auth/facebook/callback', passport.authenticate('facebook',
// {
//   successRedirect: '/',
//   failureRedirect: '/'
// })
// );

// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

// DATA
// var u1 = new User({
//     email: 'emily@emily.com',1
//     firstName: 'Emily',
//     lastName: 'Isacke'
// });

// u1.save(function(err){
//   if(err) console.log(err);
//   console.log('User saved');
// });

// var b1 = new Bar({
// name: "Radio Rooftop Bar",
// address: "336-337 Strand, WC2R 1HA",
// lat: 51.511886,
// lng: -0.118537,
// description: "Set atop the ME London hotel, Radio bar — so called because it’s on the site of the old Marconi House — is a sleek asymmetric treat for the eyes in itself.",
// image: "http://assets.londonist.com/uploads/2015/04/i640/radio-rooftop.jpg",
// facebook_url: "https://www.facebook.com/MeliaHotelsInternational",
// });

// b1.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b2 = new Bar({
// name: "Aqua Spirit",
// address: "5th floor, 240 Regent Street, W1B 3BR",
// lat: 51.514332,
// lng: -0.141774,
// description: "A great spot to know about, this slick cocktail sanctuary high above Regent Street — part of Aqua Kyoto restaurant — is in a prime position for post-shopping recuperation.",
// image: "http://www.fluidnetwork.co.uk/gfx/venues/20350/aqua_spirit_bar_soho_cocktail_best_london_03.jpg",
// facebook_url: "https://www.facebook.com/Aqualondon",
// });

// b2.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b3 = new Bar({
// name: "Aqua Spirit",
// address: "68-70 Whitfield Street, W1T 4EY",
// lat: 51.521871,
// lng: -0.136400,
// description: "This characterful pub just off Tottenham Court Road has something special up its sleeve — a rooftop beer garden. It may not be the greenest of gardens, but it’s a pretty sweet spot for a pint in the sunshine all the same.",
// image: "http://pubshistory.com/LondonPubs/StPancras/CarpentersArms.jpg",
// facebook_url: "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.thecarpentersarmsw1.co.uk%2Ffindus%23.VdyIC95dSUU.facebook",
// });

// b3.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b4 = new Bar({
// name: "Angler",
// address: "68-70 Whitfield Street, W1T 4EY",
// description: "Planted with lavender, herbs and olive trees, this rooftop terrace at South Place Hotel brings a little piece of Provence to Moorgate — not that there’s anywhere in Provence that also affords you a bird’s eye view of the ongoing Crossrail works in the area. Call by for a drink daily from midday until 11.30pm.",
// image: "https://farm9.static.flickr.com/8200/8178736862_03e9c6348d_b.jpg",
// facebook_url: "https://www.facebook.com/3SouthPlace",
// });

// b4.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b5 = new Bar({
// name: "Bird of Smithfield",
// address: "26 Smithfield Street, EC1A 9LB",
// description: "Spread over five floors in a renovated Georgian town house, Bird of Smithfield serves excellent British food — including meat from across the way — courtesy of ex-The Ivy chef Alan Bird. More to the point, it comes with a rooftop terrace bar offering great views across the top of the meat market and beyond. It has a strict 11.30pm curfew, after which time an underground cocktail bar takes over.",
// image: "http://www.islingtongazette.co.uk/polopoly_fs/1.2236533.1371205782!/image/2910088737.jpg_gen/derivatives/landscape_630/2910088737.jpg",
// facebook_url: "",
// });

// b5.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b6 = new Bar({
// name: "Madison",
// address: "Rooftop terrace, 1 New Change, EC4M 9AF",
// description: "A breathtaking view of the dome of St Paul’s Cathedral is the pièce de résistance at this restaurant and bar where Champagne and wines get big billing. There’s plenty of reasonably priced bar food if you’re not up for a full dinner and we’d recommend the Sunday brunch for a good value visit.",
// image: "http://madison.danddlondon.com/wp-content/uploads/sites/29/2014/10/Indoor-Restaurant-Seating-1-1400x931.jpg",
// facebook_url: "https://www.facebook.com/MadisonRestaurant",
// });

// b6.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b7 = new Bar({
// name: "Sky Garden",
// address: "20 Fenchurch Street, EC3M 3BY",
// description: "The Sky Garden — set on the 35th and 36th floors of the bulbous Walkie Talkie building — is kind of a roof terrace. From 11am-6pm daily there’s access to an al fresco strip, while the rest of the space is sufficiently glass-clad and greenery-filled to do a similar job.",
// image: "http://skygarden.london/sites/default/files/Rhubarb%20at%20Sky%20Garden%20-%20Web%20Sized42_0.jpg",
// facebook_url: "",
// });

// b7.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b8 = new Bar({
// name: "Sushisamba",
// address: "110 Bishopsgate, EC2N 4AY",
// description: "The highest roof terrace in London, on floor 38 of the Heron Tower, Sushisamba has high prices to match but soaring views that just about make up for it. The lift ride up there is worth a go in itself any time of day, but for best effects go of an evening and nab a seat around the fire pit.",
// image: "https://farm9.static.flickr.com/8200/8178736862_03e9c6348d_b.jpg",
// facebook_url: "https://www.facebook.com/SUSHISAMBA",
// });

// b8.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b9 = new Bar({
// name: "Abbey Tavern",
// address: "124 Kentish Town Road, NW1 9QB",
// description: "This boozer’s biggest draw is its pretty wood-decked, fairy-light hung roof terrace which comes complete with comfy sofas if not the most scenic views.",
// image: "https://farm9.static.flickr.com/8200/8178736862_03e9c6348d_b.jpg",
// facebook_url: "https://www.facebook.com/abbeytavernkentish",
// });

// b9.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });


// var b10 = new Bar({
// name: "The Castle",
// address: "51 Pentonville Road, N1 9HF",
// description: "This Geronimo Inns gastropub on Pentonville Road is perfectly pleasant inside, but come a sunny day or a warm evening its spacious roof terrace is prime space — even if the views of, err, Pentonville Road aren’t that scenic.",
// image: "https://scontent-lhr3-1.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/s720x720/11535846_853280781408114_6266927292498793626_n.jpg?oh=2afb82f0dc794c8ba945001c80729a3b&oe=5675E993",
// facebook_url: "https://www.facebook.com/TheCastleIslington",
// });

// b10.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b11 = new Bar({
// name: "The Driver",
// address: " 2-4 Wharfdale Road, N1 9RY",
// description: "It’s not London’s prettiest terrace, and the fenced perimeters mean you might need to stand on tippy-toes to get a view, but this pub rooftop is still a great spot to soak up some sun with a pint in hand. On warm days you can expect regular rooftop BBQs too — check ahead.",
// image: " ",
// facebook_url: "",
// });

// b11.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b12 = new Bar({
// name: "Vivo",
// address: " 57-58 Upper Street, N1 0NY",
// description: "Italian restaurant Vivo has a vast wood-decked roof terrace scattered with Mediterranean plants. The Upper Street masses still don’t really know about it so you should be able to enjoy a glass of prosecco or a sunny spritz in relative peace. Don’t expect views though — the surrounding fences are irritatingly just too tall for that.",
// image: "https://scontent-lhr3-1.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/11880445_973197556036203_5290103959746967496_n.jpg?oh=f98da8f7726e63156fc1018ca5c6614e&oe=567105E8",
// facebook_url: "https://www.facebook.com/vivotaste",
// });

// b12.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });


// var b13 = new Bar({
// name: "Boundary Rooftop",
// address: "2-4 Boundary Street, Shoreditch, E2 7DD",
// description: "There are few lovelier ways to pass time in Shoreditch than with drinks and Mediterranean nibbles on the Boundary rooftop. It does require a certain level of financial investment, though, and note that being a fairly squat building in an area devoid of interesting features, the views from on top aren’t the best you’ll find. The revamped space now comes with a weatherproof pergola meaning it’s open all day every day irrelevant of the weather.",
// image: "http://www.theboundary.co.uk/images/rooftop_page_04.jpg",
// facebook_url: "",
// });

// b13.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b14 = new Bar({
// name: "Dalston Roof Park",
// address: "The Print House, 18-22 Ashwin Street, E8 3DL",
// description: "This annual community project run by Bootstrap Company describes itself as an urban utopian oasis. While that may be something of an exaggeration, it gives you the right idea — there’s (fake) grass, (short) trees, street food and good vibes with regular live music and film nights planned. A membership fee of £5 will be charged, which lasts all summer.",
// image: "",
// facebook_url: "https://www.facebook.com/BootstrapCompany",
// });

// b14.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b15 = new Bar({
// name: "The Fox",
// address: "Rooftop terrace, 1 New Change, EC4M 9AF",
// description: "This Kingsland Road pub specialising in real ales and ciders boasts a large roof terrace. It goes into the dependable rather than particularly pretty category, but gets the cute fairy light treatment after dusk.",
// image: "https://scontent-lhr3-1.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/538336_202240479879453_1687601337_n.jpg?oh=57b5927c110df9c40cbf9839085fd243&oe=5669682C",
// facebook_url: "https://www.facebook.com/thefoxe8",
// });

// b15.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b16 = new Bar({
// name: "Golden Bee",
// address: "Singer Street, Shoreditch, EC1V 9DD",
// description: "A stone’s throw from hectic Old Street station is the comparatively tranquil terrace of the Golden Bee. Make the most of it with happy hours from 5-8pm on Tuesdays to Thursdays and 5-7pm on Fridays. Also check for regular rooftop cinema events.",
// image: "http://www.goldenbee.co.uk/wp-content/uploads/2014/02/Golden-Bee-181.jpg",
// facebook_url: "https://www.facebook.com/goldenbeeshoreditch?fref=ts",
// });

// b16.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b17 = new Bar({
// name: "Queen of Hoxton",
// address: "1-5 Curtain Road, EC2A 3JX",
// description: "The roof of the Queen of Hoxton is open all year round — with a wigwam for shelter in the winter months — but as of May it will be transformed into a Cuban-themed bar for the summer. Smokin’ Graciela’s Rooftop Bar takes its name from Havana’s legendary 80 year old cigar-smoking diva and features Cuban music, Cuban sandwiches and Cuban cigars along with a daiquiri menu.",
// image: "http://queenofhoxton.com/wp-content/uploads/2015/08/QOHChrista.jpg",
// facebook_url: "https://www.facebook.com/thequeenofhoxton",
// });

// b17.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b18 = new Bar({
// name: "Red Lion",
// address: "41 Hoxton Street, N1 6NH",
// description: "Either relaxed or rammed depending on the weather, the Red Lion’s roof terrace is reliably open whenever you fancy an open-air drink. Food comes courtesy of Red Dog American Sandwiches around the corner on Hoxton Square (order at the bar and they’ll deliver to your table).",
// image: "https://farm9.static.flickr.com/8200/8178736862_03e9c6348d_b.jpg",
// facebook_url: "",
// });

// b18.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b19 = new Bar({
// name: "Roof East",
// address: "Stratford multi-storey car park, Great Eastern Way, E15 1XE",
// description: "This year will see the return of Roof East in a loosely-termed ‘urban park’ atop a multi-storey car park in Stratford. As well as a bar, expect regular rooftop cinema nights, morning exercise classes and live music sessions — plus London’s only aquaponic farm.",
// image: "http://www.roofeast.com/images/resized/assets/uploads/IMG_3224_1200x600.JPG",
// facebook_url: "https://www.facebook.com/sharer/sharer.php?u=null",
// });

// b19.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });

// var b20 = new Bar({
// name: "Grand Union",
// address: "111 Kennington Road, SE11 6SF",
// description: "This otherwise rather unremarkable branch of the Grand Union chain has one particularly attractive feature — a large roof terrace overlooking the Imperial War Museum grounds. Cocktails are a fiver all day up until 8pm from Monday-Saturday.",
// image: "https://farm9.static.flickr.com/8200/8178736862_03e9c6348d_b.jpg",
// facebook_url: "https://www.facebook.com/grandunion",
// });

// b20.save(function(err){
// if(err) console.log(err);
// console.log('Bar saved');
// });