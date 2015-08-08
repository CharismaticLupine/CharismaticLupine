var db = require('../db_schema.js');
var User = require('../users/user');
var Physical = require('../physicals/physical');

var Photo = db.Model.extend({
  tableName: 'photos',
  hasTimestamps: true,
  user: function(){
    return this.belongsTo(User);
  },
  physical: function(){
    return this.belongsTo(Physical);
  }
});

module.exports = Photo;
