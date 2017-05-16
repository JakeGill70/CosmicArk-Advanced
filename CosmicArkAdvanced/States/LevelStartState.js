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
    var LevelStartState = (function (_super) {
        __extends(LevelStartState, _super);
        /**
         * @constructor Default.
         */
        function LevelStartState() {
            _super.call(this);
        }
        /**
         * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
         */
        LevelStartState.prototype.create = function () {
            //if (!this.game.device.desktop) {
            //    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            //    this.game.scale.startFullScreen(false);
            //}
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            //this.titleScreenImage = this.add.sprite(0, 0, "nightSky"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // UI
            this.uiText = this.game.add.bitmapText(40, 150, "EdoSZ", // maybe x = 50 would look better
            "TIME ALOTTED: " /*+ this.player.aliensOnBoard.toString()*/ +
                "\nHUMANS NEEDED: " /*+ this.player.aliensCaptured.toString()*/ +
                "\nLIVES PROVIDED: ");
            // Register the "TitleClicked" even handler
            this.input.onTap.addOnce(this.LevelStartClicked, this);
        };
        /**
         * @Description Handles the "onTap" event. Just moves over to the gamePlayState state.
         */
        LevelStartState.prototype.LevelStartClicked = function () {
            this.game.state.start("gamePlayState"); // Jump to the GamePlayState
        };
        return LevelStartState;
    }(Phaser.State));
    CosmicArkAdvanced.LevelStartState = LevelStartState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=LevelStartState.js.map