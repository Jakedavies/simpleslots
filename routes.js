redis = require("redis");

var redisClient = redis.createClient();

module.exports = function(app){
    app.get('/', function(req,res){
        var message = '';
        if(req.query.error  == 'credits'){
            message = 'You ran out of credits, log in again to play more!'
        }
        res.render('home',{msg: message});
    });

    app.post('/login',function(req,res){

        var username = req.body.username;
        console.log('checking username '+username);
        redisClient.get(username,function(err,reply){
            //if the user does not exist, create
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
            req.session.username = username;
            res.redirect('/play')
        });

    });

    app.get('/play',function(req,res){
        //if the users session exists they can play, if not redirect to login
        if(req.session.credits)
        {
            res.render('play', {credits: req.session.credits});
        }
        else{
            res.redirect('/');
        }
    });

    app.post('/spin',function(req,res){
        var spin = simulateSpin();
        var score = calculateResult(spin);
        var message = getMessage(score);

        var newCredits = req.session.credits-1 + score;
        req.session.credits =newCredits;
        redisClient.set(req.session.username, newCredits);
        res.setHeader('Content-Type', 'application/json');

        //if the user still has credits
        if(req.session.credits> 0 )
        {
            //send json response with data about the spin
            res.end(JSON.stringify(
                {
                    spinResult: spin,
                    credits: req.session.credits,
                    message: message,
                    winner: score>0
                }));
        }
        //else out of credits
        else{
            //delete username from redis
            redisClient.delete(req.session.username);

            res.redirect('/login?error=credits')
        }

    });


    /*
        Additional Functions
     */

    //simulates a spin with 8 random numbers
    function simulateSpin(){
        //prevents calling Math.random 9 times for performance
        var spinResult = Math.floor(Math.random()*1000000000).toString();
        var result = {1:[stringToBase3(spinResult[0]),stringToBase3(spinResult[1]),stringToBase3(spinResult[2])],
            2: [stringToBase3(spinResult[3]),stringToBase3(spinResult[4]),stringToBase3(spinResult[5])],
            3: [stringToBase3(spinResult[6]),stringToBase3(spinResult[7]),stringToBase3(spinResult[8])]};
        console.log(result);
        return result;
    }
    //message depending on the score
    function getMessage(score){
        if(score == 0){
            return 'Better luck next time!'
        }
        //if score is > 12 that means multiple rows matched.
        else if(score>12){
            return 'Big winner! You won '+score + ' credits.';
        }
        else{
            return 'Congrats! You won '+score+ ' credits.'
        }
    }
    function calculateResult(spinResult){
        var score = 0;
        //checking if columns 2 and 3 match column 1
        if(spinResult[1][0] == spinResult[2][0] && spinResult[1][0] == spinResult[3][0]){
            score+= spinResult[1][0]*4;
        }
        if(spinResult[1][1] == spinResult[2][1] && spinResult[1][1] == spinResult[3][1]){
            score+= spinResult[1][1]*4;
        }
        if(spinResult[1][2] == spinResult[2][2] && spinResult[1][2] == spinResult[3][2]){
            score+= spinResult[1][2]*4;
        }
        return score;
    }
    //converts a string 0-9 number to integer of 1-3
    function stringToBase3(number){
        return (parseInt(number)%3)+1
    }
};