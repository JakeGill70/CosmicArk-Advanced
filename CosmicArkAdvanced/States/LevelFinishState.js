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
            console.log("the LevelFinishState has started!"); // testing
            console.log("DebugInfo:");
            console.log(this.difficulty);
            console.log(this.score);
            console.log(this.timeRemaining);
            console.log(this.numberToCapture);
            console.log(this.numberCaught);
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Calculate the new score value
            this.score += (this.numberToCapture * 1000) + ((this.numberCaught - this.numberToCapture) * 100) + (this.timeRemaining * 5);
            this.score = Math.floor(this.score);
            // UI
            // TODO: Is there a way to animate these numbers appearing?
            this.uiText = this.game.add.bitmapText(40, 150, "EdoSZ", // maybe x = 50 would look better
            "Humans Abducted: " + this.numberCaught.toString() + " / " + this.numberToCapture +
                "\nAbduction Bonus: +" + ((this.numberCaught - this.numberToCapture) * 100).toString() +
                "\nTime Remaining: " + this.timeRemaining.toFixed(2) + " sec" +
                "\nTime Bonus: +" + (Math.floor(this.timeRemaining) * 5).toString() +
                "\n\nScore: " + this.score);
            // Register the "TitleClicked" even handler
            this.input.onTap.add(this.LevelStartClicked, this);
        };
        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
        LevelFinishState.prototype.LevelStartClicked = function () {
            this.game.state.start("levelStartState", true, false, this.difficulty, this.score); // Go load the next level            }
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