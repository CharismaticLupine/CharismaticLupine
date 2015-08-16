var db = require('../db_schema.js');
require('../users/user');
// WHY IN THE FUCK? Posting to the bookshelf model registry about this: 
  // get a 'Physical is not defined' error, if the below line is: `require('../physicals/physical');`
  // as it should be (according to the plugin documentation)
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
