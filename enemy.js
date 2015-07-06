var enemies = platforms = game.add.group();
var enemySpeed = 5;
var fov = 1;
var searchRad = 10;
function addEnemy(x,y){
	var enemy = platforms.create(x, y, 'enemy');
	game.physics.arcade.enable(enemy);
	enemy.setTarget = setTarget;
	enemy.speed = enemySpeed;
	enemy.seePlayer = seePlayer;
	enemy.ai = ai;
	enemy.search = false;
}
function setTarget(x,y){
	this.startPoint = new Point(this.x, this.y);
	this.target = new Point(x,y);
	this.body.velocity = this.target;
	this.body.velocity.normalize();
}
function checkThere(){
	if(physics.arcade.distanceToXY(this, this.target.x,this.target.y) < searchRad){
		return true;
	}
}
function seePlayer(){
	//Remember to rename
	if(physics.arcade.angleToPointer(this, player) < fov && physics.arcade.angleToPointer(this, player) > -fov){
		var ray = new Line(this.body.x,this.body.y,player.body.x,player.body.y);
		tileHits = layer.getRayCastTiles(line, 4, false, false);
		return tileHits.length == 0;
	}else{
		return false;
	}
}
function ai(){
	console.log(this.seePlayer);
}