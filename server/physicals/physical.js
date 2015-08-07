var db = require('../db_schema.js');
var knex = db.knex;
var Photo = require('../photos/photo');
var Comment = require('../comments/comment');

var Physical = db.Model.extend({
  tableName: 'physicals',
  hasTimestamps: true,

  initialize: function(){
    // this.on('saving', this.parseLocation);
  },

  photos: function(){
    return this.hasMany(Photo);
  },

  comments: function(){
    return this.hasMany(Comment);
  },

  parseLocation: function(model, attributes, options){
    // reformat geo for PostGIS
      // assumes body request contains geo: [x, y]
    var x = model.get('geo')[0],
        y = model.get('geo')[1];

    // PostGIS expects geo column to be equal
    // to a geometry returned by the functions ST_SetSRID( ST_Point(x,y) , 4326)
                                         // or ST_geometryFromText( 'POINT(x y)', 4326)
    // using 'knex-postgis'
    // model.set('geo', st.geomFromText("'Point(" + x + " " + y + ")'"), 4326));

    // w/o 'knex-postgis'
    // var PostGISGeom = knex.raw('ST_SetSRID( ST_Point(' + x + ',' + y + ') , 4326)');
    // model.set('geo', PostGISGeom);

    // above throws unlikely errors: https://github.com/tgriesser/bookshelf/issues/104
      // instead, rebuild query manually

    knex.raw('INSERT INTO physicals (geo) VALUES ( ST_SetSRID( ST_Point(10,10) , 4326) )');
  }
});

module.exports = Physical;
