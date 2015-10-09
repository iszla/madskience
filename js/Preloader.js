/// <reference path="phaser/phaser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MadSkience;
(function (MadSkience) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.load.image('logo', 'images/logo.png');
            this.load.tilemap('map', 'maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'maps/scifi_platformTiles_32x32.png');
            this.load.image('player', 'images/player.png');
        };
        Preloader.prototype.create = function () {
            var _this = this;
            console.log("Preloader");
            setTimeout(function () {
                _this.game.state.start('Menu', true, false);
            }, 1000);
        };
        return Preloader;
    })(Phaser.State);
    MadSkience.Preloader = Preloader;
})(MadSkience || (MadSkience = {}));
