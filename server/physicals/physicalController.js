var knex = require('../db_schema').knex;
var Physical = require('./physical');

module.exports = {
  getAllPhysicals: function(req, res, next){
    knex('physicals')
      .select(knex.raw('ST_AsGeoJSON(geo) as geo, created_at, updated_at'))
      .then(function(results){
        var physicalsGeoJSON = this._dbRows2GeoJSON(results);
        console.log('Success on GET /physical . Returned ' +  physicalsGeoJSON.features.length + ' results.');
        res.status(200).send(physicalsGeoJSON);
        next();
      })
      .catch(function(err){
        console.log('Error on GET /physical/ : ', err);
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
    knex.raw('SELECT * FROM physicals WHERE ST_DWithin( physicals.geo::geography, ST_SetSRID(ST_Point(' + x + ',' + y + '), 4326)::geography, ' + proximity + ' )')
      .then(function(physicals){
        console.log('Success on GET /physical/:location . Returned ' +  physicals.rows.length + ' results.');
        res.status(200).send({physicals: physicals.rows});
        next();
      })
      .catch(function(err){
        console.log('Error on GET /physical/:location : ', err);
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
      })
      .catch(function(err){
        console.log("Error on GET /physical/:id : ", err);
        res.status(500).send(err);
      });
  },

  createNewPhysical: function(req, res, next){
    var x = req.body.geo[0],
        y = req.body.geo[1];
    // define insert query as knex raw SQL
    knex.raw('INSERT INTO physicals (geo) VALUES ( ST_SetSRID( ST_Point(' + x + ',' + y + ') , 4326) )')
      .then(function(response){
        console.log(response);
        res.status(201).send(response);
        next();
      })
      .catch(function(err){
        console.log(err);
        res.status(500).send(err);
        next();
      });

    // below code throws unlikely errors: https://github.com/tgriesser/bookshelf/issues/104
      // so we do the above to manually make the insert
    // var newPhysical = new Physical({ geo: knex.raw('ST_SetSRID( ST_Point(' + x + ',' + y + ') , 4326)') });
    // var newPhysical = new Physical().set('geo', knex.raw('ST_SetSRID( ST_Point(66,55) , 4326)'));
    // var newPhysical = new Physical({ geo: req.body.geo });

    // newPhysical.save().then(function(physical){
    //   res.status(201).send(physical.toJSON());
    //   next();
    // }).catch(function(err){
    //   console.log('Error creating new Physical: ', err);
    //   res.status(500).send(err);
    //   next();
    // });
  },

  _dbRows2GeoJSON: function(models){
    // expects an array of db rows, as returned by a Knex query
      // TODO: this should be reformatted to fit Bookshelf's Model.fetchAll() returned array of models,
      // once we jettison this cludgy reliance on raw knex queries
    var physicalsGeoJSON = {
      "type": "FeatureCollection",
      "features" : results.map(function(result){
        return {
          "type": "Feature",
          "properties": {
            "created_at": result.created_at,
            "updated_at": result.updated_at
          },
          "geometry": JSON.parse(result.geo)
        };
      })
    }; 
  }
};
