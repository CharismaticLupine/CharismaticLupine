var express = require('express');
var bodyParser = require('body-parser');
var Physical = require('./models/physical');
var app = express();

//parse req data
app.use(bodyParser.json());
//serve static assets
app.use(express.static(__dirname + '/public'));

app.get('/physical', function(req, res){
  // TODO: specify geo as query parameter
    // Physical.query().fetchAll(...)
  Physical.fetchAll({withRelated: ['user', 'comment']})
    .then(function(physicals){
      res.status(200).send(physicals.toJSON());
    });
});

app.post('/physical', function(req, res){
  // DEBUG: req.body is empty on all POST req
  var newPhysical = new Physical({ geo: req.body.geo })

  newPhysical.save().then(function(physical){
    res.status(201).send(physical.toJSON());
  }).catch(function(err){
    console.log('Error creating new Physical: ', err);
    res.status(500).send(err);
  });
});

app.post('/physical/:id/comment', function(){} /* Append */);

app.post('/physical/:id/image', function(){}/* post image */);

module.exports = app;
