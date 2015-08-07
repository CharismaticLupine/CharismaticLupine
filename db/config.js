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

db.knex.schema.hasTable('photos').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('photos', function(photos){
      photos.increments('id').primary();
      photos.integer('physical_id').references('id').inTable('physical');
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
      comment.integer('physical_id').references('id').inTable('physical');
      photos.integer('user_id').references('id').inTable('users');
      photos.timestamps();
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
