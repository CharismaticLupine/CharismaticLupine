Welcome to the CharismaticLupine wiki!

**We Are:** a group of charismatics lupines.


## Database Setup
To build the database:

* install and run [PostgreSQL](http://postgresapp.com/).  *we recommend the postgres App over the homebrew instillation*
  * to initialize the database, navigate to the repo and run `./init.sh`.
  * to drop and rebuild the database, run `./reInit.sh`.
* run `node app/server` to start the server.

## Populate the Database with Sample Data
* run server with `nodemon server/server.js`
* in a new tab, run `./loadSampleData.sh`

## User Experience
    
### User Authentication Phase:

1. User opens app
    * client side httpinjector detects presence of token (as in shortly-angular)
    * if token present client sends GET request to `/users/signedin` to check validity of token and set session. NOTE: Current implementation tokens do not expire but if user is not found it responds with a 401
    * if not, client redirects to and renders a sign in page. (No API interaction has occured);

2. User signs in 
    * POST request to `/users/signin` JSON object containing username and password
    * if user is authenticated, response is JSON object containing {token: token}
    * if not, respond with error for either bad username or password

3. User signs up
    * POST request to `/users/signup` JSON object containing username and password
    * username already taken throws error
    * otherwise, response is JSON object containing {token: token}

### Physical Choosing Phase
At this point, the mobile user is at the camera screen. They must take a photo to get any further.

1. User takes a photo and chooses to send it to the server.
    * GET request to `/physical/X,Y` 
    * Server runs 'getNearbyPhysicals' and returns an object with 0+ physicals
    * On Client side:
        * Client determines if 0 or 1+ Physicals have been returned
            * If 1 or more Physicals
                * GET request to `photos/byPhysical/:id` for each physical (id is the PHYSICAL id)
                * Render physical chooser screen
                * record which physical user is adding to (one of which is 'new');
            * If 0 Physicals
                * record that user is creating new physical
    
### Physical Addition Phase 

1. Render comment addition screen
2. User chooses to add additional photo / comment to the physical
    * if NEW physical
        * POST request to `/physical` returns the Physical to client
    * in BOTH CASES
        * POST request to `/photos` 
        * POST request to `/comments` 
        * In both cases, clientApp redirects to a version of the comment addition screen with comment addition disabled.

## API Endpoints

POST `/physical`
  * create new physical
  * request body should be JSON: `{ "geo": [x,y] }`, where x=longitude and y=latitude using the CRS WGS-84 (EPSG:4326).

GET `/physical`
  * return GeoJSON representation of all physicals, where `geojson.features` is an array of JSON objects representing all physicals.  (*see notes on GeoJSON spec below*)

GET `/physical/id/:id`
  * return GeoJSON representation of one physical with the specified id.  If no id exists, `geoJSON.features` will be an empty array.

GET `/physical/:location`
  * return GeoJSON representation of all physicals within some distance of :location.
  * :location should be of the form x,y or longitude,latitude.  E.g. GET `/physical/-122.3955,37.7610`.  
  * proximity distance is specified within `physicalController.js` in the `getNearbyPhysicals()` controller.
  * *note*: for consistency and to avoid conflicts with other routes, should this route be changed to `/physical/location/:location`?

POST `/users/signup`
  * signs up user, returns JWT if sign up is successful
  * Request body should be {username: username, password: password}

POST `/users/signin`
  * signs in user, returns JWT if sign in is successful
  * Request body should be {username: username, password: password}

GET `/users/signedin`
  * checks token provided in `x-access-token` header
  * if valid, sends status (200) - if not (401)

POST `/comments`
  * Request body should be {physical: *id of physical*, text: *comment body*}
  * Adds comment to identified physical. Also associates with user (info provided in token)

GET `/comments/:physicalId`
  * Retrieves all comments for a given physical

POST `/photos`
  * Request body should be {physical: *id of physical*}
  * Request file should be the photo

GET `/photos/:id`
  * Responds with Photo with that PHOTO id

GET `/photos/byPhysical/:id`
  * Responds with {photos: [ARRAY OF PHOTO BUFFERS]

GET `/photos/byUser/:id`
  * Not currently implemented


## GeoJSON spec
All `/physical` route responses are formatted as [GeoJSON](http://geojson.org/) Feature Collections containing only point features.

```JSON
{
  "type": "FeatureCollection",
  "features" : [
    {
      "type": "Feature",
      "properties": { "prop": "val", ... }, 
      "geometry": { "type": "Point", "coordinates":[x,y] }
    },
    ...
  ]
}
```
* individual data points are stored as an array in `geojson.features`
* a data point's properties are stored in `feature.properties`
* a data point's point geometry is stored as an [x,y] array in `feature.geometry.coordinates`
