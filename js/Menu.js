/// <reference path="phaser/phaser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MadSkience;
(function (MadSkience) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        Menu.prototype.create = function () {
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
        };
        Menu.prototype.fadeOut = function () {
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        Menu.prototype.startGame = function () {
            this.game.state.start('Play', true, false);
        };
        return Menu;
    })(Phaser.State);
    MadSkience.Menu = Menu;
})(MadSkience || (MadSkience = {}));