﻿module CosmicArkAdvanced {
    /**
* @description Level starting splash screen, explaining specifics of current level win/lose conditions
* @property game {Phaser.Game}             - The game context
* @property music {Phaser.Sound}           - The SFX player
* @property game {Phaser.Sprite}           - The actual splash screen image to display
* @property uiText {Phaser.BitmapText}     - Temp UI element for displaying score information
*/
    export class LevelFinishState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        titleScreenImage: Phaser.Sprite;
        uiText: Phaser.BitmapText;          // UI Text for updating score information

        timeRemaining: number;              // Number of seconds remaining on the timer when the level was completed
        numberToCapture: number;              // Number of aliens needed to be captured to complete the level
        numberCaught: number;           // Number of aliens captured during the level
        difficulty: number;             // Difficulty rating of the selected level

        score: number;              // Currently running score
        timeBonus: number;
        captureBonus: number; 

        timr: Phaser.Timer;

        sfx: Phaser.Sound;

        /**
         * @constructor Default.
         */
        constructor() {
            super();
        }


        init(difficulty: number, score: number, timeRemaining: number, numberToCapture: number, numberCaught: number) {
            this.difficulty = difficulty;
            this.score = score;
            this.timeRemaining = timeRemaining;
            this.numberToCapture = numberToCapture;
            this.numberCaught = numberCaught;
        }


        /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
        create() {
            // Text Animation Timer
            this.timr = this.game.time.create(false);
            this.timr.loop(100, this.updateText, this);
            this.timr.start(2000);

            // Set background images
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen

            // Add Audio
            this.sfx = this.game.add.audio("beep", 0.75);
            this.sfx.allowMultiple = true;

            // Change music
            let oldSong = this.game.music.key;
            this.game.music.stop();
            this.game.music = this.game.add.audio("victory", 0.9);
            this.game.music.loop = false;
            this.game.music.play();
            this.game.music = this.game.add.audio(oldSong, 0.9);

            // Calculate the new score values
            this.timeBonus = Math.floor(this.timeRemaining) * 5;
            this.captureBonus = (this.numberToCapture * 500) + (this.numberCaught - this.numberToCapture) * 800;

            // UI
            // TODO: Is there a way to animate these numbers appearing?
            this.uiText = this.game.add.bitmapText(40, 150, "EdoSZ", // maybe x = 50 would look better
                "Humans Abducted: " + this.numberCaught.toString() + " / " + this.numberToCapture +
                "\nAbduction Bonus: +" + this.captureBonus.toString() +
                "\nTime Remaining: " + this.timeRemaining.toFixed(2) + " sec" + 
                "\nTime Bonus: +" + this.timeBonus.toString() +
                "\n\nScore: " + this.score);

            // Register the "TitleClicked" even handler
            this.input.onTap.add(this.LevelStartClicked, this);
        }

        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
        LevelStartClicked() {
            this.game.state.start("levelStartState", true, false, this.difficulty, this.score); // Go load the next level            }
        }

        updateText() {
            if (this.captureBonus > 0) {
                // Add capture bonus
                this.captureBonus -= 200;
                this.score += 200;

                // Correct if the score moves too much
                if (this.captureBonus < 0) {
                    this.score += this.captureBonus;
                    this.captureBonus = 0;  // Reset to 0 for displaying
                }

                this.sfx.play();

                if (this.captureBonus == 0) {
                    // Put a slight pause in the score calculation once the capture bonus is finished
                    this.timr.stop(false);
                    this.timr.start(500);
                }
            }
            else {
                // Add time Bonus
                if (this.timeBonus > 0) {
                    this.timeBonus -= 15;
                    this.score += 15;

                    // Correct if the score moves too much
                    if (this.timeBonus < 0) {
                        this.score += this.timeBonus;
                        this.timeBonus = 0;  // Reset to 0 for displaying
                    }

                    this.sfx.play();
                }
            }

            // Update the text
            this.uiText.text = "Humans Abducted: " + this.numberCaught.toString() + " / " + this.numberToCapture +
                "\nAbduction Bonus: +" + this.captureBonus.toString() +
                "\nTime Remaining: " + this.timeRemaining.toFixed(2) + " sec" +
                "\nTime Bonus: +" + this.timeBonus.toString() +
                "\n\nScore: " + this.score.toString();
            this.uiText.updateText();
        }

        shutdown() {
            this.titleScreenImage.destroy(true);
            this.uiText.destroy(true);
        }
    }
}