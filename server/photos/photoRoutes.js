var photoController = require('./photoController.js');

module.exports = function(app) {
  app.post('/', photoController.postPhoto);
  app.get('/:id', photoController.getPhotoById);
  app.get('/byPhysical/:id', photoController.getPhotosByPhysical);
  app.get('/byUser/:id', photoController.getPhotosByUser);

};
