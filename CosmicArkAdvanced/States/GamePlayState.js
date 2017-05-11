var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
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
     * @property hook1 {CosmicArkAdvanced.Hook}             - Test Hook
     */
    var GamePlayState = (function (_super) {
        __extends(GamePlayState, _super);
        /**
         * @description Mostly empty. Does initialize the aliens list and the dictionary.
         * @constructor
         */
        function GamePlayState() {
            _super.call(this);
            this.aliens = [];
            this.guns = [];
            this.mines = [];
            this.hooks = [];
            this.dict = [];
        }
        /**
         * @description Creates the game world by both creating and initializing all the objects in the game state.
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
            this.man1 = new CosmicArkAdvanced.Man(this.game, 50, this.game.world.height - 50, "man1"); // eventually, this creation should be in a loop. Don't forget to make the name unique!
            this.aliens.push(this.man1); // Man one is a test case, in reality, these would be made inside of a for loop.
            // Set Camera settings
            this.game.camera.follow(this.player);
            // UI
            this.uiText = this.game.add.text(8, 0, "In Transit: " + this.player.aliensOnBoard.toString() +
                "\nCaptured: " + this.player.aliensCaptured.toString(), { font: '16pt Arial', fill: 'red' });
            this.uiText.fixedToCamera = true;
            //this.game.add.text(8, 18, "Captured: " + this.aliensCaptured.toString(), { font: '16pt Arial', fill: 'red' });
        };
        /**
         * @descirption Creates the mothership sprite and adjust it's properties accordingly.
         */
        GamePlayState.prototype.makeMotherShip = function () {
            this.mothership = this.game.add.sprite(0, 0, "mothership");
            this.mothership.scale.set(1, 1);
            this.mothership.position.set(this.game.world.width / 2 - this.mothership.width / 2, -this.mothership.height / 2);
            this.game.physics.enable(this.mothership, Phaser.Physics.ARCADE);
            this.mothership.body.setCircle(this.mothership.width * 0.75, this.mothership.width * -0.25, this.mothership.width * -1.15);
        };
        /**
         * @description Adds the background images to the gamestate and scales them appropriately
         */
        GamePlayState.prototype.makeBackgrounds = function () {
            //let bd = new Phaser.Image(this.game, 0, this.game.world.height, "city1");
            this.game.add.image(0, 0, "city1");
            // Old Background Images
            /*
            let bd1 = new Phaser.Image(this.game, 0, 0, "nightSky");                                // Sky
            let bd2 = new Phaser.Image(this.game,0, this.game.world.height, "city");                   // Left-half of city
            let bd3 = new Phaser.Image(this.game, this.game.width, this.game.world.height, "city");     // Right-half of city

            // Set scaling
            bd1.scale.setTo(this.game.world.width / bd1.width, this.game.world.height / bd1.height);  // Scale it to fit the size of the screen
            bd2.anchor.setTo(0, 1);
            bd2.scale.setTo(this.game.width / bd2.width, this.game.height / bd2.height);        // Scale it to fit the size of the screen
            bd3.anchor.setTo(0, 1);
            bd3.scale.setTo(this.game.width / bd3.width, this.game.height / bd3.height);  // Scale it to fit the size of the screen

            // Adding these to a group before the game state makes the render just a little bit faster
            // Only ~1% at time of writing, but it is important to use this technique where possible
            // becuase later implementations could produce more significant results
            // See this link for details: https://phaser.io/tutorials/advanced-rendering-tutorial/part2
            let grp = this.game.add.group();
            grp.addMultiple([bd1, bd2, bd3]);
            */
        };
        /**
         * @Description Currently only used for checking collisions between objects
         */
        GamePlayState.prototype.update = function () {
            this.collideObjects();
            this.uiText.text = "In Transit: " + this.player.aliensOnBoard.toString() +
                "\nCaptured: " + this.player.aliensCaptured.toString();
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
            for (var i = 0; i < this.aliens.length; i++) {
                var alien = this.aliens[i];
                // TODO: Bugfix: Fix it so that the ship cannot abduct an alien if the ship is too low
                // TODO: Changing animation shouldn't happen here, bad OOP practice. Move it to the OnCollision inside of player instead
                if (this.game.physics.arcade.overlap(this.player, alien)) {
                    if (this.player.isAbudcting) {
                        this.player.animations.frame = 0;
                    }
                    else {
                        this.player.animations.frame = 1;
                    }
                    this.player.Abduct(alien);
                }
                else {
                    this.player.animations.frame = 0;
                }
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
         * @description This is the super in-depth version of collision checking I (Jake) created. Checks for collisions between two objects and triggers the appropriate events on the object.
         * @param obj1  The first object to check collision against
         * @param obj2  The second object to check collision against
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
         * @descirption Calls the OnCollisionProposal events on both objects, and return their answer. Both objects must accept the proposal before continueing.
         * @param obj1
         * @param obj2
         */
        GamePlayState.prototype.OnCollisionProposalCaller = function (obj1, obj2) {
            return (obj1.OnCollisionProposal(obj2) && obj2.OnCollisionProposal(obj1));
        };
        /**
         * @descirption Calls the OnCollisionEnter events on both objects
         * @param obj1
         * @param obj2
         */
        GamePlayState.prototype.OnCollisionEnterCaller = function (obj1, obj2) {
            obj1.OnCollisionEnter(obj2);
            obj2.OnCollisionEnter(obj1);
        };
        /**
         * @description Calls the OnCollision events on both objects
         * @param obj1
         * @param obj2
         */
        GamePlayState.prototype.OnCollisionCaller = function (obj1, obj2) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        };
        /**
         * @description Calls the OnCollisionExit events on both objects
         * @param obj1
         * @param obj2
         */
        GamePlayState.prototype.OnCollisionExitCaller = function (obj1, obj2) {
            obj1.OnCollisionExit(obj2);
            obj2.OnCollisionExit(obj1);
        };
        /**
         * @description Post rendering effects.
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
        };
        return GamePlayState;
    }(Phaser.State));
    CosmicArkAdvanced.GamePlayState = GamePlayState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=GamePlayState.js.map