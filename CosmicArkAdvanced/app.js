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
            this.game.load.image("title", "Graphics/Backgrounds/TitleCard3-4.png");
            // Most of the loading will now be done in the "TitleScreenState", which will now double as a loading screen.
            // Some things will still need to be preloaded, such as fonts, loading music, and the title screen itself.
            // Backgrounds
            // this.game.load.image("help",    "Graphics/Backgrounds/HelpScreen1.png");
            // this.game.load.image("main",    "Graphics/Backgrounds/MainMenuScreen2.png");
            // this.game.load.image("nightSky","Graphics/Backgrounds/NightSky.png");
            // this.game.load.image("city",    "Graphics/Backgrounds/CityBackdrop.png");
            // this.game.load.image("city1",   "Graphics/Backgrounds/City1.png");
            // // Sprites
            // this.game.load.spritesheet("man",   "Graphics/Sprites/walk5_sheet.png", 64, 64, 8);
            // this.game.load.image("gun",         "Graphics/Sprites/gun1.png");
            // this.game.load.image("rope",        "Graphics/Sprites/rope3.png");
            // this.game.load.spritesheet("ship",  "Graphics/Sprites/UFO_Glow.png", 48, 24, 2);
            // this.game.load.spritesheet( "bang", "Graphics/Sprites/bang.png", 64, 64, 14);
            // // Static Sprites
            // this.game.load.image("mothership",    "Graphics/Statics/mothership3.png");
            // this.game.load.image("hook",    "Graphics/Statics/hook2.png");
            // this.game.load.image("mine",    "Graphics/Statics/Mine3.png");
            // this.game.load.image("bullet",  "Graphics/Statics/bullet1.png");
            // this.game.load.image("planet1", "Graphics/Statics/planet_1.png");
            // this.game.load.image("planet2", "Graphics/Statics/planet_2.png");
            // this.game.load.image("planet3", "Graphics/Statics/planet_3.png");
            // Fonts
            // To make a bitmap font, use littera. It is an online flash tool.
            this.game.load.image("edo", "Fonts/EdoSZ.png");
            this.game.load.bitmapFont("EdoSZ", "Fonts/EdoSZ.png", "Fonts/EdoSZ.xml");
            // Audio
            // Use game.load.audio for music
            this.game.load.audio("ThereminsBeat", "Audio/Music/ThereminsBeatShort.wav");
            // Use game.load.audiosprite for SFX
        };
        /**
         * @description Adds the game states to the game context and sets the scaling mode.
         */
        MyGame.prototype.create = function () {
            // Add game states
            this.game.state.add("gamePlayState", CosmicArkAdvanced.GamePlayState, false);
            this.game.state.add("mapSelectState", CosmicArkAdvanced.MapSelectState, false);
            this.game.state.add("mainMenuState", CosmicArkAdvanced.MainMenuState, false);
            this.game.state.add("helpScreenState", CosmicArkAdvanced.HelpScreenState, false);
            this.game.state.add("levelStartState", CosmicArkAdvanced.LevelStartState, false);
            this.game.state.add("levelFinishState", CosmicArkAdvanced.LevelFinishState, false);
            this.game.state.add("titleScreenState", CosmicArkAdvanced.TitleScreenState, true);
            console.log(MyGame.AUTO_SCALING);
            console.log(this.game.scale.scaleMode);
            if (MyGame.AUTO_SCALING == true) {
                if (!this.game.device.desktop) {
                    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
                    //have the game centered horizontally
                    this.game.scale.pageAlignHorizontally = true;
                    this.game.scale.pageAlignVertically = true;
                    this.game.scale.startFullScreen(true);
                }
            }
        };
        return MyGame;
    }());
    MyGame.AUTO_SCALING = true; // Debug var
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