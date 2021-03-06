﻿module CosmicArkAdvanced {
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
        btn_Mute: Phaser.BitmapText;
        btn_Highscore: Phaser.BitmapText;

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
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            // Make Buttons
            this.btn_Play = this.add.bitmapText(0, 195, "EdoSZ", "PLAY NOW");
            this.btn_Help = this.add.bitmapText(0, 255, "EdoSZ", "HOW TO PLAY");
            this.btn_Highscore = this.add.bitmapText(0, 315, "EdoSZ", "HIGHSCORE");
            this.btn_Mute = this.add.bitmapText(0, 375, "EdoSZ", "MUTE");

            //Change Anchors
            this.btn_Play.anchor.set(0.5, 0);
            this.btn_Help.anchor.set(0.5, 0);
            this.btn_Highscore.anchor.set(0.5, 0);
            this.btn_Mute.anchor.set(0.5, 0);

            // Reset Position
            this.btn_Play.position.x = this.game.width / 2;
            this.btn_Help.position.x = this.game.width / 2;
            this.btn_Highscore.position.x = this.game.width / 2;
            this.btn_Mute.position.x = this.game.width / 2;


            // Play some theme music!
            if (!this.game.music.isPlaying) {
                this.game.music = this.game.add.sound("ThereminsBeat", this.game.music.volume, true);
                this.game.music.play();
            }

            // Register Event Handlers
            this.input.onTap.add(this.ButtonClicked, this, 0, this.input.position);
        }

        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        ButtonClicked(pos: Phaser.Point) {
            if (this.btn_Play.getBounds().contains(pos.x, pos.y)) { 
                if (this.game.readInstructionsAtLeastOnce) {
                    this.game.state.start("mapSelectState");  // Jump to MapSelectState
                }
                else {
                    this.game.state.start("helpScreenState", true, false, true); // Jump to the HelpScreenState
                }
            }
            else if (this.btn_Help.getBounds().contains(pos.x, pos.y)) { 
                // Get Game Data from the selected planet
                this.game.state.start("helpScreenState"); // Jump to the HelpScreenState
            }
            else if (this.btn_Mute.getBounds().contains(pos.x, pos.y)) {
                // Get Game Data from the selected planet
                this.game.music.volume = (this.game.music.volume > 0) ? 0 : 0.9; // Set the volume to 0% or 90% depending on last value
                this.btn_Mute.tint = (this.game.music.volume > 0) ? 0xFFFFFF : 0xFF0505; // Set the volume to red or white depending on last value
            }
            else if (this.btn_Highscore.getBounds().contains(pos.x, pos.y)) {
                this.game.state.start("highscoreState"); // Jump to HighscoreState
            }
        }
    }
}