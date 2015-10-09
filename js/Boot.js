/// <reference path="phaser/phaser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MadSkience;
(function (MadSkience) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.load.image('preloadBar', 'images/load.png');
        };
        Boot.prototype.create = function () {
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    MadSkience.Boot = Boot;
})(MadSkience || (MadSkience = {}));
