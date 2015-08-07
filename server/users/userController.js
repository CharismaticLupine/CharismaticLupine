var User = require('./user.js');
var jwt = require('jwt-simple');

module.exports = {
  
  signin: function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    new User({user_name: username})
      .fetch().then(function(user){
        if(!user){
          //Not sure how this will react w ionic - intent is to try again!
          res.redirect('/signin');
        } else {
          user.comparePassword(password, function(match){
            if (match){
              //Send back JWT
            } else {
              res.redirect('/signin');
            }
          });
        }
      });
  },

  signup: function(req, res, next){},
  checkAuth: function(req, res, next){}

};