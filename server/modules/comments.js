var db = require('../config');
var User = require('./users');
var Physical = require('./physicals');

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
