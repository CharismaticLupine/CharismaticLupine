var express = require('express');
var app = express();


app.configure(function() {
  //serve static assets
  app.use(express.static(__dirname + '/public'));
});

app.get('/physical/loc', function(){}/* Respond w Physicals */);

app.post('/physical', function(){}/* Add Comment */);

app.post('/physical/id/comment', function(){} /* Append */);

app.post('/physical/id/image', function(){}/* post image */);

module.exports = app;