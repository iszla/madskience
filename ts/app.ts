/// <reference path="phaser/phaser.d.ts" />

class MadSkience {
	constructor() {
		this.game = new Phaser.Game(1280, 736, Phaser.AUTO, 'content', {
			preload: this.preload,
			create: this.create,
			update: this.update,
			render: this.render
			});
	}
	
	game: Phaser.Game;
	map: Phaser.Tilemap;
	player: Phaser.Sprite;
	facingRight: boolean;
	doubleJumpReady: boolean;
	world: Phaser.TilemapLayer;
	
	cursors: Phaser.CursorKeys;
	
	preload() {
		
		this.game.load.tilemap('map', 'maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'maps/scifi_platformTiles_32x32.png');
		this.game.load.image('player', 'images/player.png');
	}
	
	create() {
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		// Init physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Load map
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('science', 'tiles');
		
		// Create map layers
		this.map.createLayer('BG').resizeWorld();
		this.world = this.map.createLayer('Floors');
		
		// Create player
		this.player = new Phaser.Sprite(this.game, 128, 256, 'player');
		this.player.anchor.set(.5, 1);
		this.game.world.addAt(this.player, 2);
		this.facingRight = true;
		this.doubleJumpReady = true;
		
		// Let's get physical
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.checkCollision.up = false;
		this.player.body.gravity.y = 500;
		this.player.body.collideWorldBounds = true;
		
		this.map.setCollisionBetween(200, 300, true, this.world, true);
	}
	
	update() {
		// Check floor collision
		this.game.physics.arcade.collide(this.player, this.world);
		
		// I like to move it move it
		this.player.body.velocity.x = 0;
		
		if(this.cursors.left.isDown) {
			this.player.body.velocity.x = -150;
			if(this.facingRight) {
				this.player.scale.x = -1;
				this.facingRight = false;
			}
		}
		
		if(this.cursors.right.isDown) {
			this.player.body.velocity.x = 150;
			if(!this.facingRight) {
				this.player.scale.x = 1;
				this.facingRight = true;
			}
		}
		
		if(this.cursors.up.isDown && this.player.body.blocked.down) {
			this.player.body.velocity.y = -400;
			setTimeout(() => {
				this.doubleJumpReady = true;
			}, 250);
		}
		
		if(this.cursors.up.isDown && this.doubleJumpReady) {
			this.player.body.velocity.y += -350;
			this.doubleJumpReady = false;
		}
		
		if(this.player.body.blocked.down && this.doubleJumpReady) {
			this.doubleJumpReady = false;
		}
		
		if(this.cursors.down.isDown) {
			this.player.body.checkCollision.down = false;
			setTimeout(() => {
				this.player.body.checkCollision.down = true;
			}, 500);
		}
	}
	
	render() {
		this.game.debug.body(this.player);
	}
};

window.onload = () => {
	var game = new MadSkience();
};