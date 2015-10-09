/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
    export class Menu extends Phaser.State {
        logo: Phaser.Sprite;
        map: Phaser.Tilemap;
        fire: Phaser.Key;
 
        create() {
            this.fire = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            console.log("Menu");
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('science', 'tiles');
            
            // Create map layers
            this.map.createLayer('BG').resizeWorld();
            
            this.logo = this.game.add.sprite(-300, 420, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            
            var tween1 = this.add.tween(this.logo);
            tween1.to({ x: this.game.world.centerX }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            
            this.fire.onDown.addOnce(this.fadeOut, this);
        }
 
        fadeOut() {
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
 
            tween.onComplete.add(this.startGame, this);
        }
 
        startGame() {
            this.game.state.start('Play', true, false);
        }
    }
}