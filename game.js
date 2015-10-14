var game = new Phaser.Game(1200, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var play;
var player;
var enemy;
var map;
var layer;
var stairs;
var bullets;
var fireRate = 1000;
var nextFire = 0;
var guardTimer;
var door1;
var door2;
var key1;
var key1value = 0;
var key2;
var key2value = 0;
var music;
var shot;
var timer;
var timerText;
var timerValue
var startScreen;
var instructionsBox;
var instructions;
var triesSoFar = 0;
//var livesNum=2;
//var livesText;
var instructionsDown;
function preload() {
	//game.load.image('instructionsDown', 'assets/instructionsDown.png');
	game.load.image('instructionsBox', 'assets/dude.png');
	game.load.image('instructions', 'assets/instructions.png');
	game.load.image('startScreen', 'assets/startscreen.png');
	game.load.image('floor', 'assets/floor.png');
	game.load.tilemap('map', 'game.json', null, Phaser.Tilemap.TILED_JSON);
	game.world.setBounds(0,0,2000, 1500);
	game.load.spritesheet('guard', 'assets/guard.png', 32, 32, 5);
	game.load.spritesheet('player', 'assets/player.png', 32, 32, 5);
	game.load.audio('music', 'assets/bgmusic.ogg','assets/bgmusic.mp3');
	game.load.audio('shot', 'assets/shot.ogg', 'assets/shot.mp3');
	game.load.image('wall', 'assets/wall.png');
	game.load.image('bullet','assets/bullet.png');
	game.load.image('stairs', 'assets/stairs.png');
	game.load.image('door1', 'assets/door1.png');
	game.load.image('door2', 'assets/door2.png');
	game.load.image('key1', 'assets/key1.png');
	game.load.image('key2', 'assets/key2.png');
}

function create() {
	game.scale.maxWidth = 1200;
    game.scale.maxHeight = 700;
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();

	timer = game.time.create();
	timer.add(350000, function(){
		alert('Game over! Out of time!');
		game.state.start(game.state.current);
	}, this, 0);
	timer.start();
	
	game.sound.destroy();
	music = game.add.audio('music');
	music.loop = true;
	music.play();
	shot = game.add.audio("shot");
	shot.allowMultiple = true;
	game.add.tileSprite(0, 0, 2400, 1280, 'floor');
	stairs = game.add.sprite(2256, 1248, 'stairs');
	stairs.anchor.setTo(0.5,0);
	stairs.enableBody = true;

	door1 = game.add.sprite(1984, 112, 'door1');
	door1.anchor.setTo(0,0.5);
	door2 = game.add.sprite(2128, 864, 'door2');
	door2.anchor.setTo(0.5,0);

	key1 = game.add.sprite(960, 896, 'key1');
	key1.anchor.setTo(0.5,0.5);
	key2 = game.add.sprite(300, 500, 'key2');
	key2.anchor.setTo(0.5,0.5);

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
	bullets.setAll('body.width', 10);
	bullets.setAll('body.height', 10);

	player = game.add.sprite(80, 100, 'player');
    player.animations.add('walk', [0, 1, 2, 3, 4, 3, 2, 1]);
	player.animations.play('walk', 9, true);

	player.enableBody = true;
	layer.enableBody = true;

	door1.enableBody = true;
	door2.enableBody = true;
	key1.enableBody = true;
	key2.enableBody = true;
	game.physics.enable(door1);
	game.physics.enable(door2);
	game.physics.enable(key1);
	game.physics.enable(key2);


	game.physics.enable(player);
	game.physics.enable(layer);
	game.physics.enable(stairs);
    game.camera.follow(player);
	player.anchor.setTo(.5,.5);
	player.body.width = 20;
    player.body.height = 20;
	enemy = game.add.group();
	enemy.enableBody = true;

	createAI(64,256,0,"64,256; 244,256",enemy);
	createAI(384,736,0,"",enemy);
	createAI(96,896,0,"96,896; 352,864",enemy);
	createAI(768,1152,0,"",enemy);
	createAI(448,896,179,"",enemy);
	createAI(512,736,0,"512,736; 512,480; 1024,480; 1024,736",enemy);
	createAI(512,352,35,"",enemy);
	createAI(1024,352,0,"1024,352; 1024,64; 832,192",enemy);
	createAI(1184,96,0,"1184,96; 1184,320",enemy);
	createAI(1504,736,0,"1504,736; 1152,736; 1152,672",enemy);
	createAI(992,896,135,"",enemy);
	createAI(1504,1152,0,"1504,1152; 1504,992",enemy);
	createAI(1632,1152,45,"",enemy);
	createAI(1664,736,0,"1664,736; 1888,736",enemy);
	createAI(1664,608,0,"1664,608; 1888,608; 1760,448",enemy);
	createAI(1664,96,179,"",enemy);
	createAI(2080,128,0,"2080,128; 2272,128; 2272,800; 2080,800",enemy);
	createAI(2144,416,0,"2144,416; 2240,352; 2112,768; 2176,384",enemy);
	createAI(2048,1000,90,"",enemy);
	createAI(2304,1184,270,"",enemy);

	game.paused = true;
	startScreen = game.add.sprite(0, 0, 'startScreen');
	startScreen.inputEnabled=true
	game.inputEnabled = true;
	//instructions = game.add.sprite(317,325,'instructions');
	//instructions.inputEnabled = true;
    game.input.onDown.add(startGame, this);
	
	//instructions.events.onInputDown.add(showBox,this);

		//game.add.image(0,700,'instructionsDown')
}

/*function showBox(){
		game.add.sprite(350,400,'instructionBox');
	}*/

function startGame (){
	game.paused=false;
	startScreen.destroy();
}

function killOnContact(sprite,player){
		sprite.kill();
}
function killOnContact2(sprite,ayy){
	ayy.kill();
}
function killBoth(a,b){
	a.kill();
	b.kill();
}
function fifteenpx(x,y){
	return [{x:x,y:y},{x:x+150,y:y}];
}

function update() {

	//timerText = game.add.text(10, 10, "Time Left:" + timerValue, { font: "50px Times New Roman", fill: "#ff0044", align: "center" });
	//timerValue = Math.floor((timer.next - game.time.now)/1000);
	//timerValue = Math.floor(timer.ms/1000);
	if(player.x != game.input.mousePointer.x||player.y != game.input.mousePointer.y){
		player.angle = game.math.radToDeg(game.physics.arcade.moveToPointer(player, 260, game.input.mousePointer)+90);
	}
	game.physics.arcade.overlap(player,layer,function(a,b){
		killOnContact(a,b);
		//livesNum--;
		document.getElementById("tryCount").innerHTML = "Tries : " + ++triesSoFar;
		alert('Game over! No power left. You touched the walls. Your stationary body has been found and recaptured by the guards. Try again?');
		game.state.start(game.state.current);
	});

	game.physics.arcade.overlap(player,enemy,killOnContact2);
	enemy.forEach(function(thing){thing.ai();});
	game.physics.arcade.overlap(bullets,layer,killOnContact);
	game.physics.arcade.collide(layer,enemy);
	game.physics.arcade.overlap(enemy,bullets,killBoth);
	game.physics.arcade.overlap(player,bullets,function(a,b){
		killOnContact(a,b);
		alert('Game over! The guards have shot and captured you. Try again?');
		document.getElementById("tryCount").innerHTML = "Tries : " + ++triesSoFar;
		game.state.start(game.state.current);
	});
	game.physics.arcade.overlap(stairs,player,function(){alert('You win! You have successfully escaped from the research facility. Where will your future take you now that you have earned your freedom? You decide… \n Play again?\nTries used:' + triesSoFar); game.state.start(game.state.current);});

	game.physics.arcade.overlap(key1,player,function(x,y){killOnContact(x,y);key1value=1;});
	game.physics.arcade.overlap(key2,player,function(x,y){killOnContact(x,y);key2value=1;});
	if(key1value==1){
		game.physics.arcade.overlap(door1,player,killOnContact);
	}
	else{

		game.physics.arcade.overlap(door1,player,function(){alert('Please collect the purple key to proceed.');		player.x = 1920;
		player.y = 96;});
	};
	if(key2value==1){
		game.physics.arcade.overlap(door2,player,killOnContact);
	}
	else{
		game.physics.arcade.overlap(door2,player,function(){alert('Please collect the green key to proceed.');		player.x = 2112;
		player.y = 800;});
	}


}
function ai(){
	var see = this.canSee();
	if(this.chasePath.length == 0){
		if(see){
			this.fire();
			this.lastSeen = true;
			this.animations.play("stand", 9,true);
		}else{
			this.animations.play("walk",9,true);
			if(this.lastSeen){
				this.chasePath.push(new Phaser.Point(this.x,this.y), new Phaser.Point(player.x,player.y));
				this.lastSeen = false;
			}else{
				if(this.patrol.length > 1){
					this.angle = game.math.radToDeg(game.physics.arcade.moveToXY(this,this.patrol[this.patrolIndex].x,this.patrol[this.patrolIndex].y,70)) + 90;
					if(differPoint(this,this.patrol[this.patrolIndex], 5)){
						this.patrolIndex++;
						if(this.patrolIndex == this.patrol.length)
							this.patrolIndex = 0;
					}
				}else{
					this.animations.play("stand", 9,true);
				}
			}
		}
	}else{
		this.angle = game.math.radToDeg(game.physics.arcade.moveToXY(this,this.chasePath[this.chasePath.length-1].x,this.chasePath[this.chasePath.length-1].y,100)) + 90;
		if(see){
			this.lastSeen = true;
			this.fire();
			this.animations.play("stand", 9,true);
		}else{
			this.animations.play("walk",9,true);
			if(this.lastSeen){
				this.chasePath.push(new Phaser.Point(player.x,player.y));
				this.lastSeen = false;
			}else{
				if(differPoint(this,this.chasePath[this.chasePath.length-1], 30)){
					this.chasePath.pop();
				}
			}
		}
	}
	/*if(this.canSee()){
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
		}*/
}
function genPath(input){
	var toSender = input.split(";");
	for(var i = 0; i < toSender.length; i++){
		var ob = toSender[i].split(",");
		toSender[i] = {x:parseInt(ob[0]),y:parseInt(ob[1])};
	}
	return toSender;
}
function canSee(){
	var dist = 250;
	if(!this.alive)
		return false;
	if(game.physics.arcade.distanceBetween(this,player) > dist)
		return false;
	var fov = 0.5;
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
function createAI(x,y,angle,patrol,group){
	var guard = group.create(x, y, 'guard');
	guard.animations.add('walk', [0, 1, 2, 3, 4, 3, 2, 1]);
	guard.animations.add('stand', [2]);
	guard.angle = angle;
	guard.ai = ai;
	guard.canSee= canSee;
	guard.anchor.setTo(0.5,0.5);
	guard.getFacing = getFacing;
	guard.chasePath = [];
	guard.patrol = genPath(patrol);
	guard.lastSeen = false;
	guard.patrolIndex = 0;
	guard.fire = fire;
	guard.fireRate = fireRate;
	guard.nextFire = 0;
	return guard;
}

function fire() {

    if (game.time.now > this.nextFire && bullets.countDead() > 0){
		shot.play();
        this.nextFire = game.time.now + this.fireRate;

        var bullet = bullets.getFirstDead();
		var dist = game.physics.arcade.velocityFromAngle(this.angle - 90, 35);
        bullet.reset(dist.x + this.x,dist.y + this.y);

        game.physics.arcade.moveToXY(bullet,player.x - 40 + 80 * Math.random(),player.y - 40 + 80 * Math.random(), 455);
    }

}
function differBy(x,y,diff){
	return x-y < diff && x-y > -diff;
}
function differPoint(x,y,diff){
	return differBy(x.x,y.x, diff) && differBy(x.y,y.y,diff);
}
