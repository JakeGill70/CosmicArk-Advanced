var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
     * @desription Main Menu which only holds UI elements and lets the user navigate the program
     * @property {Phaser.Game} game                   - The game context
     * @property {Phaser.Sound} music                 - The SFX player
     * @property {Phaser.Sprite} selectedPlanet       - The planet the user has currently selected
     * @see {Phaser.State} */
    class HighscoreState extends Phaser.State {
        /**
         * @description Default constructor, only calls the Phaser.State instructor for now.
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * @description Populates the game state with sprites and registers the
         *              event handlers needed for touch/mouse input
         */
        create() {
            // Make background image
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Play some theme music!
            if (!this.game.music.isPlaying) {
                this.game.music = this.game.add.sound("ThereminsBeat", this.game.music.volume, true);
                this.game.music.play();
            }
            // Register Event Handlers
            //this.input.onTap.add(this.ButtonClicked, this, 0, this.input.position);
            this.input.onTap.add(this.ButtonClicked, this);
        }
        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        ButtonClicked() {
            this.game.state.start("mainMenuState");
        }
    }
    CosmicArkAdvanced.HighscoreState = HighscoreState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=HighscoreState.js.map