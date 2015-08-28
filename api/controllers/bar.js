var Bar = require('../models/bar');
var geocoder = require('node-geocoder');
var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
  apiKey: process.env.GOOGLE_GEOCODER_API_KEY,
  formatter: null
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

function indexBars(req, res) {
  Bar.find({})
  .populate('_creator')
  .exec(function (err, bars) {
    if (err) return handleError(err);
    res.json(bars);
  });
}

function showBar(req, res){
  Bar.findOne({ _id: req.params.id })
  .populate('_creator')
  .exec(function (err, bar) {
    if (err) return handleError(err);
    res.json(bar);
  });
}

function createBar(req, res){
  geocoder.geocode(req.body.address, function(err, geocode) {
    console.log(req.body.address)
    var newBar = new Bar();
    newBar.name = req.body.name;
    newBar.address = req.body.address;
    newBar.description = req.body.description;
    newBar.image = req.body.image;
    newBar.facebook_url = req.body.facebook_url;

    newBar.lat = parseFloat(geocode[0].latitude);
    newBar.lng = parseFloat(geocode[0].longitude);

    newBar.save(function(err, bar){
      if(err){
        res.send(err)
      } else {
        console.log(bar);
        res.json(bar)
      }
    });
  });
}

function updateBar(req, res){
  Bar.update({_id: req.params.id}, {
    name: req.body.name,
    address: req.body.address,
    description: req.body.description,
    image: req.body.image,
    facebook_url: req.body.facebook_url
  }, function(err, bar){
    if(err){
      res.send(err)
    } else {
      res.json(bar.get)
    }
  });
}

function deleteBar(req, res){
  Bar.findByIdAndRemove({_id: req.params.id}, function(err){
    if (err) {
      res.send(err)
    } else {
      res.json("202 Accepted");
    }
  });
}

module.exports = {
  indexBars: indexBars,
  showBar: showBar,
  createBar: createBar,
  updateBar: updateBar,
  deleteBar: deleteBar
}