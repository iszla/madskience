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
            var style = { font: "36px Play", fill: "#ff0000", align: "center" };
            this.scoreValue = 0;
            this.spawnPoints = new Array(5);
            this.spawnPoints[0] = new Phaser.Point(190, 182);
            this.spawnPoints[1] = new Phaser.Point(1120, 182);
            this.spawnPoints[2] = new Phaser.Point(670, 440);
            this.spawnPoints[3] = new Phaser.Point(190, 668);
            this.spawnPoints[4] = new Phaser.Point(1150, 668);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.fire = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            // Load sounds
            this.laser = this.game.add.audio('lazer');
            this.chickSound = this.game.add.audio('chickAttack');
            this.cowSound = this.game.add.audio('cowAttack');
            this.pigSound = this.game.add.sound('pigAttack');
            this.dieSound = this.game.add.audio('death');
            this.killSound = this.game.add.audio('kill');
            this.jumpSound = this.game.add.audio('jump');
            // Init physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Load map
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('homemaid', 'tileset');
            // Create map layers
            this.map.createLayer('BG').resizeWorld();
            this.floors = this.map.createLayer('Floors');
            this.latestSpawn = this.game.time.now;
            this.difficulty = 4000;
            // Bullets
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(30, 'bullet', 0, false);
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('checkWorldBounds', true);
            // Pigs
            this.pigs = this.game.add.group();
            this.pigs.enableBody = true;
            this.pigs.physicsBodyType = Phaser.Physics.ARCADE;
            this.pigs.createMultiple(20, 'pig', 0, false);
            this.pigs.setAll('anchor.x', 0.5);
            this.pigs.setAll('anchor.y', 0.5);
            this.pigs.setAll('checkWorldBounds', true);
            this.pigEmitter = this.game.add.emitter(0, 0, 100);
            this.pigEmitter.makeParticles('pigParticle');
            this.pigEmitter.gravity = 200;
            // Chickens
            this.chickens = this.game.add.group();
            this.chickens.enableBody = true;
            this.chickens.physicsBodyType = Phaser.Physics.ARCADE;
            this.chickens.createMultiple(20, 'chicken', 0, false);
            this.chickens.setAll('anchor.x', 0.5);
            this.chickens.setAll('anchor.y', 0.5);
            this.chickens.setAll('checkWorldBounds', true);
            this.chickenEmitter = this.game.add.emitter(0, 0, 100);
            this.chickenEmitter.makeParticles('chickenParticle');
            this.chickenEmitter.gravity = 100;
            // Cows
            this.cows = this.game.add.group();
            this.cows.enableBody = true;
            this.cows.physicsBodyType = Phaser.Physics.ARCADE;
            this.cows.createMultiple(20, 'cow', 0, false);
            this.cows.setAll('anchor.x', 0.5);
            this.cows.setAll('anchor.y', 0.5);
            this.cows.setAll('checkWorldBounds', true);
            this.cowEmitter = this.game.add.emitter(0, 0, 200);
            this.cowEmitter.makeParticles('cowParticle');
            this.cowEmitter.gravity = 200;
            // Create player
            this.player = new Phaser.Sprite(this.game, 128, 456, 'player');
            this.player.anchor.set(.5, 1);
            this.game.world.addAt(this.player, 2);
            this.facingRight = true;
            this.doubleJumpReady = true;
            // Let's get physical
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.checkCollision.up = false;
            this.player.body.gravity.y = 800;
            this.player.body.collideWorldBounds = true;
            this.map.setCollisionBetween(0, 1, true, this.floors, true);
            // JUMP!
            this.cursors.up.onDown.add(this.moveJump, this);
            this.fire.onDown.add(this.shoot, this);
            this.scoreText = this.game.add.text(this.game.world.centerX - 60, 0, "Score: ", style);
            var pig;
            for (var i = 0; i < 5; i++) {
                if (i % 2 == 0) {
                    pig = this.pigs.getFirstExists(false);
                    pig.reset(this.spawnPoints[i].x, this.spawnPoints[i].y);
                    pig.type = "pig";
                    pig.turned = 0;
                    pig.life = 1;
                    pig.body.gravity.y = 800;
                }
            }
            var cow;
            for (var i = 0; i < 5; i++) {
                if (i % 2 != 0) {
                    cow = this.cows.getFirstExists(false);
                    cow.reset(this.spawnPoints[i].x, this.spawnPoints[i].y);
                    cow.type = "cow";
                    cow.turned = 0;
                    cow.life = 5;
                    cow.body.gravity.y = 800;
                }
            }
        };
        Play.prototype.update = function () {
            var _this = this;
            // Show score
            this.scoreText.text = "Score: " + (this.scoreValue).toString();
            // Update difficulty
            this.currentDifficulty = this.setCurrentDifficulty();
            // Check floor collision
            this.game.physics.arcade.collide(this.player, this.floors);
            this.game.physics.arcade.collide(this.pigs, this.floors);
            this.game.physics.arcade.collide(this.cows, this.floors);
            this.game.physics.arcade.collide(this.chickens, this.floors);
            this.game.physics.arcade.collide(this.pigEmitter, this.floors);
            this.game.physics.arcade.collide(this.cowEmitter, this.floors);
            this.game.physics.arcade.collide(this.chickenEmitter, this.floors);
            // Check bullet murdering
            this.game.physics.arcade.overlap(this.bullets, this.pigs, this.killEnemy, null, this);
            this.game.physics.arcade.overlap(this.bullets, this.cows, this.killEnemy, null, this);
            this.game.physics.arcade.overlap(this.bullets, this.chickens, this.killEnemy, null, this);
            // Check if player is dead
            this.game.physics.arcade.overlap(this.player, this.pigs, this.gameOver, null, this);
            this.game.physics.arcade.overlap(this.player, this.chickens, this.gameOver, null, this);
            this.game.physics.arcade.overlap(this.player, this.cows, this.gameOver, null, this);
            if (this.player.position.y > 730) {
                this.gameOver();
            }
            // I like to move it move it
            this.player.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -250;
                if (this.facingRight) {
                    this.player.scale.x = -1;
                    this.facingRight = false;
                }
            }
            if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 250;
                if (!this.facingRight) {
                    this.player.scale.x = 1;
                    this.facingRight = true;
                }
            }
            if (this.player.body.blocked.down && this.doubleJumpReady) {
                this.doubleJumpReady = false;
            }
            if (this.cursors.down.isDown && this.fire.isDown && this.player.body.blocked.down) {
                this.player.body.checkCollision.down = false;
                setTimeout(function () {
                    _this.player.body.checkCollision.down = true;
                }, 500);
            }
            this.pigs.forEachExists(function (pig) {
                var move = _this.game.rnd.integerInRange(0, 100);
                if (pig.y <= _this.player.position.y + 30 && pig.y >= _this.player.position.y - 100 &&
                    _this.game.physics.arcade.distanceBetween(pig, _this.player) < 400) {
                    if (!pig.played) {
                        _this.pigSound.play();
                        pig.played = true;
                    }
                    _this.pigAttack(pig);
                }
                else {
                    _this.moveEnemy(pig, move);
                }
            }, this);
            this.cows.forEachExists(function (cow) {
                var move = _this.game.rnd.integerInRange(0, 100);
                if (cow.y <= _this.player.position.y + 30 && cow.y >= _this.player.position.y - 100 &&
                    _this.game.physics.arcade.distanceBetween(cow, _this.player) < 550) {
                    if (!cow.played) {
                        _this.cowSound.play();
                        cow.played = true;
                    }
                    _this.cowAttack(cow);
                }
                else {
                    _this.moveEnemy(cow, move);
                }
            }, this);
            // Chicken movement and attack
            this.chickens.forEachExists(function (chick) {
                var move = _this.game.rnd.integerInRange(0, 100);
                if (chick.y <= _this.player.position.y + 170 && chick.y >= _this.player.position.y - 250 &&
                    _this.game.physics.arcade.distanceBetween(chick, _this.player) < 550) {
                    if (!chick.played) {
                        chick.played = true;
                        _this.chickSound.play();
                    }
                    _this.chickenAttack(chick);
                }
                else {
                    chick.body.checkCollision.down = true;
                    _this.moveEnemy(chick, move);
                }
            }, this);
            if (this.latestSpawn - this.game.time.now <= 0) {
                var enemyType = this.game.rnd.integerInRange(0, 100);
                var spawn = this.game.rnd.integerInRange(0, 4);
                if (enemyType < 50) {
                    this.newPig(spawn);
                }
                else if (enemyType >= 50 && enemyType < 80) {
                    this.newChicken(spawn);
                }
                else {
                    this.newCow(spawn);
                }
                this.latestSpawn = this.game.time.now + this.currentDifficulty;
            }
        };
        Play.prototype.render = function () {
        };
        Play.prototype.moveJump = function () {
            var _this = this;
            if (this.player.body.blocked.down) {
                this.player.body.velocity.y = -500;
                this.jumpSound.play();
                setTimeout(function () {
                    _this.doubleJumpReady = true;
                }, 250);
            }
            else if (this.doubleJumpReady) {
                this.player.body.velocity.y += -350;
                this.jumpSound.play();
                this.doubleJumpReady = false;
            }
        };
        Play.prototype.shoot = function () {
            var bullet = this.bullets.getFirstExists(false);
            this.laser.play();
            if (this.facingRight) {
                bullet.reset(this.player.position.x + 16, this.player.position.y - 34);
                bullet.rotation = this.game.physics.arcade.moveToXY(bullet, this.player.position.x + 1300, this.player.position.y - 38, 500);
            }
            else {
                // Reset and create bullet, facing the correct direction
                bullet.reset(this.player.position.x - 16, this.player.position.y - 34, 180);
                bullet.rotation = this.game.physics.arcade.moveToXY(bullet, this.player.position.x - 1300, this.player.position.y - 38, 500);
            }
        };
        Play.prototype.killEnemy = function (bullet, enemy) {
            bullet.kill();
            enemy.life -= 1;
            if (enemy.life <= 0) {
                this.explode(enemy);
                this.killSound.play();
                if (enemy.type == "pig") {
                    this.scoreValue += 1;
                }
                if (enemy.type == "chicken") {
                    this.scoreValue += 2;
                }
                if (enemy.type == "cow") {
                    this.scoreValue += 3;
                }
                enemy.kill();
            }
        };
        Play.prototype.explode = function (enemy) {
            if (enemy.type == "pig") {
                this.pigEmitter.x = enemy.position.x;
                this.pigEmitter.y = enemy.position.y;
                this.pigEmitter.start(true, 1000, null, 60);
            }
            if (enemy.type == "cow") {
                this.cowEmitter.x = enemy.position.x;
                this.cowEmitter.y = enemy.position.y;
                this.cowEmitter.start(true, 1000, null, 100);
            }
            if (enemy.type == "chicken") {
                this.chickenEmitter.x = enemy.position.x;
                this.chickenEmitter.y = enemy.position.y;
                this.chickenEmitter.start(true, 1000, null, 60);
            }
        };
        Play.prototype.pigAttack = function (enemy) {
            this.game.physics.arcade.moveToXY(enemy, this.player.position.x, enemy.y, 180);
        };
        Play.prototype.cowAttack = function (enemy) {
            var _this = this;
            enemy.body.velocity.x = 0;
            setTimeout(function () {
                _this.game.physics.arcade.moveToXY(enemy, _this.player.position.x, enemy.y, 400);
            }, 500);
        };
        Play.prototype.chickenAttack = function (enemy) {
            var _this = this;
            enemy.body.velocity.x = 0;
            setTimeout(function () {
                enemy.body.checkCollision.down = false;
                _this.game.physics.arcade.moveToXY(enemy, _this.player.position.x, _this.player.position.y - 30, 300);
            }, 200);
        };
        Play.prototype.moveEnemy = function (enemy, direction) {
            if (enemy.x < 50) {
                enemy.body.velocity.x = 100;
                enemy.turned = this.game.time.now + 3000;
                return;
            }
            if (enemy.position.x >= 1200) {
                enemy.body.velocity.x = -100;
                enemy.turned = this.game.time.now + 3000;
                return;
            }
            if (direction < 50) {
                this.moveEnemyLeft(enemy);
            }
            else {
                this.moveEnemyRight(enemy);
            }
        };
        Play.prototype.moveEnemyLeft = function (enemy) {
            if (enemy != undefined && (enemy.turned - this.game.time.now) < 0) {
                enemy.body.velocity.x = -100;
                enemy.turned = this.game.time.now + 3000;
            }
        };
        Play.prototype.moveEnemyRight = function (enemy) {
            if (enemy != undefined && (enemy.turned - this.game.time.now) < 0) {
                enemy.body.velocity.x = 100;
                enemy.turned = this.game.time.now + 3000;
            }
        };
        Play.prototype.newPig = function (spawn) {
            var pig;
            pig = this.pigs.getFirstExists(false);
            if (pig == null) {
                return;
            }
            pig.reset(this.spawnPoints[spawn].x, this.spawnPoints[spawn].y + 10);
            pig.type = "pig";
            pig.played = false;
            pig.turned = 0;
            pig.life = 2;
            pig.body.gravity.y = 800;
        };
        Play.prototype.newCow = function (spawn) {
            var cow;
            cow = this.cows.getFirstExists(false);
            if (cow == null) {
                return;
            }
            cow.reset(this.spawnPoints[spawn].x, this.spawnPoints[spawn].y);
            cow.type = "cow";
            cow.turned = 0;
            cow.played = false;
            cow.life = 5;
            cow.body.gravity.y = 800;
        };
        Play.prototype.newChicken = function (spawn) {
            var chick;
            chick = this.chickens.getFirstExists(false);
            if (chick == null) {
                return;
            }
            chick.reset(this.spawnPoints[spawn].x, this.spawnPoints[spawn].y + 10);
            chick.type = "chicken";
            chick.turned = 0;
            chick.played = false;
            chick.life = 1;
            chick.body.checkCollision.up = false;
            chick.body.gravity.y = 800;
        };
        Play.prototype.setCurrentDifficulty = function () {
            return this.difficulty - (this.scoreValue * 30);
        };
        Play.prototype.gameOver = function () {
            this.dieSound.play();
            this.game.state.start('GameOver', true, false);
        };
        return Play;
    })(Phaser.State);
    MadSkience.Play = Play;
})(MadSkience || (MadSkience = {}));
