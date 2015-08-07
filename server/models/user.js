var db = require('../db_schema.js').db;
var Photo = require('./photo');
var Comment = require('./comment');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  photos: function(){
    return this.hasMany(Photo);
  },
  comments: function(){
    return this.hasMany(Comment);
  }
});

module.exports = User;
