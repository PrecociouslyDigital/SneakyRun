<<<<<<< HEAD
var game = new Phaser.Game(1200, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var enemy;
var map;
var layer;
var bullets;
var fireRate = 1000;
var nextFire = 0;
var guardTimer;
function preload() {
	//game.load.image('dude', 'dude.png');
	game.load.image('floor', 'assets/floor.png');
	game.load.tilemap('map', 'game.json', null, Phaser.Tilemap.TILED_JSON);
	game.world.setBounds(0,0,2000, 1500);
	game.load.spritesheet('guard', 'assets/guard.png', 32, 32, 5);
	game.load.spritesheet('player', 'assets/player.png', 32, 32, 5);

	game.load.image('wall', 'assets/wall.png');
	game.load.image('bullet','assets/bullet.png');
}

function create() {
	game.add.tileSprite(0, 0, 2400, 1280, 'floor');
	map = game.add.tilemap('map');
	map.addTilesetImage('wall','wall');
	map.setCollisionBetween(0,10);
	layer = map.createLayer('wall');
	layer.resizeWorld();

	bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
	
	player = game.add.sprite(80, 100, 'player');
    player.animations.add('walk', [0, 1, 2, 3, 4, 3, 2, 1]);
	player.animations.play('walk', 9, true);
	
	player.enableBody = true;
	layer.enableBody = true;
	

	game.physics.enable(player);
	game.physics.enable(layer);
    game.camera.follow(player);
	player.anchor.setTo(.5,.5);
	player.body.width = 25;
    player.body.height = 25;
	enemy = game.add.group();
	enemy.enableBody = true;
	createAI(96,256,180,enemy);
	createAI(350,730,0, enemy);
	createAI(96,960,120,enemy);
	createAI(448,1184,0,enemy);
	createAI(768,1056,225,enemy);
	createAI(608,736,45,enemy);
	createAI(960,512,190,enemy);
	createAI(544,96,180,enemy);
	createAI(1024,288,0,enemy);
	createAI(1216,96,135,enemy);
	createAI(1184,384,135,enemy);
	createAI(1472,704,0,enemy);
	createAI(928,1024,90,enemy);
	createAI(1888,1152,315,enemy);
	createAI(1920,576,270,enemy);
	createAI(1632,96,90,enemy);
	createAI(2048,192,45,enemy);
	createAI(2272,768,270,enemy);
	createAI(2304,960,225,enemy);
	
	//guardTimer = new Phaser.Timer(game, true);
}

function killOnContact(sprite,player){
		sprite.kill();
}
function killOnContact2(sprite,ayy){
		ayy.kill();
}
function update() {
	if(player.x != game.input.mousePointer.x||player.y != game.input.mousePointer.y){
		player.angle = game.math.radToDeg(game.physics.arcade.moveToPointer(player, 200, game.input.mousePointer)+90);
	}
	game.physics.arcade.overlap(player,layer,function(sprite,player){
		killOnContact(sprite,player);
		alert("you died, you filthy casual.");
		game.state.start(game.state.current);
	});
	game.physics.arcade.overlap(player,enemy,killOnContact2);
	enemy.forEach(function(thing){thing.ai();});
	game.physics.arcade.overlap(bullets,layer,killOnContact);
	game.physics.arcade.overlap(player,bullets,function(sprite,player){
		killOnContact(sprite,player);
		alert("you died, you filthy casual.");
		game.state.start(game.state.current);
	});
}
function ai(){
	if(this.canSee()){
		fire(this);
		this.lastSeen = new Phaser.Point(player.x,player.y);
		this.seen = true;
		this.angle = game.math.radToDeg(game.physics.arcade.angleBetween(this, player)) + 90;
	}else if(this.seen){
		this.wayPoints.push(this.lastSeen);
		this.wayPoints.push(this.lastPos);
		this.angle = game.math.radToDeg(game.physics.arcade.moveToXY(this,this.lastSeen.x,this.lastSeen.y,100)) + 90;
		this.animations.play("walk",9,true);
		this.target = this.lastSeen;
		this.seen = false;
	}
	if(this.wayPoints[0])
		if(differPoint(this,this.wayPoints[0], 20)){
			this.wayPoints.shift();
			if(this.wayPoints[0]){
				this.angle = game.math.radToDeg(game.physics.arcade.moveToXY(this,this.wayPoints[0].x,this.wayPoints[0].y,100)) + 90;
				this.animations.play("walk", 9,true);
			}else{
				if(!differPoint(this,this.lastPos, 20)){
					this.angle = game.math.radToDeg(game.physics.arcade.moveToXY(this,this.lastPos.x,this.lastPos.y,100)) + 90;
				}else{
					this.body.velocity = new Phaser.Point();
					this.animations.play("stand", 1,true);
				}
			}
		}
}
function canSee(){
	var dist = 500;
	if(!this.alive)
		return false;
	if(game.physics.arcade.distanceBetween(this,player) > dist)
		return false;
	var fov = 0.3;
	if(game.physics.arcade.angleBetween(this, player) - this.getFacing() < fov && game.physics.arcade.angleBetween(this, player) - this.getFacing() > -fov){
		var ray = new Phaser.Line(this.x,this.y,player.x,player.y);
		var tileHits = layer.getRayCastTiles(ray, 4, false, false);
		for(var i = 0; i < tileHits.length; i++){
			if(tileHits[i].index != -1)
				return false;
		}

		return true;
	}else{
		return false;
	}
}
function getFacing(){
	return game.math.degToRad(this.angle - 90);
}
function createAI(x,y,angle,group){
	var guard = group.create(x, y, 'guard');
	guard.lastPos= new Phaser.Point(x,y);
	guard.animations.add('walk', [0, 1, 2, 3, 4, 3, 2, 1]);
	guard.animations.add('stand', [2]);
	guard.angle = angle;
	guard.ai = ai;
	guard.canSee= canSee;
	guard.anchor.setTo(0.5,0.5);
	guard.getFacing = getFacing;
	guard.wayPoints = [];
	guard.seen = false;
	return guard;
}

function fire(thing) {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(thing.x - 8, thing.y - 8);

        game.physics.arcade.moveToXY(bullet,player.x - 60 + 120 * Math.random(),player.y - 60 + 120 * Math.random(), 500);
    }

}
function differBy(x,y,diff){
	return x-y < diff && x-y > -diff;
}
function differPoint(x,y,diff){
	return differBy(x.x,y.x, diff) && differBy(x.y,y.y,diff);
}