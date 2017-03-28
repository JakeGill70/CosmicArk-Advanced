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
     * @Property backdrop1 {Phaser.Image}                   - The night sky
     * @Property backdrop2 {Phaser.Image}                   - Left half of the city
     * @Property backdrop2_2 {Phaser.Image}                 - Right half of the city
     * @Property player {Phaser.Sprite}                     - The player object
     * @Property beam {Phaser.Graphics}                     - The player's "tractor beam"
     * @Property bMask {Phaser.Graphics}                    - The bitmask used to selectively hide parts of the alien being abducted
     * @Property man1 {CosmicArkAdvanced.Man}               - Test Alien
     * @Property aliens {CosmicArkAdvance.IPhysicsReady[]}  - List of aliens in this scene that are capable of recieving physics calls
     * @Property dict {any[]}                               - A 2-keyed dictionary which maps 2 strings to a boolean value. Maps out physics collision states.
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
            this.dict = [];
        }
        /**
         * @description Creates the game world by both creating and initializing all the objects in the game state.
         */
        GamePlayState.prototype.create = function () {
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);
            // Make the objects
            this.backdrop1 = new Phaser.Image(this.game, 0, 0, "nightSky");
            this.backdrop2 = new Phaser.Image(this.game, 0, this.game.world.height, "city");
            this.backdrop2_2 = new Phaser.Image(this.game, this.game.width, this.game.world.height, "city");
            this.beam = new Phaser.Graphics(this.game);
            this.bMask = new Phaser.Graphics(this.game);
            this.player = new CosmicArkAdvanced.Player(this.game, 0, 0, "player", this.beam, this.bMask);
            this.man1 = new CosmicArkAdvanced.Man(this.game, 50, this.game.world.height - 50, "man1"); // eventually, this creation should be in a loop. Don't forget to make the name unique!
            //let wep = this.game.add.weapon(10, "bullet");
            this.gun1 = new CosmicArkAdvanced.Gun(this.game, 150, this.game.world.height - 50, "gun", "gun1");
            // Make adjustments to objects
            this.backdrop1.scale.setTo(this.game.world.width / this.backdrop1.width, this.game.world.height / this.backdrop1.height); // Scale it to fit the size of the screen
            this.backdrop2.anchor.setTo(0, 1);
            this.backdrop2_2.anchor.setTo(0, 1);
            this.backdrop2.scale.setTo(this.game.width / this.backdrop2.width, this.game.height / this.backdrop2.height); // Scale it to fit the size of the screen
            this.backdrop2_2.scale.setTo(this.game.width / this.backdrop2_2.width, this.game.height / this.backdrop2_2.height); // Scale it to fit the size of the screen
            this.gun1.target = this.player;
            // Add them into the state
            this.game.add.existing(this.backdrop1);
            this.game.add.existing(this.backdrop2);
            this.game.add.existing(this.backdrop2_2);
            this.game.add.existing(this.beam);
            this.game.add.existing(this.bMask);
            this.game.add.existing(this.man1);
            this.game.add.existing(this.player);
            this.game.add.existing(this.gun1);
            // Set Camera settings
            this.game.camera.follow(this.player);
            // Set Physics settings
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Turn on physics for the required objects
            this.game.physics.enable(this.man1, Phaser.Physics.ARCADE);
            this.aliens.push(this.man1); // Man one is a test case, in reality, these would be made inside of a for loop.
            var offset = 75; // Offset is how much extra height should be added the alien's collider so the ship will collide at altitude
            this.man1.body.setSize(this.man1.width, this.man1.height + offset, 0, -offset);
            this.gun1.create(this.player, 375);
        };
        // TODO: Move the collision stuff from the update function into it's own method, maybe two, idk at the moment. 
        /**
         * @Description Currently only used for checking collisions between object
         */
        GamePlayState.prototype.update = function () {
            for (var i = 0; i < this.gun1.bullets.bullets.length; i++) {
                if (this.game.physics.arcade.collide(this.player, this.gun1.bullets.bullets.getAt(i))) {
                    var b = this.gun1.bullets.bullets.getAt(i);
                    b.kill();
                    console.log("OUCH!!!!!");
                }
            }
            for (var i = 0; i < this.aliens.length; i++) {
                var alien = this.aliens[i];
                //this.superCollider(this.player, alien); // Original
                // TODO: Changing animation shouldn't happen here, bad OOP practice
                if (this.game.physics.arcade.collide(this.player, alien)) {
                    if (!this.player.isAbudcting) {
                        this.player.animations.frame = 1;
                    }
                    else {
                        this.player.animations.frame = 0;
                    }
                    this.player.Abduct(alien);
                }
                else {
                    this.player.animations.frame = 0;
                }
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
            // Debug feature...
            //this.game.debug.body(this.player);
            //this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
            this.gun1.bullets.debug();
        };
        return GamePlayState;
    })(Phaser.State);
    CosmicArkAdvanced.GamePlayState = GamePlayState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=GamePlayState.js.map