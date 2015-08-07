var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    // user     : 'snap',
    // password : 'snap',
    database : 'snap',
    charset  : 'utf8'
  }
});

var db = require('bookshelf')(knex);

db.knex.schema.hasTable('physical').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('physical', function(physical){
      physical.increments('id').primary();
      physical.specificType('geo', 'geometry(POINT,4326)'); // table.specificType(column, value)
      physical.timestamps();
    }).then(function(physical){
      console.log('Create Table Physical');
    }).catch(function(err){
      console.log('error creating table Physical: ', err);
    });
  }
});

module.exports = db;
