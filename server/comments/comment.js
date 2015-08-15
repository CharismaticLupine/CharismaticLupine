var db = require('../db_schema.js');
require('../users/user');
require('../physicals/physical');

var Comment = db.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  user: function(){
    return this.belongsTo(User);
  },
  physical: function(){
    return this.belongsTo(Physical, 'physicals_id');
  }
});

module.exports = db.model('Comment', Comment);
