var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({ 
  id: String,
  access_token: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String
});
var User = mongoose.model("User", userSchema);
module.exports = User;