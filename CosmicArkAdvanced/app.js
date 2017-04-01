var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
     * @description The setup for the game context
     * @property game {Phaser.game}         - The game context used by everything else in the game.
     */
    var MyGame = (function () {
        /**
         * @description Creates the game context to use with the rest of the game
         * @param _elementHook       - The html div box that the game context should be created in.
         * @param _sizeOfScreen      - The size of the window containing the game
         * @constructor
         */
        function MyGame(_elementHook) {
            // Phaser.AUTO selects either WebGL or canvas (Which ever the browser likes better),
            // then places it in the HTML document at 'elementHook' tag.
            this.game = new Phaser.Game(800, 450, Phaser.AUTO, _elementHook, {
                create: this.create, preload: this.preload
            });
        }
        /**
         * @description Loads the assests used in the game.
         */
        MyGame.prototype.preload = function () {
            // Backgrounds
            this.game.load.image("title", "Graphics/Backgrounds/TitleCard.png");
            this.game.load.image("nightSky", "Graphics/Backgrounds/NightSky.png");
            this.game.load.image("city", "Graphics/Backgrounds/CityBackdrop.png");
            // Sprites
            this.game.load.image("man", "Graphics/Sprites/Man.png");
            this.game.load.image("gun", "Graphics/Sprites/gun1.png");
            this.game.load.image("bullet", "Graphics/Sprites/bullet1.png");
            this.game.load.spritesheet("ship", "Graphics/Sprites/dinghy4.png", 52, 24, 2);
            this.game.load.image("mine", "Graphics/Sprites/Mine3.png");
            // Static Sprites
            this.game.load.image("planet1", "Graphics/Statics/planet_1.png");
            this.game.load.image("planet2", "Graphics/Statics/planet_2.png");
            this.game.load.image("planet3", "Graphics/Statics/planet_3.png");
            // Audio
            // Use game.load.audio for music
            // Use game.load.audiosprite for SFX
        };
        /**
         * @description Adds the game states to the game context and sets the scaling mode.
         */
        MyGame.prototype.create = function () {
            // Add game states
            this.game.state.add("titleScreenState", CosmicArkAdvanced.TitleScreenState, true);
            this.game.state.add("gamePlayState", CosmicArkAdvanced.GamePlayState, false);
            this.game.state.add("mapSelectState", CosmicArkAdvanced.MapSelectState, false);
            if (MyGame.AUTO_SCALING == true) {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            // If on a mobile device, Set the scale mode to be an exact fit
            if (!this.game.device.desktop) {
                this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            }
        };
        MyGame.AUTO_SCALING = false; // Debug var
        return MyGame;
    })();
    CosmicArkAdvanced.MyGame = MyGame;
    /**
     * @description global function used to find the difference between to x,y corrdinates
     * @param srcX      - The source x coordinate
     * @param srcY      - The source y coordinate
     * @param destX     - The destination's x coordinate
     * @param destY     - The destination's y coordinate
     */
    function Dist(srcX, srcY, destX, destY) {
        return ((srcX - destX) + (srcY - destY));
    }
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
/**
@description The javascript COM event that creates the game in the webpage.
*/
window.onload = function () {
    var el = document.getElementById('content');
    var game = new CosmicArkAdvanced.MyGame(el);
};
//# sourceMappingURL=app.js.map