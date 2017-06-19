﻿module CosmicArkAdvanced {
        /**
    * @description Level starting splash screen, explaining specifics of current level win/lose conditions
    * @property game {Phaser.Game}             - The game context
    * @property music {Phaser.Sound}           - The SFX player
    * @property game {Phaser.Sprite}           - The actual splash screen image to display
    * @property uiText {Phaser.BitmapText}     - Temp UI element for displaying score information
    */
    export class LevelStartState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite;
        uiText: Phaser.BitmapText;          // UI Text for updating score information
        timeToCapture;                       // Timer in seconds
        numberToCapture: number;              // Number of aliens needed to be captured to complete the level
        difficulty: number;             // Difficulty rating of the selected level
        score: number;
       /**
        * @constructor Default.
        */
        constructor() {
            super();
        }

        init(difficulty: number, score: number) {
            this.difficulty = difficulty;
            this.score = score;
            if (difficulty == 1) {
                this.numberToCapture = Math.floor(Math.random() * 3) + 3; // Random number from 3 to 5
                this.timeToCapture = 15 + (this.numberToCapture * 15);   // 15 seconds + 7 seconds for every person you need to abduct
            }
            else if (difficulty == 2) {
                this.numberToCapture = Math.floor(Math.random() * 4) + 5; // Random number from 5 to 8
                this.timeToCapture = 15 + (this.numberToCapture * 14);   // 15 seconds + 7 seconds for every person you need to abduct
            }
            else if (difficulty == 3) {
                this.numberToCapture = Math.floor(Math.random() * 6) + 9; // Random number from 9 to 14
                this.timeToCapture = 12 + (this.numberToCapture * 12);   // 15 seconds + 7 seconds for every person you need to abduct
            }
            else {
                console.error("Unknown difficulty selected. Hardest will be selected instead >:)");
                this.numberToCapture = Math.floor(Math.random() * 6) + 9; // Random number from 9 to 14
                this.timeToCapture = 12 + (this.numberToCapture * 12);   // 15 seconds + 7 seconds for every person you need to abduct
                this.difficulty = 3;
            }
        }

    
        /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
       create() {
           
            console.log("the LevelStartState has started!"); // testing
       
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen
       
            // UI
            this.uiText = this.game.add.bitmapText(40, 150, "EdoSZ", // maybe x = 50 would look better
                    "TIME ALOTTED: " + this.timeToCapture.toString() + " seconds" +
                    "\nHUMANS NEEDED: " + this.numberToCapture.toString());
       
            // Register the "TitleClicked" even handler
            this.input.onTap.add(this.LevelStartClicked, this);
        }
    
        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
        LevelStartClicked() {
            console.log("I'm over here!");
            this.game.state.start("gamePlayState", true, false, this.difficulty, this.timeToCapture, this.numberToCapture, this.score); // Jump to the GamePlayState
       }

        shutdown() {
            this.titleScreenImage.destroy(true);
            this.uiText.destroy(true);
        }
    }
}