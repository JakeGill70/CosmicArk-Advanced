module CosmicArkAdvanced {
    export class TitleScreenState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite;

        constructor() {
            super();
        }

        create() {
            this.titleScreenImage = this.add.sprite(0, 0, "title"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            // Register the "TitleClicked" even handler
            this.input.onTap.addOnce(this.TitleClicked, this);
        }

        TitleClicked() {
            this.game.state.start("mapSelectState"); // Jump to the GamePlayState
        }
    }
}