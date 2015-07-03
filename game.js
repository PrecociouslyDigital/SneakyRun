var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('dude', 'dude.png');
}
var sprite;
function create() {
	sprite = game.add.sprite(0, 0, 'dude');
	 game.physics.enable(sprite, Phaser.Physics.ARCADE);
}


function update() {
    
	if(sprite.x != game.input.mousePointer.x){ game.physics.arcade.moveToPointer(sprite, 325);}
	if(sprite.y != game.input.mousePointer.y){ game.physics.arcade.moveToPointer(sprite, 325);}

    /*//  only move when you click
    if (game.input.mousePointer.isDown)
    {
        //  400 is the speed it will move towards the mouse
        game.physics.arcade.moveToPointer(sprite, 400);

        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(sprite.body, game.input.x, game.input.y))
        {
            sprite.body.velocity.setTo(0, 0);
        }
    }
    else
    {
        sprite.body.velocity.setTo(0, 0);
    }*/

}
