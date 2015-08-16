var knex = require('knex')({
  client: 'pg',
  debug: true,
  connection: {
    host     : '127.0.0.1',
    // user     : 'snap',
    // password : 'snap',
    database : 'snap',
    charset  : 'utf8'
  }
});

var db = require('bookshelf')(knex);
// registry plugin to help with circular dependencies: https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
db.plugin('registry');

db.knex.schema.hasTable('physicals').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('physicals', function(physicals){
      physicals.increments('id').primary();
      physicals.specificType('geo', 'geometry(POINT,4326)'); // table.specificType(column, value)
      physicals.timestamps();
    }).then(function(physicals){
      console.log('Create Table Physicals');
    }).catch(function(err){
      console.log('error creating table Physicals: ', err);
    });
  }
});

db.knex.schema.hasTable('photos').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('photos', function(photos){
      photos.increments('id').primary();
      photos.integer('physicals_id').references('id').inTable('physicals');
      photos.integer('user_id').references('id').inTable('users');
      photos.timestamps();
    }).then(function(photos){
      console.log('Create Table Photos');
    }).catch(function(err){
      console.log('error creating table Photos: ', err);
    });
  }
});

db.knex.schema.hasTable('comments').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('comments', function(comments){
      comments.increments('id').primary();
      comments.text('text');
      comments.integer('physicals_id').references('id').inTable('physicals');
      comments.integer('user_id').references('id').inTable('users');
      comments.timestamps();
    }).then(function(comments){
      console.log('Create Table Comments');
    }).catch(function(err){
      console.log('error creating table Comments: ', err);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('users', function(users){
      users.increments('id').primary();
      users.string('user_name', 20).unique();
      users.string('password');
      users.timestamps();
    }).then(function(users){
      console.log('Create Table Users');
    }).catch(function(err){
      console.log('error creating table Users: ', err);
    });
  }
});

module.exports = db;
