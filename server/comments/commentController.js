var knex = require('../db_schema').knex;
var Comment = require('./comment');

module.exports = {

  getComments: function(req, res, next){
    var physicalId = JSON.parse(req.params['id']);
    Comment.where({physicals_id: physicalId}).fetchAll()
      .then(function(comments){
        console.log('Success on GET /comments/:id. Returned ' + comments.models.length + ' results.');
        var coms = {list: comments.models};
        res.status(200).send(coms);
        next();
      })
      .catch(function(err){
        console.log('Error on GET /comments/:id : ', err);
        res.status(500).send(err);
        next();
      });
   
  },

  addComment: function(req, res, next){
    var userId = req.user.id; //user is created by helpers.decode
    var text = req.body.text;
    var physicalId = req.body.physical;

    // define insert query as knex raw SQL
    new Comment({user_id: userId, physicals_id: physicalId, text: text})
      .save()
      .then(function(model){
        console.log('Comment successfully added');
        res.status(201).send(model);
      });

   

    
  }
};
