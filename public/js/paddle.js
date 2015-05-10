/*
Defn of the paddle class
*/
function Paddle(xpos, ypos){
   // Add object properties like this
   this.xpos = xpos;
   this.ypos = ypos;
   this.velocity = 0.0;
   this.acceleration = .1;
   this.mass = 1;
}
Paddle.prototype.draw = function(ctx){
  ctx.fillStle="#000000";
  ctx.fillRect(this.xpos,this.ypos,100,5);
};

Paddle.prototype.update = function()
{

  if(_.contains(keysPressed, 37))
  {
    var adjustedAcceleration = this.acceleration;
    this.velocity = this.velocity-adjustedAcceleration;
  }
  if(_.contains(keysPressed, 39))
  {
    this.velocity = this.velocity+this.acceleration;
  }
  if(keysPressed.length==0)
  {
    if(this.velocity!=0){
      this.velocity = Math.sqrt(Math.abs(this.velocity)) * (Math.abs(this.velocity)/this.velocity);
    }
    if(Math.abs(this.velocity) < 1.5){
      this.velocity = 0;
    }
  }
  this.xpos = this.xpos + this.velocity;

  //simple bounds checking
  if(this.xpos<0)
  {
    this.xpos = 0;
    this.velocity = this.velocity+this.acceleration;
  }
  if((this.xpos+100)>c.width)
  {
    this.xpos = c.width - 100;
    this.velocity = this.velocity-this.acceleration;
  }

}
