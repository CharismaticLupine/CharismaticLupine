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
  });
};

var getPhotoFromFs = function(photoId) {
  var filePath = __dirname + '/../../photos/' + photoId + '.jpg';
  return fs.readFileAsync(filePath);
};

module.exports = {
  postPhoto: function(req, res, next) {
   
    var userId = req.body.user || 1; //remove default value
    var physicalId = req.body.physical || 1; //remove default value
    var photoAsset =  req.file.buffer;

    var newPhoto = new Photo({ 'physicals_id': physicalId, 'user_id': userId });
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
  getPhotoById: function(req, res, next) {
    var photoId = req.params.id;
    getPhotoFromFs(photoId)
    .then(function(val) {
      res.status(200).send({data: val});
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
  },
  getPhotosByPhysical: function(req, res, next) {
    var physicalId = req.params.id;
    var result = {photos: []};
    Photo.where({physical_id: physicalId}).fetchAll()
      .then(function(photos){
        
        photos.models.forEach(function(dbPhoto){
          getPhotoFromFs(dbPhoto.id)
            .then(function(photo){
              result.photos.push(photo);
            })
            .catch(function(err){
              res.status(500).send(err);
            });
        });
        res.status(200).send(result);      
      })
      .catch(function(err){
        req.status(500).send(err);
      });

    getPhotoFromFs(photoId)
    .then(function(val) {
      res.status(200).send(val);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
  },
  getPhotosByUser: function(req, res, next) {
    //TODO: Write this function if we require this functionality
  }
};
