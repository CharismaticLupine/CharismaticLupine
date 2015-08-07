var db = require('../db_schema.js');
var Photo = require('./photo');
var Comment = require('./comment');

var Physical = db.Model.extend({
  tableName: 'physicals',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.parseLocation);
  },
  photos: function(){
    return this.hasMany(Photo);
  },
  comments: function(){
    return this.hasMany(Comment);
  }
  parseLocation: function(){
    // reformat geo for PostGIS
      // assumes body request contains geo: [x, y]
    var x = this.get('geo')[0],
        y = this.get('geo')[1];

    // PostGIS expects geo column to be equal 
    // to a geometry returned by the functions ST_SetSRID( POINT(x,y) , 4326)
    this.set('geo', 'ST_SetSRID( POINT(' + x + ',' + y + ') , 4326)');
  }
});

module.exports = Physical;
