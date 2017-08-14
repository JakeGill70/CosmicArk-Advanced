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
            return _super.call(this) || this;
        }
        /** @desription Populates the game state with sprites and registers the
        * event handlers needed for touch/mouse input
        */
        MapSelectState.prototype.create = function () {
            this.selectedPlanet = null; // Make sure nothing was selected
            // Add the difficulty/level select text
            var txt_explain = this.game.add.bitmapText(0, 15, "EdoSZ", "Choose Your Planet");
            txt_explain.position.setTo(this.game.width / 2 - txt_explain.textWidth / 2, 15);
            txt_explain.tint = 0xFF0000;
            // Add the text labeling in difficulty
            var txt_easy = this.game.add.bitmapText(20, 120, "EdoSZ", "Easy");
            var txt_medium = this.game.add.bitmapText(this.game.width / 3 + 10, 120, "EdoSZ", "Normal");
            var txt_hard = this.game.add.bitmapText(this.game.width * 2 / 3 + 10, 120, "EdoSZ", "Hard");
            // TODO : Make this screen look pretty
            var txt_note = this.game.add.bitmapText(15, this.game.height - 45, "EdoSZ", "TODO: Make this screen look pretty");
            this.planet1 = this.game.add.sprite(5, 160, "planet1"); // Pull the image out of memory
            this.planet2 = this.game.add.sprite(this.game.width / 3, 160, "planet2"); // Pull the image out of memory
            this.planet3 = this.game.add.sprite(this.game.width * 2 / 3, 160, "planet3"); // Pull the image out of memory
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
                    this.game.state.start("levelStartState", true, false, this.difficulty, 0); // If yes, then load that level
                    // Send the difficulty and reset the score to 0
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
                // Move the planet to re-center it (25% / 2) aka 12.5%
                // Remember to move it while still 25% larger, since it was move is relative size
                // and it was moved after being made larger
                this.selectedPlanet.position.x += this.selectedPlanet.width / 8;
                this.selectedPlanet.position.y += this.selectedPlanet.height / 8;
                this.selectedPlanet.scale.setTo(1, 1);
            }
            // Set the selected planet
            this.selectedPlanet = p;
            // Grow the scale of the new planet
            if (this.selectedPlanet != null) {
                // 25% increase feels right to be responsive enough
                this.selectedPlanet.scale.setTo(1.25, 1.25);
                // Move the planet to re-center it (25% / 2) aka 12.5%
                this.selectedPlanet.position.x -= this.selectedPlanet.width / 8;
                this.selectedPlanet.position.y -= this.selectedPlanet.height / 8;
            }
        };
        return MapSelectState;
    }(Phaser.State));
    CosmicArkAdvanced.MapSelectState = MapSelectState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=MapSelectState.js.map