module CosmicArkAdvanced {
    /** 
     * @desription Main Menu which only holds UI elements and lets the user navigate the program
     * @property {Phaser.Game} game                   - The game context
     * @property {Phaser.Sound} music                 - The SFX player
     * @property {Phaser.Sprite} selectedPlanet       - The planet the user has currently selected
     * @see {Phaser.State} */
    export class MainMenuState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite
        btn_Help: Phaser.BitmapText;
        btn_Play: Phaser.BitmapText;

        /**
        * Default constructor, only calls the Phaser.State instructor for now.
        * @constructor
        */
        constructor() {
            super();
        }

        /** @desription Populates the game state with sprites and registers the
        * event handlers needed for touch/mouse input
        */
        create() {

            // Make background image
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            // Make Buttons
            this.btn_Play = this.add.bitmapText(250, 160, "EdoSZ", "PLAY NOW");
            this.btn_Help = this.add.bitmapText(250, 200, "EdoSZ", "HOW TO PLAY");



            // Register Event Handlers
            this.input.onTap.add(this.PlanetClicked, this, 0, this.input.position);
        }

        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        PlanetClicked(pos: Phaser.Point) {
            if (this.btn_Play.getBounds().contains(pos.x, pos.y)) { 
                this.game.state.start("mapSelectState");  // Jump to MapSelectState
            }
            else if (this.btn_Help.getBounds().contains(pos.x, pos.y)) { 
                // Get Game Data from the selected planet
                this.game.state.start("helpScreenState"); // Jump to the HelpScreenState
            }
        }
    }
}