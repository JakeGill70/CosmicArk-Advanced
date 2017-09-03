module CosmicArkAdvanced {
    /**
     * @description Simple splash screen to display while loading
     * @property game {Phaser.Game}             - The game context
     * @property music {Phaser.Sound}           - The SFX player
     * @property game {Phaser.Sprite}           - The actual splash screen image to display
     */
    export class HelpScreenState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite;
        cameFromPlayState: boolean;

        /**
         * @constructor Default.
         */
        constructor() {
            super();
        }

        init(_cameFromPlayState:boolean = false) {
            this.cameFromPlayState = _cameFromPlayState;
        }

        /**
         * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
         */
        create() {
            //if (!this.game.device.desktop) {
            //    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            //    this.game.scale.startFullScreen(false);
            //}

            this.game.readInstructionsAtLeastOnce = true;

            this.titleScreenImage = this.add.sprite(0, 0, "help"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            // Register the "TitleClicked" even handler
            this.input.onTap.addOnce(this.TitleClicked, this);
        }

        /**
         * @description Handles the "onTap" event. Just moves over to the mapSelectState state.
         */
        TitleClicked() {
            
            if (this.cameFromPlayState) {
                this.game.state.start("mapSelectState");  // Jump to MapSelectState
            }
            else {
                this.game.state.start("mainMenuState"); // Jump to the MainMenuState
            }
        }
    }
}