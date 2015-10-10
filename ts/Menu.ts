/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
    export class Menu extends Phaser.State {
        logo: Phaser.Sprite;
        map: Phaser.Tilemap;
        pressSpace: Phaser.Text;
        fire: Phaser.Key;
 
        create() {
            console.log("Menu");
            this.fire = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('homemaid', 'tileset');
            var style2 = { font: "32px Arial", fill: "#ff0000", align: "center" };
            
            // Create map layers
            this.map.createLayer('BG').resizeWorld();
            
            this.logo = this.game.add.sprite(-300, 420, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            setTimeout(() => {
                this.pressSpace = this.game.add.text(this.game.world.centerX -150, this.game.world.centerY + 300, "Press SPACE to play", style2);
            }, 2000);
            
            var tween1 = this.add.tween(this.logo);
            tween1.to({ x: this.game.world.centerX }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            
            this.fire.onDown.addOnce(this.fadeOut, this);
        }
 
        fadeOut() {
            var tween = this.add.tween(this.logo).to({ y: 800 }, 1000, Phaser.Easing.Linear.None, true);
            this.pressSpace.text = "";
            
            tween.onComplete.add(this.startGame, this);
        }
 
        startGame() {
            this.game.state.start('Play', true, false);
        }
    }
}