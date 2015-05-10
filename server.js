// Require our dependencies
var express = require('express'),
  http = require('http')
  handlebars = require('handlebars'),
  handlebarse = require('express-handlebars');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 3000;
// Set handlebars as the templating engine


app.set('view engine', 'handlebars');
app.engine('handlebars', handlebarse({defaultLayout: 'main'}));

// Index Route


// Set /public as our static content dir
app.use(express.static("public"));

// Fire it up (start our server)
var server = http.createServer(app).listen(port, "0.0.0.0", function() {
  console.log('Express server listening on port ' + port);
});

//include routes
require ('./routes')(app);


// Initialize socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  assignToFreeRoom(socket);
  //player disconnecting
  socket.on('disconnect',function(data){
    dropFromRoom(socket);
  });
  //player requesting to join room
  socket.on('join', function (data) {
    assignToFreeRoom(socket);
    socket.emit('room_joined', {id: getRoomId()});
  });
  //automatic position broadcast once player starts game
  socket.on('roll', function (data) {
    socket.emit(simulateRoll())
  });
});
function simulateRoll()
{

}
