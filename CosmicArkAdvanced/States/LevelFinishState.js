var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            _super.call(this);
        }
        LevelFinishState.prototype.init = function (difficulty, score, timeRemaining, numberToCapture, numberCaught) {
            this.difficulty = difficulty;
            this.score = score;
            this.timeRemaining = timeRemaining;
            this.numberToCapture = numberToCapture;
            this.numberCaught = numberCaught;
        };
        /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
        LevelFinishState.prototype.create = function () {
            // Text Animation Timer
            this.timr = this.game.time.create(false);
            this.timr.loop(100, this.updateText, this);
            this.timr.start(2000);
            // Set background images
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Add Audio
            this.sfx = this.game.add.audio("beep", 0.8 * this.game.music.volume);
            this.sfx.allowMultiple = true;
            // Change music
            var oldSong = this.game.music.key;
            this.game.music.stop();
            this.game.music = this.game.add.audio("victory", this.game.music.volume);
            this.game.music.loop = false;
            this.game.music.play();
            this.game.music = this.game.add.audio(oldSong, this.game.music.volume);
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
        };
        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
        LevelFinishState.prototype.LevelStartClicked = function () {
            // Increase the difficulty for the next round
            this.difficulty += 0.25;
            this.game.state.start("levelStartState", true, false, this.difficulty, this.score); // Go load the next level            }
        };
        LevelFinishState.prototype.updateText = function () {
            if (this.captureBonus > 0) {
                // Add capture bonus
                this.captureBonus -= 200;
                this.score += 200;
                // Correct if the score moves too much
                if (this.captureBonus < 0) {
                    this.score += this.captureBonus;
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
                    this.score += 15;
                    // Correct if the score moves too much
                    if (this.timeBonus < 0) {
                        this.score += this.timeBonus;
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
                "\n\nScore: " + this.score.toString();
            this.uiText.updateText();
        };
        LevelFinishState.prototype.shutdown = function () {
            this.titleScreenImage.destroy(true);
            this.uiText.destroy(true);
        };
        return LevelFinishState;
    }(Phaser.State));
    CosmicArkAdvanced.LevelFinishState = LevelFinishState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=LevelFinishState.js.map