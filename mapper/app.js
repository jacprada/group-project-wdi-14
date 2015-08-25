var express      = require('express');
var app          = express();
var mongoose     = require('mongoose');
var bodyParser   = require('body-parser');

var databaseURL = process.env.MONGOLAB_URI || 'mongodb://localhost/mapper';
mongoose.connect(databaseURL);

var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
  apiKey: 'AIzaSyBpZuu3CKBlKJ5Zelpqn8qJ7VDABD6yjXA',
  formatter: null
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(methodOverride(function(req, res){
//   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//     // look in urlencoded POST bodies and delete it
//     var method = req.body._method
//     delete req.body._method
//     return method
//   }
// }))

app.set('views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 9000)

require("./models/club")
var Club = mongoose.model("Club")

//VIEWS


//index
app.get("/", function(req, res) {
  Club.find({}, function(err, clubs){
    res.format({
      'application/json': function(){
        res.json(clubs);
      },
      'text/html': function(){
        res.render("index", { clubsList: clubs });
      }
    });
  })
});

//new
app.get("/new", function(req, res) { 
  res.render("new")
});

//create
app.post("/", function(req, res){
  geocoder.geocode(req.body.address, function(err, geocode) {
    var newClub = new Club();
    newClub.name = req.body.name;
    newClub.address = req.body.address;
    newClub.description = req.body.description;
    newClub.image = req.body.image;
    newClub.facebook_url = req.body.facebook_url;
    newClub.lat = parseFloat(geocode[0].latitude);
    newClub.lng = parseFloat(geocode[0].longitude);

    newClub.save(function(err, club){
      if(err){
        res.send(err)
      } else {
        console.log(club);
        res.format({
          'application/json': function(){
            res.json(club); },
            'text/html': function(){
              res.redirect('/')
            }
          })
      }
    })
  });
});

// //destroy
// animalRouter.delete('/:id', function(req, res) { 
//   Animal.findByIdAndRemove({_id: req.params.id}, function(err){
//     if(err){
//       res.send(err)
//     } else {
//       res.format({
//         'application/json': function(){
//           res.json("202 Accepted"); },
//           'text/html': function(){
//             res.redirect('/animals')
//           }
//         })
//     }
//   })
// });

// //show
// animalRouter.get('/:id', function(req, res) {
//   Animal.findOne({_id: req.params.id}, function(err, animal){
//     if(err){
//       res.send(err)
//     } else {
//       res.format({
//         'application/json': function(){
//           res.json(animal); },
//           'text/html': function(){
//             res.render('animals/show', {animalShow: animal}); }
//           })
//     }}
//     )
// });

// //edit
// animalRouter.get('/:id/edit', function(req, res) { 
//   Animal.findOne({_id: req.params.id}, function(err, animal){
//     if(err){
//       res.send(err)
//     } else {
//       res.render('animals/edit', {animalEdit: animal});
//     }
//   })
// });

// //update
// animalRouter.post('/:id', function(req, res) { 
//   Animal.update({_id: req.params.id}, {
//     common_name:          req.body.common_name,
//     scientific_name:      req.body.scientific_name,
//     image:                req.body.image,
//     conservation_status:  req.body.conservation_status 
//   }, function(err, animal){
//     if(err){
//       res.send(err)
//     } else {
//       res.format({
//         'application/json': function(){
//           res.json(animal.get); },
//           'text/html': function(){
//             res.redirect('/animals')
//           }
//         })
//     }
//   })
// });

// //destroy
// animalRouter.delete('/:id', function(req, res) { 
//   Animal.findByIdAndRemove({_id: req.params.id}, function(err){
//     if(err){
//       res.send(err)
//     } else {
//       res.format({
//         'application/json': function(){
//           res.json("202 Accepted"); },
//           'text/html': function(){
//             res.redirect('/animals')
//           }
//         })
//     }
//   })
// });