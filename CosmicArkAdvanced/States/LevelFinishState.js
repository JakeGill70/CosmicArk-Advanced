var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
* @description Level starting splash screen, explaining specifics of current level win/lose conditions
* @property game {Phaser.Game}             - The game context
* @property music {Phaser.Sound}           - The SFX player
* @property game {Phaser.Sprite}           - The actual splash screen image to display
* @property uiText {Phaser.BitmapText}     - Temp UI element for displaying score information
*/
    var LevelFinishState = (function (_super) {
        __extends(LevelFinishState, _super);
        /**
         * @constructor Default.
         */
        function LevelFinishState() {
            return _super.call(this) || this;
        }
        LevelFinishState.prototype.init = function (difficulty, score, timeRemaining, numberToCapture, numberCaught) {
            this.difficulty = difficulty;
            this.score = score;
            this.uiScore = score;
            this.timeRemaining = timeRemaining;
            this.numberToCapture = numberToCapture;
            this.numberCaught = numberCaught;
            this.isGameOver = false;
            if (this.timeRemaining <= 0) {
                this.isGameOver = true;
            }
        };
        /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
        LevelFinishState.prototype.create = function () {
            // Text Animation Timer
            this.timr = this.game.time.create(false);
            this.timr.loop(100, this.updateText, this);
            this.timr.start(2000);
            this.isFinishedAnimating = false;
            // Set background images
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Add Audio
            this.sfx = this.game.add.audio("beep", 0.8 * this.game.music.volume);
            this.sfx.allowMultiple = true;
            // Change music
            this.oldSong = this.game.music.key;
            this.game.music.stop();
            this.game.music = this.game.add.audio("victory", this.game.music.volume);
            this.game.music.loop = false;
            this.game.music.play();
            // Calculate the new score values
            this.timeBonus = Math.floor(this.timeRemaining) * 5;
            this.captureBonus = (this.numberToCapture * 500) + (this.numberCaught - this.numberToCapture) * 800;
            if (this.captureBonus < 0) {
                this.captureBonus = 0;
            } // If less than 0, set to 0
            this.score += this.timeBonus + this.captureBonus; // Assign the REAL score before having to wait on the UI stuff
            // UI
            this.uiText = this.game.add.bitmapText(40, 150, "EdoSZ", // maybe x = 50 would look better
            "Humans Abducted: " + this.numberCaught.toString() + " / " + this.numberToCapture +
                "\nAbduction Bonus: +" + this.captureBonus.toString() +
                "\nTime Remaining: " + this.timeRemaining.toFixed(2) + " sec" +
                "\nTime Bonus: +" + this.timeBonus.toString() +
                "\n\nScore: " + this.score);
            if (this.isGameOver) {
                var youLoseText = this.game.add.bitmapText(this.game.width / 2 + 80, 250, "EdoSZ", "YOU LOSE!!!");
            }
            // Register the "TitleClicked" even handler
            this.input.onTap.add(this.LevelStartClicked, this);
        };
        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
        LevelFinishState.prototype.LevelStartClicked = function () {
            if (this.isFinishedAnimating) {
                if (this.isGameOver) {
                    this.game.state.start("mainMenuState");
                }
                else {
                    // Increase the difficulty for the next round
                    this.difficulty += 0.25;
                    this.game.state.start("levelStartState", true, false, this.difficulty, this.score); // Go load the next level
                }
            }
            else {
                this.uiScore = this.score;
                this.captureBonus = 0;
                this.timeBonus = 0;
                this.updateText();
            }
        };
        LevelFinishState.prototype.updateText = function () {
            if (this.captureBonus > 0) {
                // Add capture bonus
                this.captureBonus -= 200;
                this.uiScore += 200;
                // Correct if the score moves too much
                if (this.captureBonus < 0) {
                    this.uiScore += this.captureBonus;
                    this.captureBonus = 0; // Reset to 0 for displaying
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
                    this.uiScore += 15;
                    // Correct if the score moves too much
                    if (this.timeBonus < 0) {
                        this.uiScore += this.timeBonus;
                        this.timeBonus = 0; // Reset to 0 for displaying
                    }
                    this.sfx.play();
                }
            }
            // Update the text
            this.uiText.text = "Humans Abducted: " + this.numberCaught.toString() + " / " + this.numberToCapture +
                "\nAbduction Bonus: +" + this.captureBonus.toString() +
                "\nTime Remaining: " + this.timeRemaining.toFixed(2) + " sec" +
                "\nTime Bonus: +" + this.timeBonus.toString() +
                "\n\nScore: " + this.uiScore.toString();
            this.uiText.updateText(); // NOT Recursion. This re-renders the bitmapped text
            if (this.timeBonus == 0 && this.captureBonus == 0) {
                this.isFinishedAnimating = true;
                // Play some awesome post-game music
                this.timr.stop(); // Stop the timer from accidently calling this again
                this.game.music.stop(); // Stop any rouge music that may be playing
                this.game.music = this.game.add.audio("Groove88", this.game.music.volume, true);
                this.game.music.play();
            }
        };
        LevelFinishState.prototype.shutdown = function () {
            this.titleScreenImage.destroy(true);
            this.uiText.destroy(true);
            this.game.music.stop();
            this.game.music = this.game.add.audio(this.oldSong, this.game.music.volume);
        };
        return LevelFinishState;
    }(Phaser.State));
    CosmicArkAdvanced.LevelFinishState = LevelFinishState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=LevelFinishState.js.map