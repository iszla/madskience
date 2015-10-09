/// <reference path="phaser/phaser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MadSkience;
(function (MadSkience) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            _super.apply(this, arguments);
        }
        Play.prototype.create = function () {
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
        };
        Play.prototype.update = function () {
            var _this = this;
            // Check floor collision
            this.game.physics.arcade.collide(this.player, this.floors);
            // I like to move it move it
            this.player.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -150;
                if (this.facingRight) {
                    this.player.scale.x = -1;
                    this.facingRight = false;
                }
            }
            if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 150;
                if (!this.facingRight) {
                    this.player.scale.x = 1;
                    this.facingRight = true;
                }
            }
            if (this.player.body.blocked.down && this.doubleJumpReady) {
                this.doubleJumpReady = false;
            }
            if (this.cursors.down.isDown && this.fire.isDown) {
                this.player.body.checkCollision.down = false;
                setTimeout(function () {
                    _this.player.body.checkCollision.down = true;
                }, 500);
            }
        };
        Play.prototype.render = function () {
            this.game.debug.body(this.player);
        };
        Play.prototype.moveJump = function () {
            var _this = this;
            console.log("Jump!");
            if (this.player.body.blocked.down) {
                this.player.body.velocity.y = -400;
                setTimeout(function () {
                    _this.doubleJumpReady = true;
                }, 250);
            }
            else if (this.doubleJumpReady) {
                this.player.body.velocity.y += -350;
                this.doubleJumpReady = false;
            }
        };
        return Play;
    })(Phaser.State);
    MadSkience.Play = Play;
})(MadSkience || (MadSkience = {}));
