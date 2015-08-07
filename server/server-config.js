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
      res.send(physicals.toJSON());
    });
});

app.post('/physical', function(req, res){
});

app.post('/physical/:id/comment', function(){} /* Append */);

app.post('/physical/:id/image', function(){}/* post image */);

module.exports = app;
