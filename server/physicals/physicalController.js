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
        var physicalsGeoJSON = _models2GeoJSON(collection.models);
        console.log('Success on GET /physical . Returned ' +  physicalsGeoJSON.features.length + ' results.');
        res.status(200).send(physicalsGeoJSON);
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
        var physicalsGeoJSON = _models2GeoJSON(collection.models);
        console.log('Success on GET /physical/:location . Returned ' +  physicalsGeoJSON.features.length + ' results.');
        res.status(200).send(physicalsGeoJSON);
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
        var physicalsGeoJSON = _models2GeoJSON(model);
        console.log('Success on GET /physical/:id . Returned physical ' +  physicalsGeoJSON.features[0].properties.id );
        res.status(200).send(physicalsGeoJSON);
        next();
      })
      .catch(function(err){
        console.log("Error on GET /physical/:id : ", err);
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
        var physicalsGeoJSON = {
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
        console.log('Success on POST /physical/:location . Created point id: ' + physicalsGeoJSON.features[0].properties.id);
        res.status(201).send(physicalsGeoJSON);
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
    //     var physicalsGeoJSON = _models2GeoJSON(response);
    //     console.log('Success on POST /physical/:location . Created point: ' +  physicalsGeoJSON.features[0]);
    //     res.status(201).send(physicalsGeoJSON);
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
