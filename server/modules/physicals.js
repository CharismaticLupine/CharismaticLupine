var db = require('../config');
var Photo = require('./photos');
var Comment = require('./comments');

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
