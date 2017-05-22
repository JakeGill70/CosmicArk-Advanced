module CosmicArkAdvanced {
    /**
     * @description Simple splash screen to display while loading
     * @property game {Phaser.Game}                - The game context
     * @property music {Phaser.Sound}              - The SFX player
     * @property titleScreenImage {Phaser.Sprite}  - The actual splash screen image to display
     * @property txt {Phaser.BitmapText}           - Text to let the user know they can click anywhere to go back
     */
    export class HelpScreenState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite;
        txt_Back: Phaser.BitmapText;

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

            this.titleScreenImage = this.add.sprite(0, 0, "help"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            this.txt_Back = this.add.bitmapText(200, 400, "EdoSZ", "Click Anywhere to Return");

            // Register the "TitleClicked" even handler
            this.input.onTap.addOnce(this.TitleClicked, this);
        }

        /**
         * @Description Handles the "onTap" event. Just moves over to the mapSelectState state.
         */
        TitleClicked() {
            //this.game.scale.startFullScreen(false);
            this.game.state.start("mainMenuState"); // Jump to the MainMenuState
        }
    }
}