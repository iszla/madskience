/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
 
    export class Preloader extends Phaser.State {
 
        preload() {
            this.load.image('logo', 'images/logo.png');
            this.load.tilemap('map', 'maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'maps/scifi_platformTiles_32x32.png');
            this.load.image('player', 'images/player.png');
        }
 
        create() {
            console.log("Preloader");
            setTimeout(() => {
                this.game.state.start('Menu', true, false);
            }, 1000);
        }
    }
}