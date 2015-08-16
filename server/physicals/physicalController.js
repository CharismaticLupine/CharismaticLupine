require('../photos/photo');
require('../comments/comment');
require('./physical');

var knex = require('../db_schema').knex;
var _ = require('underscore');

////////////////////////////////
// geographic utility functions
////////////////////////////////
  // move these to a new module?

_dbRows2GeoJSON = function(results){
  // expects an array of db rows, as returned by a Knex query
    // TODO: this should be reformatted to fit Bookshelf's Model.fetchAll() returned array of models,
    // once we jettison this cludgy reliance on raw knex queries
  return {
    "type": "FeatureCollection",
    "features" : results.map(function(result){
      return {
        "type": "Feature",
        "properties": _.omit(result, ['geo', 'geojson']),
        "geometry": JSON.parse(result.geojson)
      };
    })
  };
};


module.exports = {
  getAllPhysicals: function(req, res, next){
    // knex('physicals')
    //   .select(knex.raw('ST_AsGeoJSON(geo) as geojson, created_at, updated_at'))
    //   .then(function(results){
    //     var physicalsGeoJSON = _dbRows2GeoJSON(results);
    //     console.log('Success on GET /physical . Returned ' +  physicalsGeoJSON.features.length + ' results.');
    //     res.status(200).send(physicalsGeoJSON);
    //     next();
    //   })
    //   .catch(function(err){
    //     console.log('Error on GET /physical/ : ', err);
    //     console.log(err.stack);
    //     res.status(500).send(err);
    //     next();
    //   });
    Physical.forge()
      .query('select', ['id', 'created_at', 'updated_at', knex.raw('ST_AsGeoJSON(geo) as geojson')])
      .fetchAll({ withRelated: ['comments', 'photos'] })
      .then(function(results){
        results = _.map(results.models, function(model){
          return model.toJSON();
        });
        var physicalsGeoJSON = _dbRows2GeoJSON(results);
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
    var proximity = 160, // meters // this should be lowered, probably, to something like 20 meters (depending on avg GPS error, yeah?)
        // x = JSON.parse(req.params['longitude'])[0],
        // y = JSON.parse(req.params['latitude'])[1];
        location = req.params['location'].split(',');
    var x = location[0];
    var y = location[1];
    // Physical.fetchAll({withRelated: ['user', 'comment']})
    //   .then(function(physicals){
    //     res.status(200).send(physicals.toJSON());
    //     next();
    //   });

    // above code throws unlikely errors: https://github.com/tgriesser/bookshelf/issues/104
      // so we do the below to manually make the select
      // use ::geography to cast from geometry to geography type, so that distance measurements are correct
    knex.raw('SELECT *, ST_AsGeoJSON(geo) as geojson FROM physicals WHERE ST_DWithin( physicals.geo::geography, ST_SetSRID(ST_Point(' + x + ',' + y + '), 4326)::geography, ' + proximity + ' )')
      .then(function(results){
        var physicalsGeoJSON = _dbRows2GeoJSON(results.rows);
        console.log('Success on GET /physical/:location . Returned ' +  physicalsGeoJSON.length + ' results.');
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
      .fetch({ withRelated: ['comments', 'photos'] })
      .then(function(physical){
        console.log('Success on GET /physical/:id . Returned physical ' +  physical.id );
        res.status(200).send({ physicals: [physical] });
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
    // define insert query as knex raw SQL
    knex('physicals') //.raw('INSERT INTO physicals (geo) VALUES ( ST_SetSRID( ST_Point(' + x + ',' + y + ') , 4326) )')
      .insert({ 'geo': knex.raw('ST_SetSRID( ST_Point(?, ?) , 4326)', [x, y]) })
      .returning([ 'id', knex.raw('ST_AsGeoJSON(geo) as geojson') ])
      .then(function(response){
        var physicalsGeoJSON = _dbRows2GeoJSON(response);
        console.log('Success on POST /physical/:location . Created point: ' +  physicalsGeoJSON.features[0]);
        res.status(201).send(physicalsGeoJSON);
        next();
      })
      .catch(function(err){
        console.log("Error on POST /physical ", err);
        console.log(err.stack);
        res.status(500).send(err);
        next();
      });
  },
};
