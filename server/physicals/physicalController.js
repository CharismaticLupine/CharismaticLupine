require('../photos/photo');
require('../comments/comment');
require('./physical');

var knex = require('../db_schema').knex;
var _ = require('underscore');

////////////////////////////////
// geographic utility functions
////////////////////////////////
  // move these to a new module?

_models2GeoJSON = function(models){
  // expects a bookshelf model or an array of bookshelf models
    // returns the a geoJSON FeatureCollection representation of that/those model(s)
    // expects model.get('geojson') to be a valid stringified geoJSON geometry object, e.g. as returned by PostGIS ST_AsGeoJSON(...)
  if( models === null || models === undefined ){
    return {
      "type": "FeatureCollection",
      "features" : []
    };
  }
  if( !Array.isArray(models) ){
    models = [models];
  }
  var features = models.map(function(model){
    // parse geoJSON, in case it's stringified
    if(typeof model.get('geojson') === 'string'){
      try { 
        model.set('geojson', JSON.parse(model.get('geojson')) )
      }catch(error){
        model.set('geojson', null);
      }
    }

    return {
      "type": "Feature",
      "properties": model.omit(['geo', 'geojson']),
      "geometry": model.get('geojson')
    };
  });

  return {
    "type": "FeatureCollection",
    "features" : features
  };
};


module.exports = {
  getAllPhysicals: function(req, res, next){
    Physical.forge()
      .query('select', [ '*', knex.raw('ST_AsGeoJSON(geo) as geojson') ])
      .fetchAll({ withRelated: ['comments', 'photos'] })
      .then(function(collection){
        var geoJSON = _models2GeoJSON(collection.models);
        if(geoJSON.features.length === 0){
          console.log('Success on GET /physical . Did not retrieve any models.' );
        }else{
          console.log('Success on GET /physical . Returned ' +  geoJSON.features.length + ' results.');
        }
        res.status(200).send(geoJSON);
        next();
      })
      .catch(function(err){
        console.log('Error on GET /physical/ : ', err);
        console.log(err.stack);
        res.status(500).send(err);
        next();
      });
  },

  getNearbyPhysicals: function(req, res, next){
    var proximity = 180, // meters // this should be lowered, probably, to something like 20 meters (depending on avg GPS error, yeah?)
        location = req.params['location'].split(','),
        x = location[0],
        y = location[1];

    // use ::geography to cast from geometry to geography type, so that distance measurements are correct
    Physical.forge()
      .query('select', [ '*', knex.raw('ST_AsGeoJSON(geo) as geojson') ])
      .query('where', knex.raw('ST_DWithin( physicals.geo::geography, ST_SetSRID(ST_Point(?, ?), 4326)::geography, ? )', [x, y, proximity]))
      .fetchAll({ withRelated: ['comments', 'photos'] })
      .then(function(collection){
        var geoJSON = _models2GeoJSON(collection.models);
        if(geoJSON.features.length === 0){
          console.log('Success on GET /physical/:location . Did not retrieve any models.' );
        }else{
          console.log('Success on GET /physical/:location . Returned ' +  geoJSON.features.length + ' results.');
        }
        res.status(200).send(geoJSON);
        next();
      })
      .catch(function(err){
        console.log('Error on GET /physical/:location : ', err);
        console.log(err.stack);
        res.status(500).send(err);
        next();
      });
  },

  getPhysicalById: function(req, res, next){
    Physical.forge({id: req.params['id']})
      .query('select', [ '*', knex.raw('ST_AsGeoJSON(geo) as geojson') ])
      .fetch({ withRelated: ['comments', 'photos'] })
      .then(function(model){
        var geoJSON = _models2GeoJSON(model);
        if(geoJSON.features.length === 0){
          console.log('Success on GET /physical/id/:id . Did not retrieve any physical models.' );
        }else{
          console.log('Success on GET /physical/id/:id . Returned physical ' +  geoJSON.features[0].properties.id );
        }
        res.status(200).send(geoJSON);
        next();
      })
      .catch(function(err){
        console.log("Error on GET /physical/id/:id : ", err);
        console.log(err.stack);
        res.status(500).send(err);
        next();
      });
  },

  getPhysicalsByBbox: function(req, res, next){
    var params = req.params['bbox'].split(','),
        xmin = params[0],
        ymin = params[1],
        xmax = params[2],
        ymax = params[3];

    Physical.forge()
      .query('select', ['*', knex.raw('ST_AsGeoJSON(geo) as geojson') ])
      .query('where', knex.raw('ST_MakeEnvelope(?,?,?,?, 4326) ~ geo', [xmin, ymin, xmax, ymax]) )
      .fetchAll({ withRelated: ['comments', 'photos'] })
      .then(function(collection){
        var geoJSON = _models2GeoJSON(collection.models);
        if(geoJSON.features.length === 0){
          console.log('Success on GET /physical/bbox/:bbox . Did not retrieve any models.' );
        }else{
          console.log('Success on GET /physical/bbox/:bbox . Returned ' +  geoJSON.features.length + ' results.');
        }
        res.status(200).send(geoJSON);
        next();
      })
      .catch(function(err){
        console.log('Error on GET /physical/bbox/:bbox : ', err);
        console.log(err.stack);
        res.status(500).send(err);
        next();
      });
  },

  createNewPhysical: function(req, res, next){
    var x = req.body.geo[0],
        y = req.body.geo[1];

    Physical.forge()
      .save({ 'geo': knex.raw('ST_SetSRID( ST_Point(?, ?) , 4326)', [x, y]) })
      .then(function(model){
        // ISSUE: model.toJSON() produces invalid JSON, so must be manually patched up: https://github.com/tgriesser/bookshelf/issues/873
        var geoJSON = {
          "type": "FeatureCollection",
          "features" : [
            {
              "type": "Feature",
              "properties": model.omit(['geo', 'geojson']),
              "geometry": {
                "type": "Point",
                "coordinates":  [ model.toJSON().geo.bindings[0], model.toJSON().geo.bindings[1] ]
              }
            }
          ]
        };
        console.log('Success on POST /physical/:location . Created point id: ' + geoJSON.features[0].properties.id);
        res.status(201).send(geoJSON);
        next();
      })
      .catch(function(err){
        console.log("Error on POST /physical ", err);
        console.log(err.stack);
        res.status(500).send(err);
        next();
      });

    // define insert query as knex raw SQL
    // knex('physicals')
    //   .insert({ 'geo': knex.raw('ST_SetSRID( ST_Point(?, ?) , 4326)', [x, y]) })
    //   .returning([ 'id', knex.raw('ST_AsGeoJSON(geo) as geojson') ])
    //   .then(function(response){
    //     var geoJSON = _models2GeoJSON(response);
    //     console.log('Success on POST /physical/:location . Created point: ' +  geoJSON.features[0]);
    //     res.status(201).send(geoJSON);
    //     next();
    //   })
    //   .catch(function(err){
    //     console.log("Error on POST /physical ", err);
    //     console.log(err.stack);
    //     res.status(500).send(err);
    //     next();
    //   });
  },
};
