var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
* @description Level starting splash screen, explaining specifics of current level win/lose conditions
* @property game {Phaser.Game}             - The game context
* @property music {Phaser.Sound}           - The SFX player
* @property game {Phaser.Sprite}           - The actual splash screen image to display
* @property uiText {Phaser.BitmapText}     - Temp UI element for displaying score information
*/
    class LevelStartState extends Phaser.State {
        /**
         * @constructor Default.
         */
        constructor() {
            super();
        }
        /**
         * @description TODO
         */
        init(difficulty, score) {
            this.difficulty = difficulty;
            this.score = score;
            let d2 = this.difficulty ^ 2;
            let lowerBounds = 3.6 * this.difficulty - 1.4;
            let upperBounds = 4.3 * this.difficulty + 0.3;
            let boundRange = upperBounds - lowerBounds + 1;
            let time = (7 * d2) + (7 * this.difficulty) + 15;
            let perPersonTime = (this.difficulty < 5) ? 8 - this.difficulty : 3;
            this.numberToCapture = Math.round(Math.random() * boundRange + lowerBounds);
            this.timeToCapture = time + (this.numberToCapture * perPersonTime);
        }
        /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
        create() {
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
        }
        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
        LevelStartClicked() {
            console.log("I'm over here!");
            this.game.state.start("gamePlayState", true, false, this.difficulty, this.timeToCapture, this.numberToCapture, this.score); // Jump to the GamePlayState
        }
        /**
         * @description un-initialize components
         */
        shutdown() {
            this.titleScreenImage.destroy(true);
            this.uiText.destroy(true);
        }
    }
    CosmicArkAdvanced.LevelStartState = LevelStartState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=LevelStartState.js.map