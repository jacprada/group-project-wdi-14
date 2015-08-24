var mongoose = require("mongoose");
var barSchema = new mongoose.Schema({ 
  name:                 String,
  address:              String,
  latitude:             String, //to be converted into coordinates
  longitude:            String,
  description:          String,
  image:                String, // to be rendered into an actual image
  facebook_url:         String,
  creator: { type: mongoose.Schema.ObjectId, ref: 'User' } 
});
var Bar = mongoose.model("Bar", barSchema);
module.exports = Bar;