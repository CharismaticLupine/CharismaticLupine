var db = require('../db_schema.js');
var Photo = require('../photos/photo');
var Comment = require('../comments/comment');

var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  photos: function(){
    return this.hasMany(Photo);
  },
  comments: function(){
    return this.hasMany(Comment);
  },
  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  hashPassword: function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null)
      .bind(this)
      .then(function(hash){
        this.set('password', hash);
     });

  },
  comparePassword: function(attemptedPassword, callback){
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  }
});

module.exports = User;
