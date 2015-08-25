var User = require('../models/user');

function indexUsers(req, res) {
    User.find({}, function(err, users){
      if (err) console.log(err);
      res.json(users);
    });
}

function showUser(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) console.log(err);
    res.json(user);
  });
}

function createUser(req, res){
  User.create(req.body, function(err, user){
    if(err) console.log(err);
    res.json(user);
    console.log(user)
  });
}

function updateUser(req, res){
  User.update({_id: req.params.id}, {
    email: req.body.email, 
    firstName: req.body.firstName
  }, function(err, user){
    if(err){
      res.send(err)
    } else {
      res.json(user.get)
    }
  });
}

function deleteUser(req, res){
  User.findByIdAndRemove({_id: req.params.id}, function(err){
    if (err) {
      res.send(err)
    } else {
      res.json("202 Accepted");
    }
  });
}

module.exports = {
  indexUsers: indexUsers,
  showUser: showUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
}