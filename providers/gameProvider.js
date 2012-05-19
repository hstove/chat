var gameCounter = 0;

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

GameProvider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.authenticate('hank', 'pass', function(){ console.log('yo') });
  this.db.open(function(){});
};

GameProvider.prototype.getCollection = function(callback) {
  this.db.collection('games', function(error, games_collection) {
    if( error ) callback(error);
    else callback(null, games_collection);
  });
};

GameProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        games_collection.findOne({_id: games_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};
GameProvider.prototype.dummyData = [];

GameProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

GameProvider.prototype.save = function(games, callback) {
    this.getCollection(function(error, game_collection) {
        if( error ) callback(error)
        else {
            if( typeof(games.length)=="undefined")
                games = [games];

            for( var i =0;i< games.length;i++ ) {
                  game = games[i];
                  game.created_at = new Date();
                  if( game.comments === undefined ) game.comments = [];
                  for(var j =0;j< game.comments.length; j++) {
                        game.comments[j].created_at = new Date();
                  }
            }

            game_collection.insert(games, function() {
              callback(null, games);
            });
        }
    });
}

/*new GameProvider('0.0.0.0', process.env.PORT).save([{
    title: 'championchip',
    home: 'Gonzaga',
    away: 'Dematha' }], function(error, games){});*/

exports.GameProvider = GameProvider;