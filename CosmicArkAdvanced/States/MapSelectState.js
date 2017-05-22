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
     * @property {Phaser.Sprite} planet1              - A possible planet the user can click on
     * @property {Phaser.Sprite} planet2              - A possible planet the user can click on
     * @property {Phaser.Sprite} planet3              - A possible planet the user can click on
     * @property {Phaser.Sprite} selectedPlanet       - The planet the user has currently selected
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
            this.planet1 = this.add.sprite(0, 15, "planet1"); // Pull the image out of memory
            this.planet2 = this.add.sprite(124, 15, "planet2"); // Pull the image out of memory
            this.planet3 = this.add.sprite(248, 15, "planet3"); // Pull the image out of memory
            // Register Event Handlers
            this.input.onTap.add(this.PlanetClicked, this, 0, this.input.position);
        };
        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        MapSelectState.prototype.PlanetClicked = function (pos) {
            if (this.selectedPlanet != null) {
                // Did the user click on that same planet?
                if (this.selectedPlanet.getBounds().contains(pos.x, pos.y)) {
                    this.game.state.start("levelStartState", true, false, this.difficulty); // If yes, then load that level
                    return; // And exit this method
                }
            }
            // Get the next seleceted planet
            if (this.planet1.getBounds().contains(pos.x, pos.y)) {
                this.difficulty = 1;
                this.selectPlanet(this.planet1);
            }
            else if (this.planet2.getBounds().contains(pos.x, pos.y)) {
                this.difficulty = 2;
                this.selectPlanet(this.planet2);
            }
            else if (this.planet3.getBounds().contains(pos.x, pos.y)) {
                this.difficulty = 3;
                this.selectPlanet(this.planet3);
            }
            else {
                this.selectPlanet(null);
                this.difficulty = 0;
            }
        };
        MapSelectState.prototype.selectPlanet = function (p) {
            // Shrink the scale of the old planet
            if (this.selectedPlanet != null) {
                this.selectedPlanet.scale.setTo(1, 1);
            }
            // Set the selected planet
            this.selectedPlanet = p;
            // Grow the scale of the new planet
            if (this.selectedPlanet != null) {
                this.selectedPlanet.scale.setTo(1.25, 1.25);
            }
        };
        return MapSelectState;
    }(Phaser.State));
    CosmicArkAdvanced.MapSelectState = MapSelectState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=MapSelectState.js.map