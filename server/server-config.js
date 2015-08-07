var express = require('express');
var bodyParser = require('body-parser');
var Physical = require('./models/physical');
var app = express();

//serve static assets
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/physical', function(req, res){
  // TODO: specify location as query parameter
    // Physical.query().fetchAll(...)
  Physical.fetchAll({withRelated: ['user', 'comment']})
    .then(function(physicals){
      res.send(200, physicals.toJSON());
    });
});

app.post('/physical', function(req, res){
  var newPhysical = new Physical({ geo: req.body.geo })

  newPhysical.save().then(function(physical){
    res.send(physical.toJSON());
  }).catch(function(err){
    console.log('Error creating new Physical: ', err);
    res.send(500, err);
  });
});

app.post('/physical/:id/comment', function(){} /* Append */);

app.post('/physical/:id/image', function(){}/* post image */);

module.exports = app;
