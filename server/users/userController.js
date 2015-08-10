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
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    new User({user_name: username})
      .fetch().then(function(user) {
        if(user){
          //throw error if user exists
          next(new Error('User already exsists!'));
        } else {
          var newUser = new User({
            user_name: username,
            password: password
          });
          newUser.save()
            .then(function(){
              console.log('newUser saved', newUser);
              return res.redirect('/');
            });
        }

      });
    
  },
  checkAuth: function(req, res, next){}

};