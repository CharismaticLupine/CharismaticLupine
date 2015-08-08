var server_config = require('../db_schema.js');
var db = server_config.db;
var knex = server_config.knex;
var st = require('knex-postgis')(knex);
var Photo = require('../photos/photo');
var Comment = require('../comments/comment');

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
  },
  parseLocation: function(){
    // reformat geo for PostGIS
      // assumes body request contains geo: [x, y]
    var x = this.get('geo')[0],
        y = this.get('geo')[1];

    // PostGIS expects geo column to be equal
    // to a geometry returned by the functions ST_SetSRID( ST_Point(x,y) , 4326)
                                         // or ST_geometryFromText( 'POINT(x y)', 4326)
    // using 'knex-postgis'
    // this.set('geo', st.geomFromText("'Point(" + x + " " + y + ")'"), 4326));

    // w/o 'knex-postgis'
    var PostGISGeom = knex.raw('ST_SetSRID( ST_Point(' + x + ',' + y + ') , 4326)');
    this.set('geo', PostGISGeom);
  }
});

module.exports = Physical;
