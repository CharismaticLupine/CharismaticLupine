var User = require('./user.js');
var jwt = require('jwt-simple');

module.exports = {
  
  signin: function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    new User({user_name: username})
      .fetch().then(function(user){
        if(!user){
          //Throw error
          next(new Error('User does not exist'));
        } else {
          user.comparePassword(password, function(match){
            if (match){
              var token = jwt.encode(user, 'I HAZ SECRETZ');
              res.json({token: token});
            } else {
              return next(new Error('Password FAIL'));
            }
          });
        }
      });
  },

  signup: function(req, res, next){
    
  },
  checkAuth: function(req, res, next){}

};