var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
     * @desription This can be used as either a level select or a difficulty select screen. Depends on what direction we want to go.
     * @property {Phaser.Game} game                   - The game context
     * @property {Phaser.Sound} music                 - The SFX player
     * @property titleScreenImage {Phaser.Sprite}     - The actual splash screen image to display
     * @property {Phaser.Sprite} planet1              - A possible planet the user can click on
     * @property {Phaser.Sprite} planet2              - A possible planet the user can click on
     * @property {Phaser.Sprite} planet3              - A possible planet the user can click on
     * @property {Phaser.Sprite} selectedPlanet       - The planet the user has currently selected
     * @property {Phaser.BitmapText} btn_Back         - A button to allow a user to return to the previous screen
     * @see {Phaser.State} */
    var MapSelectState = (function (_super) {
        __extends(MapSelectState, _super);
        /**
        * Default constructor, only calls the Phaser.State instructor for now.
        * @constructor
        */
        function MapSelectState() {
            _super.call(this);
        }
        /** @desription Populates the game state with sprites and registers the
        * event handlers needed for touch/mouse input
        */
        MapSelectState.prototype.create = function () {
            // Background
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            this.planet1 = this.add.sprite(0, 150, "planet1"); // Pull the image out of memory
            this.planet2 = this.add.sprite(124, 150, "planet2"); // Pull the image out of memory
            this.planet3 = this.add.sprite(248, 150, "planet3"); // Pull the image out of memory
            this.btn_Back = this.add.bitmapText(30, 400, "EdoSZ", "BACK");
            // Register Event Handlers
            this.input.onTap.add(this.PlanetClicked, this, 0, this.input.position);
        };
        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        MapSelectState.prototype.PlanetClicked = function (pos) {
            if (this.selectedPlanet != null) {
                if (this.selectedPlanet.getBounds().contains(pos.x, pos.y)) {
                    // Get Game Data from the selected planet
                    //this.game.state.start("gamePlayState"); // Jump to the GamePlayState
                    this.game.state.start("levelStartState"); // Jump to the levelStartState
                }
                else {
                    this.add.tween(this.selectedPlanet.scale).to({ x: 1.0, y: 1.0 }, 1500, Phaser.Easing.Elastic.InOut, true);
                }
            }
            else if (this.btn_Back.getBounds().contains(pos.x, pos.y)) {
                // This causes another instance of the song to play overtop of the existing instances/instance
                this.game.state.start("mainMenuState"); // Jump to MainMenuState
            }
            // Get the next seleceted planet
            if (this.planet1.getBounds().contains(pos.x, pos.y)) {
                this.selectedPlanet = this.planet1;
            }
            else if (this.planet2.getBounds().contains(pos.x, pos.y)) {
                this.selectedPlanet = this.planet2;
            }
            else if (this.planet3.getBounds().contains(pos.x, pos.y)) {
                this.selectedPlanet = this.planet3;
            }
            else {
                this.selectedPlanet = null;
            }
            if (this.selectedPlanet != null) {
                this.add.tween(this.selectedPlanet.scale).to({ x: 1.25, y: 1.25 }, 1500, Phaser.Easing.Elastic.InOut, true);
            }
        };
        return MapSelectState;
    }(Phaser.State));
    CosmicArkAdvanced.MapSelectState = MapSelectState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=MapSelectState.js.map