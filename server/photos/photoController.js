var Photo = require('./photo.js');

var savePhotoToFs = function(photoId) {

};

var getPhotoFromFs = function(photoId) {

};

module.exports = {
  postPhoto: function(req, res, next) {
    /**
     * DEBUG: Doesn't work.
     * Saves photo to filesystem as id.jpg
     * then saves relationship to database
     */
    // var user_id = req.body.user_id || 1;//remove default value
    // var physical_id = req.body.physical_id || 1;//remove default value
    // var photoAsset = req.file; // need correct body parser

    // var newPhoto = new Photo({ 'physicals_id': physical_id, 'user_id': user_id });
    // //save photo to filesystem
    // newPhoto.save() // placeholder so node doesn't throw errors
    // .then(function(){ return newPhoto.save() })
    // .then(function(photo){
    //   res.status(201).send(photo.toJSON());
    // }).catch(function(err){
    //   console.log('Error creating new Photo: ', err);
    //   res.status(500).send(err);
    // });
  },
  getPhoto: function(req, res, next) {
    res.status(200).send("test");
  }
};
