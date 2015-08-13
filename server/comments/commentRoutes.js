var commentController = require('./commentController');

module.exports = function(router){
  router.route('/')
    .post(commentController.addComment);

  router.route('/:id')
    .get(commentController.getComments);
    
};

