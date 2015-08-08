var morgan      = require('morgan'); // used for logging incoming request
var bodyParser  = require('body-parser');
var helpers     = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var physicalRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  //TODO: Set Static Directory
  app.use(express.static(__dirname + '/../../client'));

  app.use('/users', userRouter); // use user router for all user request

  // authentication middleware used to decode token and made available on the request
  // app.use('/physical', helpers.decode);
  app.use('/physical', physicalRouter); // user link router for link request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  // require('../users/userRoutes.js')(userRouter);
  require('../physicals/physicalRoutes.js')(physicalRouter);
};
