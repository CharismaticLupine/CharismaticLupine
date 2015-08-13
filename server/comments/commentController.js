var knex = require('../db_schema').knex;
var Comment = require('./comment');

module.exports = {

  getComments: function(req, res, next){
    var physicalId = JSON.parse(req.params['id']);
   
    Comment.where({physicals_id: physicalId}).fetchAll()
      .then(function(comments){
        console.log('Success on GET /comments/:id. Returned ' + comments.rows.length + ' results.');
        res.status(200).send(comments.rows);
        next();
      })
      .catch(function(err){
        console.log('Error on GET /comments/:id : ', err);
        res.status(500).send(err);
        next();
      });
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
      });
  },

  addComment: function(req, res, next){
    var userId = req.body.user;
    var text = req.body.text;
    var physicalId = req.body.phyiscal;
    // define insert query as knex raw SQL
    knex.raw('INSERT INTO comments (user_id, physicals_id, text) VALUES ( userId, physicalId, text )')
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
  }
};
