/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
    export class GameOver extends Phaser.State {
		gameOver: Phaser.Sprite;
        map: Phaser.Tilemap;
        endScore: Phaser.Text;
        pressSpace: Phaser.Text;
        startSound: Phaser.Sound;
        fire: Phaser.Key;
 
        create() {
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('homemaid', 'tileset');
            var style = { font: "32px Play", fill: "#ff0000", align: "center" };
            var style2 = { font: "32px Play", fill: "#ff0000", align: "center" };
            
            this.startSound = this.game.add.audio('start');
            
            // Create map layers
            this.map.createLayer('BG').resizeWorld();
            
            this.gameOver = this.game.add.sprite(1800, 420, 'gameover');
            this.gameOver.anchor.setTo(0.5, 0.5);
        
            var tween1 = this.add.tween(this.gameOver);
            tween1.to({ x: this.game.world.centerX }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            
            setTimeout(() => {
                this.endScore = this.game.add.text(this.game.world.centerX - 65, this.game.world.centerY + 110, "Score: "+this.game.state.states["Play"].scoreValue, style);
                this.pressSpace = this.game.add.text(this.game.world.centerX -180, this.game.world.centerY + 300, "Press SPACE to play again", style2);
                this.fire = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
                this.fire.onDown.addOnce(this.fadeOut, this);
            }, 2000);
        }
 
        fadeOut() {
            var tween = this.add.tween(this.gameOver).to({ y: 800 }, 1000, Phaser.Easing.Linear.None, true);
            this.pressSpace.text = "";
 
            tween.onComplete.add(this.startGame, this);
        }
 
        startGame() {
            this.game.state.start('Play', true, false);
        }
    }
}