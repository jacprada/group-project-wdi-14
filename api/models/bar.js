var mongoose = require("mongoose");
var barSchema = new mongoose.Schema({ 
  name:                 String,
  address:              String,
  lat:                  Number, //to be converted into coordinates
  lng:                  Number,
  description:          String,
  image:                String, // to be rendered into an actual image
  facebook_url:         String,
  creator:              { type: mongoose.Schema.ObjectId, ref: 'User' } 
});
var Bar = mongoose.model("Bar", barSchema);
module.exports = Bar;

