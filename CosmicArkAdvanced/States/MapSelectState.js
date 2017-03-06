var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    var MapSelectState = (function (_super) {
        __extends(MapSelectState, _super);
        function MapSelectState() {
            _super.call(this);
        }
        MapSelectState.prototype.create = function () {
            this.planet1 = this.add.sprite(0, 15, "planet1"); // Pull the image out of memory
            this.planet2 = this.add.sprite(124, 15, "planet2"); // Pull the image out of memory
            this.planet3 = this.add.sprite(248, 15, "planet3"); // Pull the image out of memory
            // Register Event Handlers
            this.input.onTap.add(this.PlanetClicked, this, 0, this.input.position);
        };
        MapSelectState.prototype.PlanetClicked = function (pos) {
            if (this.selectedPlanet != null) {
                if (this.selectedPlanet.getBounds().contains(pos.x, pos.y)) {
                    // Get Game Data from the selected planet
                    this.game.state.start("gamePlayState"); // Jump to the GamePlayState
                }
                else {
                    this.add.tween(this.selectedPlanet.scale).to({ x: 1.0, y: 1.0 }, 1500, Phaser.Easing.Elastic.InOut, true);
                }
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
    })(Phaser.State);
    CosmicArkAdvanced.MapSelectState = MapSelectState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=MapSelectState.js.map