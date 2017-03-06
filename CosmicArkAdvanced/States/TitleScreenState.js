var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    var TitleScreenState = (function (_super) {
        __extends(TitleScreenState, _super);
        function TitleScreenState() {
            _super.call(this);
        }
        TitleScreenState.prototype.create = function () {
            this.titleScreenImage = this.add.sprite(0, 0, "title"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Register the "TitleClicked" even handler
            this.input.onTap.addOnce(this.TitleClicked, this);
        };
        TitleScreenState.prototype.TitleClicked = function () {
            this.game.state.start("mapSelectState"); // Jump to the GamePlayState
        };
        return TitleScreenState;
    })(Phaser.State);
    CosmicArkAdvanced.TitleScreenState = TitleScreenState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=TitleScreenState.js.map