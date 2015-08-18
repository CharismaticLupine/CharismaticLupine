var morgan      = require('morgan'); // used for logging incoming request
var cors        = require('cors');
var bodyParser  = require('body-parser');
var helpers     = require('./helpers.js'); // our custom middleware
var multer      = require('multer');



module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var physicalRouter = express.Router();
  var photoRouter = express.Router();
  var commentRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(multer().single('photo'));
  app.use(bodyParser.json());
  app.use(cors());
  //TODO: Set Static Directory
  app.use(express.static(__dirname + '/../../web'));

  app.use('/users', userRouter); // use user router for all user request

  // authentication middleware used to decode token and made available on the request
  // 'helpers.decode' allows our routes to access the user stored in the token within each controller
  app.use('/photo', helpers.decode);
  app.use('/comments', helpers.decode);
  app.use('/physical', physicalRouter); // user link router for link request
  app.use('/photo', photoRouter);
  app.use('/comments', commentRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../users/userRoutes.js')(userRouter);
  require('../photos/photoRoutes.js')(photoRouter);
  require('../physicals/physicalRoutes.js')(physicalRouter);
  require('../comments/commentRoutes.js')(commentRouter);
};

/*  Adding comment here to document our API interaction as I (Rob) understand it. 
    This will need to get moved to a more appropriate place later. 
    
  USER AUTHENTICATION PHASE:

    1. User opens app
       --> client side httpinjector detects presence of token (as in shortly-angular)
         a. if token present client sends GET request to 'users/signedin' 
            to check validity of token and set session. Current implementation tokens do not expire 
            but if user is not found it responds with a 401
         b. if not, client redirects to and renders a sign in page. (No API interaction has occured);

    2. User signs in 
       --> post request to 'users/signin' json object containing username and password
         a. if user is authenticated, response is JSON object containting {token: token}
         b. if not, throw error for either bad username or password

    3. User signs up
       --> post request to 'users/signup' json object containing username and password
         a. username already taken throws error
         b. otherwise, response is JSON object containting {token: token}

  PHYSICAL CHOOSING PHASE
    At this point, the mobile user is at the camera screen. They must take a photo to get any further.

    1. User takes a photo and chooses to send it to the server.
      --> GET request to 'physicals/X,Y' 
        Server runs 'getNearbyPhysicals' and returns an object with 0+ physicals
        On Client side:
          a. determines if its 0 or 1+
            i.  if 1+
              a. GET request to 'photos/:id' for each physical
              b. render physical chooser screen
              c. record which physical user is adding to (one of which is 'new');
              c. GET request to 'comments/:id' 
              d. render comment addition screen
            ii.  if 0+
              a. record that user is creating new physical
              b. render comment addition screen
    
  PHYSICAL ADDITION PHASE

    1. User chooses to add additional photo / comment to the physical
      a. if NEW physical
      --> POST request to 'physical'  ***WHAT DOES THIS OBJECT LOOK LIKE?***
          returns 'phsyicalId' to client
      b. if NEW or NOT
      --> POST request to 'photos' with phsyicalId, userId and photoData
      --> POST request to 'comments' with physicalId, userId, and commentData
    2. in both cases, clientApp redirects to a version of the comment addition screen with comments disabled.


*/
