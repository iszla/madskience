/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
 
    export class Preloader extends Phaser.State {
 
        preload() {
            this.load.image('logo', 'images/logo.png');
            this.load.tilemap('map', 'maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tileset', 'maps/tilemap.png');
            this.load.image('player', 'images/player.png');
            this.load.image('bullet', 'images/bullet.png');
            this.load.image('gameover', 'images/gameover.png');
            
            this.load.image('pig', 'images/pig.png');
            this.load.image('pigParticle', 'images/pigParticle.png');
            this.load.image('cow', 'images/cow.png');
            this.load.image('cowParticle', 'images/cowParticle.png');
            this.load.image('chicken', 'images/chicken.png');
            this.load.image('chickenParticle', 'images/chickenParticle.png');
            
            // Load sounds
            this.load.audio('death', 'sounds/player_die.wav');
            this.load.audio('kill', 'sounds/enemy_die.wav');
            this.load.audio('lazer', 'sounds/laser.wav');
            this.load.audio('chickAttack', 'sounds/chicken_attack.wav');
            this.load.audio('cowAttack', 'sounds/cow_attack.wav');
            this.load.audio('pigAttack', 'sounds/pig_attack.wav');
            this.load.audio('jump', 'sounds/jump.wav');
            this.load.audio('start', 'sounds/start.wav');
        }
 
        create() {
            console.log("Preloader");
            this.load.onLoadComplete.addOnce(this.loadMenu, this);
            setTimeout(() => {
                this.loadMenu();
            }, 5000);
        }
        
        loadMenu() {
            this.game.state.start('Menu', true, false);
        }
    }
}