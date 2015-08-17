var db = require('../db_schema.js');
require('../users/user');
require('../physicals/physical');

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
