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
     * @description Simple splash screen to display while loading
     * @property game {Phaser.Game}             - The game context
     * @property music {Phaser.Sound}           - The SFX player
     * @property game {Phaser.Sprite}           - The actual splash screen image to display
     */
    var HelpScreenState = (function (_super) {
        __extends(HelpScreenState, _super);
        /**
         * @constructor Default.
         */
        function HelpScreenState() {
            return _super.call(this) || this;
        }
        HelpScreenState.prototype.init = function (_cameFromPlayState) {
            if (_cameFromPlayState === void 0) { _cameFromPlayState = false; }
            this.cameFromPlayState = _cameFromPlayState;
        };
        /**
         * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
         */
        HelpScreenState.prototype.create = function () {
            //if (!this.game.device.desktop) {
            //    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            //    this.game.scale.startFullScreen(false);
            //}
            this.game.readInstructionsAtLeastOnce = true;
            this.titleScreenImage = this.add.sprite(0, 0, "help"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Register the "TitleClicked" even handler
            this.input.onTap.addOnce(this.TitleClicked, this);
        };
        /**
         * @Description Handles the "onTap" event. Just moves over to the mapSelectState state.
         */
        HelpScreenState.prototype.TitleClicked = function () {
            if (this.cameFromPlayState) {
                this.game.state.start("mapSelectState"); // Jump to MapSelectState
            }
            else {
                this.game.state.start("mainMenuState"); // Jump to the MainMenuState
            }
        };
        return HelpScreenState;
    }(Phaser.State));
    CosmicArkAdvanced.HelpScreenState = HelpScreenState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=HelpScreenState.js.map