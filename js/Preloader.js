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
        };
        Preloader.prototype.create = function () {
            var _this = this;
            console.log("Preloader");
            this.load.onLoadComplete.addOnce(this.loadMenu, this);
            setTimeout(function () {
                _this.loadMenu();
            }, 5000);
        };
        Preloader.prototype.loadMenu = function () {
            this.game.state.start('Menu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    MadSkience.Preloader = Preloader;
})(MadSkience || (MadSkience = {}));
