var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({ 
  id: String,
  access_token: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

userSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

var User = mongoose.model("User", userSchema);
module.exports = User;