var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    // Yo yo yo this be ethan dawg!
    // TODO: Is supercollider still needed? Can IPhysics ready be gutted? How much of this code is dead now?
    /**
     * @Description The meat and potatoes of the game. This is where the actual "game" part lives.
     * @Property game {Phaser.Game}                         - The game context
     * @Property player {Phaser.Sprite}                     - The player object
     * @Property man1 {CosmicArkAdvanced.Man}               - Test Alien
     * @Property aliens {CosmicArkAdvance.IPhysicsReady[]}  - List of aliens in this scene that are capable of recieving physics calls
     * @Property dict {any[]}                               - A 2-keyed dictionary which maps 2 strings to a boolean value. Maps out physics collision states.
     * @Property gun1 {CosmicArkAdvanced.Gun}               - Test Gun
     * @Property mine1 {CosmicArkAdvanced.Mine}             - Test Mine
     * @Property hook1 {CosmicArkAdvanced.Hook}             - Test Hook
     * @Property uiText {Phaser.BitmapText}                 - Temp UI element for displaying score information
     * @Property btn_Pause {Phaser.BitmapText}              - Button to be used to pause
     * @Property uiText_Score {Phaser.BitmapText}           - Temp UI element for displaying the literal score information <edf>
     */
    var GamePlayState = (function (_super) {
        __extends(GamePlayState, _super);
        /**
         * @Description Mostly empty. Does initialize the aliens list and the dictionary.
         * @Constructor
         */
        function GamePlayState() {
            _super.call(this);
            //uiText_Score: Phaser.BitmapText;    // UI Text for updating the literal score information <edf>
            this.boo = false;
            this.aliens = [];
            this.guns = [];
            this.mines = [];
            this.hooks = [];
            this.dict = [];
        }
        GamePlayState.prototype.addMan = function (x, y) {
            if (x === void 0) { x = (-1); }
            if (y === void 0) { y = (this.game.world.height - 70); }
            // Establish a random position
            if (x == -1) {
                x = (Math.random() * 1472) + 64; // Creates a Range between 64 and (1600-64)
                while (Phaser.Math.difference(x, this.player.x) < 150) {
                    x = (Math.random() * 1472) + 64;
                }
            }
            // Create the alien
            var m = this.myBatch.create(x, y, "man");
            m.data = new CosmicArkAdvanced.AlienProperties(); // Holds additional info about the alien
            m.anchor.setTo(0.5, 1.0);
            m.data.initialY = y; // Save a copy of the initial y position in case it needs to be respawned
            // Calculate the speed and direction this alien will start with
            var spd = Math.floor(Math.random() * 35) + 40; // Creates a random integer between 40 and 80
            m.data.speed = spd;
            m.animations.add("walk", null, 12 * (spd / 60), true);
            m.animations.play("walk");
            spd = (Math.random() - 0.5 >= 0) ? -spd : spd; // Assign it to a random direction
            if (spd < 0) {
                m.scale.setTo(-1, 1);
            }
            ; // If the speed if now negative, flip the sprite visuals to match
            // Enable Physics and set physics attributes
            this.game.physics.enable(m, Phaser.Physics.ARCADE); // Activate physics
            m.body.setSize(Math.abs(m.width), m.height * 2, 0, m.height * -1); // Extend the collision box upwards so it can hit the ship
            // (m.body as Phaser.Physics.Arcade.Body).setSize(w, h, x, y);
            m.body.velocity.set(spd, 0); // Set the initial velocity to be it's speed with the random direction
            // TODO: Delete this debugging feature
            console.log(m.data.initialY);
        };
        /**
         * @Description Creates the game world by both creating and initializing all the objects in the game state.
         */
        GamePlayState.prototype.create = function () {
            // Use this for debugging to measure FPS
            this.game.time.advancedTiming = true;
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);
            // Set Physics settings
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Make the objects
            this.makeBackgrounds();
            this.makeMotherShip();
            this.player = new CosmicArkAdvanced.Player(this.game, 0, 0, "player");
            this.gun1 = new CosmicArkAdvanced.Gun(this.game, 150, this.game.world.height - 50, "gun", "gun1", this.player);
            this.guns.push(this.gun1);
            this.mine1 = new CosmicArkAdvanced.Mine(this.game, 200, 200, "mine1");
            this.mines.push(this.mine1);
            this.hook1 = new CosmicArkAdvanced.Hook(this.game, 400, this.game.world.height - 50, "gun", "hook1", this.player);
            this.hooks.push(this.hook1);
            // Aliens should always be created after the player so that they don't accidently render behind the tractor beam
            this.myBatch = this.game.add.spriteBatch(this.game.world); // Create the man sprite batch so they will all be rendered at once
            this.addMan(65);
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();
            // Set Camera settings
            this.game.camera.follow(this.player);
            // UI
            this.uiText = this.game.add.bitmapText(8, 0, "EdoSZ", "IN TRANSIT: " + this.player.aliensOnBoard.toString() +
                "\nCAPTURED: " + this.player.aliensCaptured.toString());
            this.uiText.fixedToCamera = true;
            //this.uiText_Score = this.game.add.bitmapText(650, 0, "EdoSZ", "Score: ");
            this.btn_Pause = this.add.bitmapText(700, 0, "EdoSZ", "PAUSE");
            this.btn_Pause.fixedToCamera = true;
            //this.uiText_Score.fixedToCamera = true;
            // Register Event Handlers
            this.input.onTap.add(this.PauseClicked, this, 0, this.input.position);
            // this.game.add.text(8, 18, "Captured: " + this.aliensCaptured.toString(), { font: '16pt Arial', fill: 'red' });
        };
        /**
         * @description Handles "onTap" event. Pauses the game
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        GamePlayState.prototype.PauseClicked = function (pos) {
            if (this.btn_Pause.getBounds().contains(pos.x, pos.y)) {
                if (this.boo == false) {
                    this.boo = true;
                    this.game.gamePaused(CosmicArkAdvanced.PauseMenuState);
                    // Make Buttons
                    //this.btn_Resume = this.add.bitmapText(40, 150, "EdoSZ", "RESUME GAME");
                    this.btn_Resume = this.add.bitmapText(this.game.width / 2, this.game.height / 2, "EdoSZ", "RESUME GAME");
                    this.btn_Resume.align = "center";
                    this.btn_Resume.anchor.setTo(0.5, 1);
                    this.btn_Resume.fixedToCamera = true;
                    //this.btn_Resume.align. = "center";
                    //this.btn_Restart = this.add.bitmapText(40, 200, "EdoSZ", "RESTART GAME");
                    this.btn_Restart = this.add.bitmapText(this.game.width / 2, (this.game.height / 2) + 50, "EdoSZ", "RESTART GAME");
                    this.btn_Restart.align = "center";
                    this.btn_Restart.anchor.setTo(0.5, 1);
                    this.btn_Restart.fixedToCamera = true;
                    //this.btn_Restart.align = "center";
                    //this.btn_ReturnToMenu = this.add.bitmapText(40, 250, "EdoSZ", "RETURN TO MENU (Under Construction)");
                    this.btn_ReturnToMenu = this.add.bitmapText(this.game.width / 2, (this.game.height / 2) + 100, "EdoSZ", "RETURN TO MENU (Under Construction)");
                    this.btn_ReturnToMenu.align = "center";
                    this.btn_ReturnToMenu.anchor.setTo(0.5, 1);
                    this.btn_ReturnToMenu.fixedToCamera = true;
                    //this.btn_ReturnToMenu.align = "center";
                    // Register Event Handlers
                    this.input.onTap.add(this.PauseOptionClicked, this, 0, this.input.position);
                }
                else {
                    this.boo = false;
                    this.btn_Resume.destroy();
                    this.btn_Restart.destroy();
                    this.btn_ReturnToMenu.destroy();
                    this.game.gameResumed(GamePlayState);
                }
            }
        };
        /**
         * @description Handles "onTap" event. Do a particular thing depending on the option selected
         * @param {Phaser.point} pos The x,y coordinates of where the user touched/clicked
         */
        GamePlayState.prototype.PauseOptionClicked = function (pos) {
            if (this.btn_Resume.getBounds().contains(pos.x, pos.y)) {
                this.boo = false;
                this.btn_Resume.destroy();
                this.btn_Restart.destroy();
                this.btn_ReturnToMenu.destroy();
                this.game.gameResumed(GamePlayState);
            }
            else if (this.btn_Restart.getBounds().contains(pos.x, pos.y)) {
                this.game.state.start("gamePlayState", true, false); // Jump to the GamePlayState
                this.btn_Resume.destroy();
                this.btn_Restart.destroy();
                this.btn_ReturnToMenu.destroy();
                this.game.gameResumed(GamePlayState);
            }
            else if (this.btn_ReturnToMenu.getBounds().contains(pos.x, pos.y)) {
                //alert("Under Construction...")
                this.game.gameResumed(CosmicArkAdvanced.MainMenuState);
                this.game.state.start("mainMenuState", true, false); // Jump to the MainMenuState
            }
        };
        /**
         * @Descirption Creates the mothership sprite and adjust it's properties accordingly.
         */
        GamePlayState.prototype.makeMotherShip = function () {
            this.mothership = this.game.add.sprite(0, 0, "mothership");
            this.mothership.scale.set(1, 1);
            // These numbers are largely abitrary. I did some trial and error and came up with these. -- Jake Gillenwater
            this.mothership.position.set(this.game.world.width / 2 - this.mothership.width / 2, (-this.mothership.height / 2) + 32);
            this.game.physics.enable(this.mothership, Phaser.Physics.ARCADE);
            this.mothership.body.setCircle(this.mothership.width * 0.75, this.mothership.width * -0.25, this.mothership.width * -1.18);
        };
        /**
         * @Description Adds the background images to the gamestate and scales them appropriately
         */
        GamePlayState.prototype.makeBackgrounds = function () {
            // let bd = new Phaser.Image(this.game, 0, this.game.world.height, "city1");
            this.game.add.image(0, 0, "city1");
        };
        /**
         * @Description Currently only used for checking collisions between objects
         */
        GamePlayState.prototype.update = function () {
            this.collideObjects(); // Check for collisions
            this.moveMen(); // Move the men along the bottom of the screen
            for (var n = 0; n < this.myBatch.hash.length; n++) {
                this.myBatch.hash[n].update();
            }
            this.uiText.text = "In Transit: " + this.player.aliensOnBoard.toString() +
                // "\tSCORE: " +
                "\nCaptured: " + this.player.aliensCaptured.toString();
            //this.uiText_Score.text = "Score: ";
            //this.btn_Pause = this.add.bitmapText(650, 0, "EdoSZ", "PAUSE");
            //this.btn_Pause.fixedToCamera = true;
        };
        /**
         * @Description Called ever frame through the update method. Place collision checks here.
         */
        GamePlayState.prototype.collideObjects = function () {
            // Collide the player's ship with the gun's bullets
            for (var n = 0; n < this.guns.length; n++) {
                for (var i = 0; i < this.guns[n].bullets.bullets.length; i++) {
                    if (!this.player.isHooked && this.game.physics.arcade.overlap(this.player, this.guns[n].bullets.bullets.getAt(i))) {
                        var b = this.guns[n].bullets.bullets.getAt(i);
                        b.kill();
                        console.log("OUCH!!!!!");
                    }
                }
            }
            // Collide the player's ship with the hooks
            for (var n = 0; n < this.hooks.length; n++) {
                for (var i = 0; i <= this.hooks[n].wep.bullets.length; i++) {
                    if (this.game.physics.arcade.overlap(this.player, this.hooks[n].wep.bullets.getAt(i))) {
                        var b = this.hooks[n].wep.bullets.getAt(i);
                        this.hooks[n].targetHooked();
                    }
                }
            }
            // Collide the player's ship with the aliens
            var atLeastOne = false; // Flag meaning "At least one alien is availble to be abducted"
            this.myBatch.forEachAlive(function (alien) {
                // TODO: Bugfix: Fix it so that the ship cannot abduct an alien if the ship is too low
                if (this.game.physics.arcade.overlap(this.player, alien)) {
                    atLeastOne = true;
                    this.player.Abduct(alien);
                }
            }, this);
            if (!atLeastOne) {
                this.player.animations.frame = 0; // TODO: Fix this so it doesn't laugh in the face of every OOP practice I've learned over the years
            }
            // Collide the player's ship with the mines
            for (var n = 0; n < this.mines.length; n++) {
                if (this.game.physics.arcade.overlap(this.player, this.mines[n])) {
                    var spt = this.game.add.sprite(0, 0, "bang");
                    spt.scale.set(1.35, 1.35);
                    spt.position.setTo(this.mines[n].x - spt.width / 2, this.mines[n].y - spt.height / 2);
                    spt.animations.add("bang_anim", null, 20, false);
                    spt.animations.play("bang_anim", null, false, true);
                    this.mines[n].destroy(true);
                }
            }
            // Collide the player's ship with the mothership
            if (this.game.physics.arcade.overlap(this.player, this.mothership)) {
                this.player.Capture();
            }
        };
        /**
         * @Description Helper function which cycles through the sprite batch of men along the bottom the screen and applies logic into how they should move.
         */
        GamePlayState.prototype.moveMen = function () {
            this.myBatch.forEach(function (alien) {
                if (alien.x > this.game.world.width - Math.abs(alien.width)) {
                    alien.body.velocity.setTo(-alien.data.speed, 0);
                    alien.scale.set(-1, 1);
                }
                else if (alien.x < Math.abs(alien.width)) {
                    alien.body.velocity.setTo(alien.data.speed, 0);
                    alien.scale.set(1, 1);
                }
            }, this);
        };
        /**
         * @Description This is the super in-depth version of collision checking I (Jake) created. Checks for collisions between two objects and triggers the appropriate events on the object.
         * @Param obj1  The first object to check collision against
         * @Param obj2  The second object to check collision against
         */
        GamePlayState.prototype.superCollider = function (obj1, obj2) {
            if (this.game.physics.arcade.collide(obj1, obj2, this.OnCollisionCaller, this.OnCollisionProposalCaller)) {
                // if there is a collision
                try {
                    if (this.dict[obj1.name, obj2.name] == false) {
                        this.OnCollisionEnterCaller(obj1, obj2); // then tell the objects a collision has started
                    }
                    this.dict[obj1.name, obj2.name] = true; // and mark this collision as new
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false; // If there was an exception, 
                }
            }
            else {
                try {
                    if (this.dict[obj1.name, obj2.name] == true) {
                        this.OnCollisionExitCaller(obj1, obj2); // then tell the objects the collision is over
                    }
                    this.dict[obj1.name, obj2.name] = false; // and mark this collision as old
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false; // If there was an exception, 
                }
            }
        };
        /**
         * @Descirption Calls the OnCollisionProposal events on both objects, and return their answer. Both objects must accept the proposal before continueing.
         * @Param obj1
         * @Param obj2
         */
        GamePlayState.prototype.OnCollisionProposalCaller = function (obj1, obj2) {
            return (obj1.OnCollisionProposal(obj2) && obj2.OnCollisionProposal(obj1));
        };
        /**
         * @Descirption Calls the OnCollisionEnter events on both objects
         * @Param obj1
         * @Param obj2
         */
        GamePlayState.prototype.OnCollisionEnterCaller = function (obj1, obj2) {
            obj1.OnCollisionEnter(obj2);
            obj2.OnCollisionEnter(obj1);
        };
        /**
         * @Description Calls the OnCollision events on both objects
         * @Param obj1
         * @Param obj2
         */
        GamePlayState.prototype.OnCollisionCaller = function (obj1, obj2) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        };
        /**
         * @Description Calls the OnCollisionExit events on both objects
         * @Param obj1
         * @Param obj2
         */
        GamePlayState.prototype.OnCollisionExitCaller = function (obj1, obj2) {
            obj1.OnCollisionExit(obj2);
            obj2.OnCollisionExit(obj1);
        };
        /**
         * @Description Post rendering effects.
         */
        GamePlayState.prototype.render = function () {
            // Debug features...
            // this.game.debug.body(this.player);
            // this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
            // this.gun1.bullets.debug();
            // this.game.debug.body(this.mine1);
            // this.game.debug.ropeSegments(this.hook1.rope);
            // this.game.debug.body(this.mothership);
            this.game.debug.text(this.game.time.fps.toString(), 8, 80);
            //this.game.debug.body(this.myBatch.getFirstExists(true));
        };
        return GamePlayState;
    }(Phaser.State));
    CosmicArkAdvanced.GamePlayState = GamePlayState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=GamePlayState.js.map