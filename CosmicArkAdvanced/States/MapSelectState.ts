module CosmicArkAdvanced {
   /** 
    * @desription This can be used as either a level select or a difficulty select screen. Depends on what direction we want to go.
    * @property {Phaser.Game} game                   - The game context
    * @property {Phaser.Sound} music                 - The SFX player
    * @property {Phaser.Sprite} planet1              - A possible planet the user can click on
    * @property {Phaser.Sprite} planet2              - A possible planet the user can click on
    * @property {Phaser.Sprite} planet3              - A possible planet the user can click on
    * @property {Phaser.Sprite} selectedPlanet       - The planet the user has currently selected
    * @see {Phaser.State} */
    export class MapSelectState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        planet1: Phaser.Sprite;
        planet2: Phaser.Sprite;
        planet3: Phaser.Sprite;
        selectedPlanet: Phaser.Sprite;

        /**
        * Default constructor, only calls the Phaser.State instructor for now.
        * @constructor
        */
        constructor() {
            super();
        }

        /** @desription Populates the game state with sprites and registers the
        * event handlers needed for touch/mouse input
        */
        create() {
            this.planet1 = this.add.sprite(0  , 15, "planet1"); // Pull the image out of memory
            this.planet2 = this.add.sprite(124, 15, "planet2"); // Pull the image out of memory
            this.planet3 = this.add.sprite(248, 15, "planet3"); // Pull the image out of memory

            // Register Event Handlers
            this.input.onTap.add(this.PlanetClicked, this, 0, this.input.position);
        }

        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        PlanetClicked(pos: Phaser.Point) {
            if (this.selectedPlanet != null) { // If we have selected a planet before
                if (this.selectedPlanet.getBounds().contains(pos.x, pos.y)){ // Did we click it again?
                    // Get Game Data from the selected planet
                    //this.game.state.start("gamePlayState"); // Jump to the GamePlayState
                    this.game.state.start("levelStartState"); // Jump to the levelStartState
                }
                else { // We clicked something different
                    this.add.tween(this.selectedPlanet.scale).to({ x: 1.0, y: 1.0}, 1500, Phaser.Easing.Elastic.InOut, true);
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

            if (this.selectedPlanet != null) { // If we actually selected a new planet
                this.add.tween(this.selectedPlanet.scale).to({ x: 1.25, y: 1.25 }, 1500, Phaser.Easing.Elastic.InOut, true);
            }
        }
    }
}