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
        bullets: Phaser.Group;
        pigs: Phaser.Group;
        pigEmitter: Phaser.Particles.Arcade.Emitter;
        chickens: Phaser.Group;
        chickenEmitter: Phaser.Particles.Arcade.Emitter;
        cows: Phaser.Group;
        cowEmitter: Phaser.Particles.Arcade.Emitter;
        scoreText: Phaser.Text;
        scoreValue: number;
        latestSpawn: number;
        difficulty: number;
        currentDifficulty: number;
        spawnPoints: Array<Phaser.Point>;
        chickSound: Phaser.Sound;
        cowSound: Phaser.Sound;
        pigSound: Phaser.Sound;
        laser: Phaser.Sound;
        dieSound: Phaser.Sound;
        killSound: Phaser.Sound;
        jumpSound: Phaser.Sound;
        
        
        cursors: Phaser.CursorKeys;
 
        create() {
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
            
            for(var i = 0; i < 5; i++) {
                if(i % 2 == 0) {
                    pig = this.pigs.getFirstExists(false);
                    pig.reset(this.spawnPoints[i].x, this.spawnPoints[i].y);
                    pig.type = "pig";
                    pig.turned = 0;
                    pig.life = 1;
                    pig.body.gravity.y = 800;
                }
            }
            
            var cow;
            
            for(var i = 0; i < 5; i++) {
                if(i % 2 != 0) {
                    cow = this.cows.getFirstExists(false);
                    cow.reset(this.spawnPoints[i].x, this.spawnPoints[i].y);
                    cow.type = "cow";
                    cow.turned = 0;
                    cow.life = 5;
                    cow.body.gravity.y = 800;
                }
            }
        }
        
        update() {
            // Show score
            this.scoreText.text = "Score: "+(this.scoreValue).toString();
            
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
            this.game.physics.arcade.overlap(this.player, this.pigs , this.gameOver, null, this);
            this.game.physics.arcade.overlap(this.player, this.chickens , this.gameOver, null, this);
            this.game.physics.arcade.overlap(this.player, this.cows , this.gameOver, null, this);
            if(this.player.position.y > 730) {
                this.gameOver();
            }
            
            // I like to move it move it
            this.player.body.velocity.x = 0;
            
            if(this.cursors.left.isDown) {
                this.player.body.velocity.x = -250;
                if(this.facingRight) {
                    this.player.scale.x = -1;
                    this.facingRight = false;
                }
            }
            
            if(this.cursors.right.isDown) {
                this.player.body.velocity.x = 250;
                if(!this.facingRight) {
                    this.player.scale.x = 1;
                    this.facingRight = true;
                }
            }
            
            if(this.player.body.blocked.down && this.doubleJumpReady) {
                this.doubleJumpReady = false;
            }
            
            if(this.cursors.down.isDown && this.fire.isDown && this.player.body.blocked.down) {
                this.player.body.checkCollision.down = false;
                setTimeout(() => {
                    this.player.body.checkCollision.down = true;
                }, 500);
            }
            
            this.pigs.forEachExists((pig) => {
                var move = this.game.rnd.integerInRange(0, 100);
                
                if(pig.y <= this.player.position.y + 30 && pig.y >= this.player.position.y - 100 &&
                this.game.physics.arcade.distanceBetween(pig, this.player) < 400) {
                    if(!pig.played) {
                        this.pigSound.play();
                        pig.played = true;
                    }
                    this.pigAttack(pig);
                } else {
                    this.moveEnemy(pig, move);
                }
            }, this);
            
            this.cows.forEachExists((cow) => {
                var move = this.game.rnd.integerInRange(0, 100);
                
                if(cow.y <= this.player.position.y + 30 && cow.y >= this.player.position.y - 100 &&
                this.game.physics.arcade.distanceBetween(cow, this.player) < 550) {
                    if(!cow.played) {
                        this.cowSound.play();
                        cow.played = true;
                    }
                    this.cowAttack(cow);
                } else {
                    this.moveEnemy(cow, move);
                }
            }, this);
            
            // Chicken movement and attack
            this.chickens.forEachExists((chick) => {
                var move = this.game.rnd.integerInRange(0,100);
                
                if(chick.y <= this.player.position.y + 170 && chick.y >= this.player.position.y - 250 &&
                this.game.physics.arcade.distanceBetween(chick, this.player) < 550) {
                    if(!chick.played) {
                        chick.played = true;
                        this.chickSound.play();
                    }
                    this.chickenAttack(chick);
                } else {
                    chick.body.checkCollision.down = true;
                    this.moveEnemy(chick, move);
                }
            }, this);
            
            if(this.latestSpawn - this.game.time.now <= 0) {
                var enemyType = this.game.rnd.integerInRange(0, 100);
                var spawn = this.game.rnd.integerInRange(0, 4);
                if(enemyType < 50) {
                    this.newPig(spawn);
                } else if(enemyType >= 50 && enemyType < 80) {
                    this.newChicken(spawn);
                } else {
                    this.newCow(spawn);
                }
                
                this.latestSpawn = this.game.time.now + this.currentDifficulty;
            }
        }
        
        render() {
        }
        
        moveJump() {
            if(this.player.body.blocked.down) {
                this.player.body.velocity.y = -500;
                this.jumpSound.play();
                setTimeout(() => {
                    this.doubleJumpReady = true;
                }, 250);
            } else if(this.doubleJumpReady) {
                this.player.body.velocity.y += -350;
                this.jumpSound.play();
                this.doubleJumpReady = false;
            }
        }
        
        shoot() {
            var bullet = this.bullets.getFirstExists(false);
            this.laser.play();
           
            if(this.facingRight) {
                bullet.reset(this.player.position.x+16, this.player.position.y-34);
                bullet.rotation = this.game.physics.arcade.moveToXY(bullet, this.player.position.x + 1300, this.player.position.y - 38, 500);
            } else {
                // Reset and create bullet, facing the correct direction
                bullet.reset(this.player.position.x-16, this.player.position.y-34, 180);
                bullet.rotation = this.game.physics.arcade.moveToXY(bullet, this.player.position.x - 1300, this.player.position.y - 38, 500);
            }
        }
        
        killEnemy(bullet, enemy) {
            bullet.kill();
            enemy.life -= 1;
            if(enemy.life <= 0) {
                this.explode(enemy);
                this.killSound.play();
                
                if(enemy.type == "pig") {
                    this.scoreValue += 1;
                }
                if(enemy.type == "chicken") {
                    this.scoreValue += 2;
                }
                if(enemy.type == "cow") {
                    this.scoreValue += 3;
                }
                enemy.kill();
            }
        }
        
        explode(enemy) {
            if(enemy.type == "pig") {
                this.pigEmitter.x = enemy.position.x;
                this.pigEmitter.y = enemy.position.y;
                
                this.pigEmitter.start(true, 1000, null, 60);
            }
            
            if(enemy.type == "cow") {
                this.cowEmitter.x = enemy.position.x;
                this.cowEmitter.y = enemy.position.y;
                
                this.cowEmitter.start(true, 1000, null, 100);
            }
            
            if(enemy.type == "chicken") {
                this.chickenEmitter.x = enemy.position.x;
                this.chickenEmitter.y = enemy.position.y;
                
                this.chickenEmitter.start(true, 1000, null, 60);
            }
        }
        
        pigAttack(enemy) {
            this.game.physics.arcade.moveToXY(enemy, this.player.position.x, enemy.y, 180);
        }
        
        cowAttack(enemy) {
            enemy.body.velocity.x = 0;
            setTimeout(() => {
                this.game.physics.arcade.moveToXY(enemy, this.player.position.x, enemy.y, 400);
            }, 500);
        }
        
        chickenAttack(enemy) {
            enemy.body.velocity.x = 0;
            
            setTimeout(() => {
                enemy.body.checkCollision.down = false;
                this.game.physics.arcade.moveToXY(enemy, this.player.position.x, this.player.position.y-30, 300);
            }, 200);
        }
        
        moveEnemy(enemy, direction) {
            if(enemy.x < 50) {
                enemy.body.velocity.x = 100;
                enemy.turned = this.game.time.now + 3000;
                return;
            }
            
            if(enemy.position.x >= 1200) {
                enemy.body.velocity.x = -100;
                enemy.turned = this.game.time.now + 3000;
                return;
            }
            if(direction < 50) {
                this.moveEnemyLeft(enemy);
            } else {
                this.moveEnemyRight(enemy);
            }
        }
        
        moveEnemyLeft(enemy) {
            if(enemy != undefined && (enemy.turned - this.game.time.now) < 0) {
                enemy.body.velocity.x = -100;
                enemy.turned = this.game.time.now + 3000;
            }
        }
        
        moveEnemyRight(enemy) {
            if(enemy != undefined && (enemy.turned - this.game.time.now) < 0) {
                enemy.body.velocity.x = 100;
                enemy.turned = this.game.time.now + 3000;
            }
        }
        
        newPig(spawn) {
            var pig;
            pig = this.pigs.getFirstExists(false);
            if(pig == null) {
                return;
            }
            pig.reset(this.spawnPoints[spawn].x, this.spawnPoints[spawn].y + 10);
            pig.type = "pig";
            pig.played = false;
            pig.turned = 0;
            pig.life = 2;
            pig.body.gravity.y = 800;
        }
        
        newCow(spawn) {
            var cow;
            cow = this.cows.getFirstExists(false);
            if(cow == null) {
                return;
            }
            cow.reset(this.spawnPoints[spawn].x, this.spawnPoints[spawn].y);
            cow.type = "cow";
            cow.turned = 0;
            cow.played = false;
            cow.life = 5;
            cow.body.gravity.y = 800;
        }
        
        newChicken(spawn) {
            var chick;
            chick = this.chickens.getFirstExists(false);
            if(chick == null) {
                return;
            }
            chick.reset(this.spawnPoints[spawn].x, this.spawnPoints[spawn].y + 10);
            chick.type = "chicken";
            chick.turned = 0;
            chick.played = false;
            chick.life = 1;
            chick.body.checkCollision.up = false;
            chick.body.gravity.y = 800;
        }
        
        setCurrentDifficulty() {
            return this.difficulty - (this.scoreValue * 10);
        }
        
        gameOver() {
            this.dieSound.play();
            this.game.state.start('GameOver', true, false);
        }
    }
} 