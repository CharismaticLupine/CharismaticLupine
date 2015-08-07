var photoController = require('./photoController.js');

module.exports = function(app) {
  app.post('/', photoController.postPhoto);
  app.get('/', photoController.getPhoto);

};
