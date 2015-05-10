redis = require("redis");

var redisClient = redis.createClient();

module.exports = function(app){
    app.get('/', function(req,res){
        res.render('home');
    });
    app.post('/login',function(req,res){
        redisClient.set(req.param('username'),20);
        res.redirect('/play')
    })
    app.post('/play',function(req,res){
        redisClient.set(req.param('username'),20);
        res.redirect('/play')
    })
}