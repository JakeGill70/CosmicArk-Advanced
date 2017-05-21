var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
     * @description Simple splash screen to display while loading
     * @property game {Phaser.Game}             - The game context
     * @property music {Phaser.Sound}           - The SFX player
     * @property game {Phaser.Sprite}           - The actual splash screen image to display
     * @property finishedLoading {boolean}
     */
    var TitleScreenState = (function (_super) {
        __extends(TitleScreenState, _super);
        /**
         * @constructor Default.
         */
        function TitleScreenState() {
            _super.call(this);
        }
        /**
         * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
         */
        TitleScreenState.prototype.create = function () {
            // Display title card
            this.titleScreenImage = this.add.sprite(0, 0, "title"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Add prompt message
            this.text = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.75, "EdoSZ");
            this.text.align = "center";
            this.text.anchor = new Phaser.Point(0.5, 0.5);
            this.text.setText("click to begin");
            // Begin music
            var music = this.game.add.audio("ThereminsBeat", 90, true);
            music.play();
            // Register loading events
            this.finishedLoading = false;
            this.game.load.onFileComplete.add(this.fileComplete, this); // Register the file complete event
            this.game.load.onLoadComplete.add(this.loadComplete, this); // Register the load complete event
            // Register the "TitleClicked" even handler
            this.input.onTap.add(this.TitleClicked, this);
        };
        /**
         * @Description Handles the "onTap" event. Just moves over to the mapSelectState state.
         */
        TitleScreenState.prototype.TitleClicked = function () {
            if (this.finishedLoading) {
                this.game.state.start("mainMenuState");
            }
            else {
                if (!this.game.load.isLoading) {
                    this.text.setText("Loading...");
                    this.loadStuff();
                }
            }
        };
        TitleScreenState.prototype.fileComplete = function () {
            this.text.setText("Loading... " + this.game.load.progress.toString() + "%");
        };
        TitleScreenState.prototype.loadComplete = function () {
            this.finishedLoading = true;
            this.text.setText("Click to Continue");
        };
        TitleScreenState.prototype.loadStuff = function () {
            // Backgrounds
            this.game.load.image("help", "Graphics/Backgrounds/HelpScreen1.png");
            this.game.load.image("main", "Graphics/Backgrounds/MainMenuScreen2.png");
            this.game.load.image("nightSky", "Graphics/Backgrounds/NightSky.png");
            this.game.load.image("city", "Graphics/Backgrounds/CityBackdrop.png");
            this.game.load.image("city1", "Graphics/Backgrounds/City1.png");
            // Sprites
            this.game.load.spritesheet("man", "Graphics/Sprites/walk5_sheet.png", 64, 64, 8);
            this.game.load.image("gun", "Graphics/Sprites/gun1.png");
            this.game.load.image("rope", "Graphics/Sprites/rope3.png");
            this.game.load.spritesheet("ship", "Graphics/Sprites/UFO_Glow.png", 48, 24, 2);
            this.game.load.spritesheet("bang", "Graphics/Sprites/bang.png", 64, 64, 14);
            // Static Sprites
            this.game.load.image("mothership", "Graphics/Statics/mothership3.png");
            this.game.load.image("hook", "Graphics/Statics/hook2.png");
            this.game.load.image("mine", "Graphics/Statics/Mine3.png");
            this.game.load.image("bullet", "Graphics/Statics/bullet1.png");
            this.game.load.image("planet1", "Graphics/Statics/planet_1.png");
            this.game.load.image("planet2", "Graphics/Statics/planet_2.png");
            this.game.load.image("planet3", "Graphics/Statics/planet_3.png");
            this.game.load.start();
        };
        return TitleScreenState;
    }(Phaser.State));
    CosmicArkAdvanced.TitleScreenState = TitleScreenState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=TitleScreenState.js.map