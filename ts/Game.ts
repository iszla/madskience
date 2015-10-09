/// <reference path="phaser/phaser.d.ts" />

module MadSkience {
	export class Game extends Phaser.Game {
		constructor() {
			super(1280, 736, Phaser.AUTO, 'content', null);
			
			//this.state.add('Boot', Boot, false)
			this.state.add('Preloader', Preloader, false);
			this.state.add('Menu', Menu, false);
			this.state.add('Play', Play, false);
			
			this.state.start('Preloader');
		}
	}
}

window.onload = () => {
	new MadSkience.Game();
};