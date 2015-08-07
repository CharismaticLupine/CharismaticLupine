var Physical = require('./physical');

module.exports = {
  getNearbyPhysicals: function(req, res, next){
    // TODO: specify geo as query parameter
      // Physical.query().fetchAll(...)
    Physical.fetchAll({withRelated: ['user', 'comment']})
      .then(function(physicals){
        res.status(200).send(physicals.toJSON());
        next();
      });
  },

  createNewPhysical: function(req, res, next){
    // DEBUG: req.body is empty on all POST req
    var newPhysical = new Physical({ geo: req.body.geo })

    newPhysical.save().then(function(physical){
      res.status(201).send(physical.toJSON());
      next();
    }).catch(function(err){
      console.log('Error creating new Physical: ', err);
      res.status(500).send(err);
      next();
    });
  }
};
