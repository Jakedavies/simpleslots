// Require our dependencies
var express = require('express'),
  http = require('http'),
  handlebars = require('handlebars'),
  handlebarse = require('express-handlebars'),
  session = require('express-session'),
  bodyParser = require('body-parser');




// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 3000;


// Set handlebars as the templating engine
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebarse({defaultLayout: 'main'}));

//session secret
app.use(session({secret: 'sosecure'}));

//url encoding
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Set /public as our static content dir
app.use(express.static("public"));

// start the server
var server = http.createServer(app).listen(port, "0.0.0.0", function() {
  console.log('Express server listening on port ' + port);
});

//include routes
require ('./routes')(app);
