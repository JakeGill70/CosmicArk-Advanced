var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
     * @desription Main Menu which only holds UI elements and lets the user navigate the program
     * @property {Phaser.Game} game                   - The game context
     * @property {Phaser.Sound} music                 - The SFX player
     * @property {Phaser.Sprite} selectedPlanet       - The planet the user has currently selected
     * @see {Phaser.State} */
    var MainMenuState = (function (_super) {
        __extends(MainMenuState, _super);
        /**
        * Default constructor, only calls the Phaser.State instructor for now.
        * @constructor
        */
        function MainMenuState() {
            _super.call(this);
        }
        /** @desription Populates the game state with sprites and registers the
        * event handlers needed for touch/mouse input
        */
        MainMenuState.prototype.create = function () {
            // Make background image
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Make Buttons
            this.btn_Play = this.add.bitmapText(250, 160, "EdoSZ", "PLAY NOW");
            this.btn_Help = this.add.bitmapText(250, 200, "EdoSZ", "HOW TO PLAY");
            this.btn_Music = this.add.bitmapText(700, 0, "EdoSZ", "MUSIC ON/OFF");
            // Register Event Handlers
            this.input.onTap.add(this.PlanetClicked, this, 0, this.input.position);
        };
        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        MainMenuState.prototype.PlanetClicked = function (pos) {
            var counter = 0;
            if (this.btn_Play.getBounds().contains(pos.x, pos.y)) {
                this.game.state.start("mapSelectState"); // Jump to MapSelectState
            }
            else if (this.btn_Help.getBounds().contains(pos.x, pos.y)) {
                // Get Game Data from the selected planet
                this.game.state.start("helpScreenState"); // Jump to the HelpScreenState
            }
            else if (this.btn_Music.getBounds().contains(pos.x, pos.y)) {
                if (counter % 2 == 0) {
                }
                else {
                }
            }
        };
        return MainMenuState;
    }(Phaser.State));
    CosmicArkAdvanced.MainMenuState = MainMenuState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=MainMenuState.js.map