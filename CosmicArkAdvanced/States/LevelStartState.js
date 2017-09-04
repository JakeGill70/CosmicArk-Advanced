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
    var LevelStartState = (function (_super) {
        __extends(LevelStartState, _super);
        /**
         * @constructor Default.
         */
        function LevelStartState() {
            return _super.call(this) || this;
        }
        /**
         * @description TODO
         */
        LevelStartState.prototype.init = function (difficulty, score) {
            this.difficulty = difficulty;
            this.score = score;
            var d2 = this.difficulty ^ 2;
            var lowerBounds = 3.6 * this.difficulty - 1.4;
            var upperBounds = 4.3 * this.difficulty + 0.3;
            var boundRange = upperBounds - lowerBounds + 1;
            var time = (7 * d2) + (7 * this.difficulty) + 15;
            var perPersonTime = (this.difficulty < 5) ? 8 - this.difficulty : 3;
            this.numberToCapture = Math.round(Math.random() * boundRange + lowerBounds);
            this.timeToCapture = time + (this.numberToCapture * perPersonTime);
        };
        /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
        LevelStartState.prototype.create = function () {
            // Start Music
            if (!this.game.music.isPlaying) {
                this.game.songIndex = (this.game.songIndex + 1 < this.game.songs.length) ? this.game.songIndex + 1 : 0;
                this.game.music = this.game.add.sound(this.game.songs[this.game.songIndex], this.game.music.volume, true);
                this.game.music.play();
            }
            console.log("Song Name: " + this.game.music.key);
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // UI
            this.uiText = this.game.add.bitmapText(40, 150, "EdoSZ", // maybe x = 50 would look better
            "TIME ALOTTED: " + this.timeToCapture.toString() + " seconds" +
                "\nHUMANS NEEDED: " + this.numberToCapture.toString());
            // Register the "TitleClicked" even handler
            this.input.onTap.add(this.LevelStartClicked, this);
        };
        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
        LevelStartState.prototype.LevelStartClicked = function () {
            console.log("I'm over here!");
            this.game.state.start("gamePlayState", true, false, this.difficulty, this.timeToCapture, this.numberToCapture, this.score); // Jump to the GamePlayState
        };
        /**
         * @description un-initialize components
         */
        LevelStartState.prototype.shutdown = function () {
            this.titleScreenImage.destroy(true);
            this.uiText.destroy(true);
        };
        return LevelStartState;
    }(Phaser.State));
    CosmicArkAdvanced.LevelStartState = LevelStartState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=LevelStartState.js.map