var knex = require('../db_schema').knex;
var Physical = require('./physical');

module.exports = {
  getAllPhysicals: function(req, res, next){
    Physical.fetchAll().then(function(collection){
      var physicals = collection.toJSON();
      console.log('Success on GET /physical . Returned ' +  physicals + ' results.');
      res.status(200).send(physicals);
      next();
    })
    .catch(function(err){
      console.log('Error on GET /physical/:location : ', err);
      res.status(500).send(err);
      next();
    })
  },

  getNearbyPhysicals: function(req, res, next){
    var proximity = 50, // meters
        x = JSON.parse(req.params['location'])[0],
        y = JSON.parse(req.params['location'])[1];
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
        res.status(200).send(physicals.rows);
        next();
      })
      .catch(function(err){
        console.log('Error on GET /physical/:location : ', err);
        res.status(500).send(err);
        next();
      })
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
      })

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
  }
};
