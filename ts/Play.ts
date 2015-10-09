/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
 
    export class Play extends Phaser.State {
 
        game: Phaser.Game;
        map: Phaser.Tilemap;
        player: Phaser.Sprite;
        facingRight: boolean;
        doubleJumpReady: boolean;
        floors: Phaser.TilemapLayer;
        fire: Phaser.Key;
        
        cursors: Phaser.CursorKeys;
 
        create() {
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.fire = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            
            // Init physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            
            // Load map
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('science', 'tiles');
            
            // Create map layers
            this.map.createLayer('BG').resizeWorld();
            this.floors = this.map.createLayer('Floors');
            
            // Create player
            this.player = new Phaser.Sprite(this.game, 128, 456, 'player');
            this.player.anchor.set(.5, 1);
            this.game.world.addAt(this.player, 2);
            this.facingRight = true;
            this.doubleJumpReady = true;
            
            // Let's get physical
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.checkCollision.up = false;
            this.player.body.gravity.y = 500;
            this.player.body.collideWorldBounds = true;
            
            this.map.setCollisionBetween(200, 300, true, this.floors, true);
            
            // JUMP!
            this.cursors.up.onDown.add(this.moveJump, this);
        }
        
        update() {
            // Check floor collision
            this.game.physics.arcade.collide(this.player, this.floors);
            
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
            
            if(this.player.body.blocked.down && this.doubleJumpReady) {
                this.doubleJumpReady = false;
            }
            
            if(this.cursors.down.isDown && this.fire.isDown) {
                this.player.body.checkCollision.down = false;
                setTimeout(() => {
                    this.player.body.checkCollision.down = true;
                }, 500);
            }
        }
        
        render() {
            this.game.debug.body(this.player);
        }
        
        moveJump() {
            console.log("Jump!");
            if(this.player.body.blocked.down) {
                this.player.body.velocity.y = -400;
                setTimeout(() => {
                    this.doubleJumpReady = true;
                }, 250);
            } else if(this.doubleJumpReady) {
                this.player.body.velocity.y += -350;
                this.doubleJumpReady = false;
            }
        }
    }
} 