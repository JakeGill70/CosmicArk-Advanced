module CosmicArkAdvanced {
    /**
     * @description Simple splash screen to display while loading
     * @property game {Phaser.Game}             - The game context
     * @property music {Phaser.Sound}           - The SFX player
     * @property game {Phaser.Sprite}           - The actual splash screen image to display
     */
    export class TitleScreenState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite;

        /**
         * @constructor Default.
         */
        constructor() {
            super();
        }

        /**
         * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
         */
        create() {
            //if (!this.game.device.desktop) {
            //    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            //    this.game.scale.startFullScreen(false);
            //}

            this.titleScreenImage = this.add.sprite(0, 0, "title"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            // Register the "TitleClicked" even handler
            this.input.onTap.addOnce(this.TitleClicked, this);
        }

        /**
         * @Description Handles the "onTap" event. Just moves over to the mapSelectState state.
         */
        TitleClicked() {
            this.game.state.start("mapSelectState"); // Jump to the GamePlayState
        }
    }
}