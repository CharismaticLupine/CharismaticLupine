var Photo = require('./photo.js');
var bluebird = require('bluebird');
var fs = require('fs');
bluebird.promisifyAll(fs);

var savePhotoToFs = function(photoId, buffer) {
  var filePath = __dirname + '/../../photos/' + photoId + '.jpg';
  fs.writeFileAsync(filePath, buffer)
  .then(function() {
    console.log('Wrote photo to disk');
    return true;
  })
  .catch(function(err) {
    console.error('Tried to save photo to disk: ', err);
     return err;
  })
};

var getPhotoFromFs = function(photoId) {
  var filePath = __dirname + '/../../photos/' + photoId + '.jpg';
  return fs.readFileAsync(filePath);
};

module.exports = {
  postPhoto: function(req, res, next) {
    /**
     * DEBUG: Doesn't work.
     * Saves photo to filesystem as id.jpg
     * then saves relationship to database
     */
    var user_id = req.body.user_id || 1; //remove default value
    var physical_id = req.body.physical_id || 1; //remove default value
    var photoAsset =  'This is a mocked photo'; //req.file; // needs correct body parser

    var newPhoto = new Photo({ 'physicals_id': physical_id, 'user_id': user_id });
    newPhoto.save()
    .then(function(photo){
      var photoId = photo.id;
      return savePhotoToFs(photo.id, photoAsset);
    })
    .then(function(photo){
      res.status(201).send('aww ya');
    }).catch(function(err){
      res.status(500).send(err);
    });
  },
  getPhoto: function(req, res, next) {
    var photoId = req.params.id;
    getPhotoFromFs(photoId)
    .then(function(val) {
      res.status(200).send(val);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
  }
};
