﻿module CosmicArkAdvanced {
    /**
* @description Level starting splash screen, explaining specifics of current level win/lose conditions
* @property game {Phaser.Game}             - The game context
* @property music {Phaser.Sound}           - The SFX player
* @property game {Phaser.Sprite}           - The actual splash screen image to display
*/
    export class PauseMenuState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite;
        btn_Resume: Phaser.BitmapText;
        btn_Restart: Phaser.BitmapText;
        btn_ReturnToMenu: Phaser.BitmapText;

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

            console.log("the LevelStartState has started!"); // testing

            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            //this.titleScreenImage = this.add.sprite(0, 0, "nightSky"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            // Make Buttons
            this.btn_Resume = this.add.bitmapText(40, 150, "EdoSZ", "RESUME GAME (Under Construction)");
            this.btn_Restart = this.add.bitmapText(40, 200, "EdoSZ", "RESTART GAME");
            this.btn_ReturnToMenu = this.add.bitmapText(40, 250, "EdoSZ", "RETURN TO MENU");

            // Register Event Handlers
            this.input.onTap.add(this.PlanetClicked, this, 0, this.input.position);
        }

        /**
         * @description Handles "onTap" event.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        PlanetClicked(pos: Phaser.Point) {
            if (this.btn_Resume.getBounds().contains(pos.x, pos.y)) {
                // Resume the game
                //this.game.state.start("mapSelectState");  // Jump to MapSelectState
                alert("Under Construction...");
            }
            else if (this.btn_Restart.getBounds().contains(pos.x, pos.y)) {
                // Get Game Data from the selected planet
                this.game.state.start("gamePlayState"); // Jump to the GamePlayState
            }
            else if (this.btn_ReturnToMenu.getBounds().contains(pos.x, pos.y)) {
                // Get Game Data from the selected planet
                this.game.state.start("mainMenuState"); // Jump to the MainMenuState
            }
        }
    }
}