/// <reference path="phaser/phaser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MadSkience;
(function (MadSkience) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 1280, 736, Phaser.AUTO, 'content', null);
            //this.state.add('Boot', Boot, false)
            this.state.add('Preloader', MadSkience.Preloader, false);
            this.state.add('Menu', MadSkience.Menu, false);
            this.state.add('Play', MadSkience.Play, false);
            this.state.start('Preloader');
        }
        return Game;
    })(Phaser.Game);
    MadSkience.Game = Game;
})(MadSkience || (MadSkience = {}));
window.onload = function () {
    new MadSkience.Game();
};
