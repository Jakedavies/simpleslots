/*
Defn of the paddle class
*/
function Engine(xpos, ypos){
}
Engine.prototype.draw = function(ctx){
  ctx.fillStle="#000000";
  ctx.fillRect(this.xpos,this.ypos,100,5);
};
Engine.prototype.left = function(ctx){
  this.xpos = this.xpos -paddleMoveSpeed;
};
Engine.prototype.right = function(ctx){
  this.xpos = this.xpos+paddleMoveSpeed;
};
