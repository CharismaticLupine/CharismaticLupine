var physicalController = require('./physicalController');

module.exports = function(router){
  router.route('/')
    .get(physicalController.getNearbyPhysicals)
    .post(physicalController.createNewPhysical);
};
