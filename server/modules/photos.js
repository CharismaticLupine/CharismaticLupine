var db = require('../config');
var User = require('./users');
var Physical = require('./physicals');

var Photo = db.Model.extend({
  tableName: 'photos',
  user: function(){
    return this.belongsTo(User);
  },
  physical: function(){
    return this.belongsTo(Physical);
  }
});

module.exports = Photo;
