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
     * @property titleScreenImage {Phaser.Sprite}     - The actual splash screen image to display
     * @property {Phaser.Bitmap.Text} btn_Help        - A button to show details on how to play
     * @property {Phaser.Bitmap.Text} btn_Play        - A button that takes you to the level selection screen.
     * @property {Phaser.Bitmap.Text} btn_Music       - A button to mute or play music
     * @property {Phaser.Bitmap.Text} btn_Back        - A button to allow the user to go back to the previous screen
     * @see {Phaser.State} */
    var MainMenuState = (function (_super) {
        __extends(MainMenuState, _super);
        /**
        * Default constructor, only calls the Phaser.State instructor for now.
        * @constructor
        */
        function MainMenuState() {
            _super.call(this);
            this.counter = 0;
            this.tss = new CosmicArkAdvanced.TitleScreenState();
        }
        /** @desription Populates the game state with sprites and registers the
        * event handlers needed for touch/mouse input
        */
        MainMenuState.prototype.create = function () {
            // Make background image
            this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); // Scale it to fit the size of the screen
            // Make Buttons
            this.btn_Play = this.add.bitmapText(250, 180, "EdoSZ", "PLAY NOW");
            this.btn_Help = this.add.bitmapText(250, 280, "EdoSZ", "HOW TO PLAY");
            this.btn_Music = this.add.bitmapText(580, 400, "EdoSZ", "MUSIC ON/OFF");
            this.btn_Back = this.add.bitmapText(30, 400, "EdoSZ", "BACK");
            // Register Event Handlers
            this.input.onTap.add(this.MenuOptionsSelected, this, 0, this.input.position);
        };
        /**
         * @description Handles "onTap" event. Will grow and shink planets when tapped. Also handles movement into the next gameplay state.
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        MainMenuState.prototype.MenuOptionsSelected = function (pos) {
            if (this.btn_Play.getBounds().contains(pos.x, pos.y)) {
                this.game.state.start("mapSelectState", true, false); // Jump to MapSelectState
            }
            else if (this.btn_Help.getBounds().contains(pos.x, pos.y)) {
                // Get Game Data from the selected planet
                this.game.state.start("helpScreenState", true, false); // Jump to the HelpScreenState
            }
            else if (this.btn_Music.getBounds().contains(pos.x, pos.y)) {
                if (this.counter % 2 == 0) {
                    this.counter += 1;
                    console.log("Clicked to turn off music");
                    console.log(this.counter);
                    alert("Under Construction...");
                }
                else {
                    this.counter += 1;
                    console.log("Clicked to turn on music");
                    console.log(this.counter);
                    alert("Under Construction...");
                }
            }
            else if (this.btn_Back.getBounds().contains(pos.x, pos.y)) {
                // This causes another instance of the song to play overtop of the existing instances/instance
                //this.game.state.start("titleScreenState"); // Jump to TitleScreenState
                alert("Under Construction...");
            }
        };
        return MainMenuState;
    }(Phaser.State));
    CosmicArkAdvanced.MainMenuState = MainMenuState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=MainMenuState.js.map