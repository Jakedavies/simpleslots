
var c = document.getElementById("gameCanvas");
var ctx = c.getContext('2d');
var gameAssets = [];
var keysPressed = [];
var socket;
var timeoutTime;
var waitingForPartner = true;


//game related contants
var paddleMoveSpeed = 6;
var updatesPerSecond = 60;


$(document).ready(function(){
  socket = io();
  $(document).keydown(function(event){
    KeyDown(event);
  });
  $(document).keyup(function(event){
    KeyUp(event);
  });
  socket.on('player_pos',function(data){
    gameAssets['player_2'].xpos = data.xpos;
  })
  socket.on('room_joined',function(data){
    // update something to indicate what room you are in
  });
  socket.on('players_ready',function(data){
    // start player ready sequence
  });
});

//begin gameloop
init();
function init()
{

  var xinit = 10;
  timeoutTime = 1000/updatesPerSecond;

  gameAssets['player_2'] = new Paddle(10,10);
  gameAssets['player_1'] = new Paddle(10,130);

  velocity = 0;
  acceleration = 0;

  //kick off game loop ** MUST COME LAST **
  gameLoop(5);
}

function gameLoop(xpos) {
  setTimeout(function() {
    update();
    redraw();
    gameLoop(++xpos); }, timeoutTime);
}
function update()
{
  gameAssets['player_1'].update();
  socket.emit('player_pos', gameAssets['player_1']);
}
function redraw()
{
  ctx.fillStyle="red";
  clearCanvas();
  gameAssets['player_1'].draw(ctx);
  ctx.fillStyle="blue";
  gameAssets['player_2'].draw(ctx);
}
function clearCanvas()
{
  ctx.clearRect( 0 , 0 , c.width, c.height );
}
function KeyDown(event) {
  var key = event.which;
  keysPressed.push(key);
}
function KeyUp(event) {
  var key = event.which;
  keysPressed = _.without(keysPressed, key);
}
