var db = require('../db_schema.js');
var User = require('./user');
var Physical = require('./physical');

var Comment = db.Model.extend({
  tableName: 'comments',
  user: function(){
    return this.belongsTo(User);
  },
  physical: function(){
    return this.belongsTo(Physical);
  }
});

module.exports = Comment;
