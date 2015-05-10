redis = require("redis");

var redisClient = redis.createClient();

module.exports = function(app){
    app.get('/', function(req,res){
        res.render('home');
    });
    app.post('/login',function(req,res){

        var username = req.body.username;
        console.log('checking username '+username);
        redisClient.get(username,function(err,reply){
            console.log(err);
            console.log(reply);
            if(reply == null)
            {
                redisClient.set(username,20);
                req.session.credits = 20;
                console.log('no user found, creating new');
            }
            else{
                req.session.credits = reply;
                console.log('user found, setting credits to '+ reply);

            }
            res.redirect('/play')
        });

    });
    app.get('/play',function(req,res){
        if(req.session.credits)
        {
            res.render('play', {credits: req.session.credits});
        }
        else{
            res.redirect('/');
        }
    });
    app.post('/spin',function(req,res){
        res.json([[1,2,1][2,3,1][3,3,2]]);
    })
}