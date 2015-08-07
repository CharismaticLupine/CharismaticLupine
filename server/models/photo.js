var db = require('../db_schema.js');
var User = require('./user');
var Physical = require('./physical');

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
