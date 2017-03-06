var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    var GamePlayState = (function (_super) {
        __extends(GamePlayState, _super);
        function GamePlayState() {
            _super.call(this);
        }
        GamePlayState.prototype.create = function () {
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);
            // Be careful, the order the objects are added into the state, is the order they will be rendered onto the screen
            // Make the objects
            this.backdrop1 = new Phaser.Image(this.game, 0, 0, "nightSky");
            this.backdrop2 = new Phaser.Image(this.game, 0, this.game.world.height, "city");
            this.backdrop2_2 = new Phaser.Image(this.game, this.game.width, this.game.world.height, "city");
            this.player = new CosmicArkAdvanced.Player(this.game, 0, 50);
            this.man1 = new CosmicArkAdvanced.Man(this.game, 50, this.game.world.height - 50);
            // Make adjustments to objects
            this.backdrop1.scale.setTo(this.game.world.width / this.backdrop1.width, this.game.world.height / this.backdrop1.height); // Scale it to fit the size of the screen
            this.backdrop2.anchor.setTo(0, 1);
            this.backdrop2_2.anchor.setTo(0, 1);
            this.backdrop2.scale.setTo(this.game.width / this.backdrop2.width, this.game.height / this.backdrop2.height); // Scale it to fit the size of the screen
            this.backdrop2_2.scale.setTo(this.game.width / this.backdrop2_2.width, this.game.height / this.backdrop2_2.height); // Scale it to fit the size of the screen
            // Add them into the state
            this.game.add.existing(this.backdrop1);
            this.game.add.existing(this.backdrop2);
            this.game.add.existing(this.backdrop2_2);
            this.game.add.existing(this.player);
            this.game.add.existing(this.man1);
            // Set Camera settings
            this.game.camera.follow(this.player);
        };
        return GamePlayState;
    })(Phaser.State);
    CosmicArkAdvanced.GamePlayState = GamePlayState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=GamePlayState.js.map