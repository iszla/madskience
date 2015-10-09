/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
    export class Boot extends Phaser.State {
 
        preload() {
            this.game.load.image('preloadBar', 'images/load.png');
        }
 
        create() {
            this.game.state.start('Preloader', true, false);
        }
    }
}