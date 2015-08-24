var mongoose = require("mongoose");

var clubSchema = new mongoose.Schema({ 
  name:                 String,
  address:              String, //to be converted into coordinates
  lat:                  Number,
  lng:                  Number,
  description:          String,
  image:                String, // to be rendered into an actual image
  facebook_url:         String
});

var Club = mongoose.model("Club", clubSchema);

module.exports = Club;