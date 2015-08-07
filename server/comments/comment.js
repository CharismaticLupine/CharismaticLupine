var db = require('../db_schema.js').db;
var User = require('../users/user');
var Physical = require('../physicals/physical');

var Comment = db.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  user: function(){
    return this.belongsTo(User);
  },
  physical: function(){
    return this.belongsTo(Physical);
  }
});

module.exports = Comment;
