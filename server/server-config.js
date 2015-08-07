var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.configure(function() {
  //serve static assets
  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser);
});

app.get('/physical', function(req, res){
});

app.post('/physical', function(){}/* Add Comment */);

app.post('/physical/id/comment', function(){} /* Append */);

app.post('/physical/id/image', function(){}/* post image */);

module.exports = app;
