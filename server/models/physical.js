var db = require('../db_schema.js');
var Photo = require('./photo');
var Comment = require('./comment');

var Physical = db.Model.extend({
  tableName: 'physicals',
  photos: function(){
    return this.hasMany(Photo);
  },
  comments: function(){
    return this.hasMany(Comment);
  }
});

module.exports = Physical;
