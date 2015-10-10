/// <reference path="phaser/phaser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MadSkience;
(function (MadSkience) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            _super.apply(this, arguments);
        }
        GameOver.prototype.create = function () {
            var _this = this;
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('homemaid', 'tileset');
            var style = { font: "45px Arial", fill: "#ff0000", align: "center" };
            var style2 = { font: "32px Arial", fill: "#ff0000", align: "center" };
            // Create map layers
            this.map.createLayer('BG').resizeWorld();
            this.gameOver = this.game.add.sprite(1800, 420, 'logo');
            this.gameOver.anchor.setTo(0.5, 0.5);
            var tween1 = this.add.tween(this.gameOver);
            tween1.to({ x: this.game.world.centerX }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            setTimeout(function () {
                _this.endScore = _this.game.add.text(_this.game.world.centerX - 80, _this.game.world.centerY + 200, "Score: " + _this.game.state.states["Play"].scoreValue, style);
                _this.pressSpace = _this.game.add.text(_this.game.world.centerX - 180, _this.game.world.centerY + 300, "Press SPACE to play again", style2);
                _this.fire = _this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
                _this.fire.onDown.addOnce(_this.fadeOut, _this);
            }, 2000);
        };
        GameOver.prototype.fadeOut = function () {
            var tween = this.add.tween(this.gameOver).to({ y: 800 }, 1000, Phaser.Easing.Linear.None, true);
            this.pressSpace.text = "";
            tween.onComplete.add(this.startGame, this);
        };
        GameOver.prototype.startGame = function () {
            this.game.state.start('Play', true, false);
        };
        return GameOver;
    })(Phaser.State);
    MadSkience.GameOver = GameOver;
})(MadSkience || (MadSkience = {}));
