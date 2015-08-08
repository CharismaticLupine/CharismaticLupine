var physicalController = require('./physicalController');

module.exports = function(router){
  router.route('/:location')
    .get(physicalController.getNearbyPhysicals);
    
  router.route('/')
    .post(physicalController.createNewPhysical);
};
