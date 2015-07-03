var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms;
var guards;
var cursors;
function preload() {
	game.load.image('black', 'black.png');
	game.load.image('white', 'white.png');
}


function create() {
	cursors = game.input.keyboard.createCursorKeys();
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.world.setBounds(-10000, -10000, 10000, 10000);
	platforms = game.add.group();
	platforms.enableBody = true;
	var ledge = platforms.create(0, game.world.height - 64, 'white');
	ledge.body.immovable = true;
	ledge = platforms.create(50, game.world.height - 64, 'white');
	ledge.body.immovable = true;
	ledge = platforms.create(100, game.world.height - 64, 'white');
	ledge.body.immovable = true;
	ledge = platforms.create(-1000, -1000, 'white');
	ledge.body.immovable = true;
	ledge = platforms.create(1000, 1000, 'white');
	ledge.body.immovable = true;

	ledge.body.immovable = true;
	guards = game.add.group();
	guards.enableBody = true;
	ledge = guards.create(0, 64, 'white');
	ledge.body.immovable = true;
	ledge = guards.create(50, 64, 'white');
	ledge.body.immovable = true;
	ledge = guards.create(100, 64, 'white');
	ledge.body.immovable = true;
	player = game.add.sprite(32, game.world.height - 150, 'white');
	game.physics.arcade.enable(player);
	game.camera.follow(player,3);
}

function update() {
	player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
    }
    player.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        //  Move to the left
        player.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        //  Move to the right
        player.body.velocity.y = 150;
    }
    game.physics.arcade.overlap(player, platforms, killPlayer, null, this);
    game.physics.arcade.overlap(player, guards, killGuard, null, this);
}
function killPlayer(player, platform){
	player.kill();
}
function killGuard(player, guards){
	guards.kill();
}