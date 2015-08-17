var physicalController = require('./physicalController');

module.exports = function(router){
  router.route('/')
    .post(physicalController.createNewPhysical)
    .get(physicalController.getAllPhysicals);

  router.route('/id/:id')
    .get(physicalController.getPhysicalById);
    
  router.route('/bbox/:bbox')
    .get(physicalController.getPhysicalsByBbox);

  router.route('/:location')
    .get(physicalController.getNearbyPhysicals);

};
