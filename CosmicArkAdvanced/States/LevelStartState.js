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
            /*
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
            */
        };
        /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
        LevelStartState.prototype.create = function () {
            // Start Music
            if (!this.game.music.isPlaying) {
                switch (this.game.music.key) {
                    case "ThereminsBeat":
                        this.game.music = this.game.add.sound("SlideWhistleBlues", this.game.music.volume, true);
                        break;
                    case "SlideWhistleBlues":
                        this.game.music = this.game.add.sound("RunTripAndFall", this.game.music.volume, true);
                        break;
                    case "RunTripAndFall":
                        this.game.music = this.game.add.sound("LikePaper", this.game.music.volume, true);
                        break;
                    case "LikePaper":
                    default:
                        this.game.music = this.game.add.sound("ThereminsBeat", this.game.music.volume, true);
                        break;
                }
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
        LevelStartState.prototype.shutdown = function () {
            this.titleScreenImage.destroy(true);
            this.uiText.destroy(true);
        };
        return LevelStartState;
    }(Phaser.State));
    CosmicArkAdvanced.LevelStartState = LevelStartState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=LevelStartState.js.map