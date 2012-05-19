/*
 * GET home page.
 */

var GameProvider = require('../providers/gameProvider.js').GameProvider;
var gameProvider = new GameProvider('127.0.0.1', 27017);
exports.index = function(req, res){
    //console.log(req);
    gameProvider.findAll(function(error, games){
        res.render('index', { title: 'Express', games: games });
    });
};