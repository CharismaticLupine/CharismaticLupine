var db = require('../db_schema.js');
var Photo = require('./photos');
var Comment = require('./comments');

var User = db.Model.extend({
  tableName: 'users',
  photos: function(){
    return this.hasMany(Photo);
  },
  comments: function(){
    return this.hasMany(Comment);
  }
});

module.exports = User;
