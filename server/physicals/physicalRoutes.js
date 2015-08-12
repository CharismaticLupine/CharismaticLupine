var physicalController = require('./physicalController');

module.exports = function(router){
  router.route('/')
    .post(physicalController.createNewPhysical)
    .get(physicalController.getAllPhysicals);

  router.route('/:location')
    .get(physicalController.getNearbyPhysicals);
    
};
