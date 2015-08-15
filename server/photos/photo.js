var db = require('../db_schema.js');
User = require('../users/user');
Physical = require('../physicals/physical');

var Photo = db.Model.extend({
  tableName: 'photos',
  hasTimestamps: true,
  user: function(){
    return this.belongsTo(User);
  },
  physical: function(){
    return this.belongsTo(Physical, 'physicals_id');
  }
});

module.exports = db.model('Photo', Photo);
