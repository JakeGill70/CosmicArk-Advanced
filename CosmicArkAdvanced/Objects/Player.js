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
     * @description Main player class which handles all major functions of the ship.
     * @property game {Phaser.game}                  - The game context
     * @property cursor {Phaser.game}                - Arrow Key Input
     * @property beam {Phaser.graphics}              - Used to draw the "tractor beam"
     * @property beamDrawHeight {number}             - Original y-coordinate of the alien being abducted. This is used to root the tractor beam at the bottom of where the alien was standing.
     * @property moveDistThreshold {number}          - How far away the touch must be before moving towards it
     * @property moveSpeed {number}                  - How fast the ship moves across the screen
     * @property abductionSpeed {number}             - How fast the ship can abduct a normal alien
     * @property alienAbductee {number}              - Reference to the alien currently being abducted
     * @property tag {CosmicArkAdvanced.PhysicsTag}  - Used to help weed out possible collisions
     * @property isAbudcting {boolean}               - Flag for if the player should be abducting someone right now
     * @property isMoving {boolean}                  - Flag for if the user is moving the ship right now
     * @property isHooked {boolean}                  - Flag for if the player is captured by a hook bullet/turret right now.
     * @property hookedVelocity {Phaser.Point}       - X and Y velocity the ship should have while isHooked is set
     */
    var Player = (function (_super) {
        __extends(Player, _super);
        /**
         * @description Constructor for the player's ship
         * @constructor
         * @param _game Context of the main game window
         * @param _x Starting world X coordinate
         * @param _y Starting world Y coordinate
         * @param _name Unique identifer for this object
         * @param _beam Context of the Phaser.Graphics object which handles rendering the "tractor beam"
         */
        function Player(_game, _x, _y, _name) {
            var _this = _super.call(this, _game, _x, _y, "ship") || this;
            _this.maxHeight = 400; // Max height is the highest the y value can be. 
            _this.game = _game; // get game context
            _this.name = _name; // Set the objects unique name
            _this.aliensOnBoard = 0; // Reset score counters
            _this.aliensCaptured = 0;
            _this.beam = _this.game.add.graphics(0, 0); // Create and add the beam to the gamestate
            _this.beamMask = _this.game.add.graphics(0, 0); // Create and add the beam's bit mask to the gamestate
            _this.beamMask.renderable = false;
            _this.game.add.existing(_this); // Add this object to the gamestate. We have to add it last so that it will render on top of the beam
            _this.moveSpeed = 15; // Set current walking speed
            _this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen
            _this.tag = CosmicArkAdvanced.PhysicsTag.PLAYER; // Physics tag to determine how other sections of code should interact with it.
            _this.isAbudcting = false; // is the player abduction someone right now?
            _this.abductionSpeed = 70; // Set the speed which aliens are abducted at. (px / sec)
            _this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center
            _this.animations.add("flash", [0, 1], 5, true); // Add the animation which makes the ship glow
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE); // Enable physics for the ship
            _this.body.collideWorldBounds = true; // Automatically lock the players sprite into the world so they cannot move off screen.
            _this.cursor = _this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
            _this.wasd = {
                up: _this.game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: _this.game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: _this.game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: _this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            };
            _this.abductionSound = _this.game.add.sound("abduction", 0.06 * _this.game.music.volume, true);
            return _this;
        }
        /**
         * @description Called every frame. Handles moving the player and sets the "isMoving" flag.
         * Also, if abducting, will LERP the abductee's x-coordinate to match the player's.
         */
        Player.prototype.update = function () {
            this.body.velocity = new Phaser.Point(0, 0);
            this.isMoving = false; // Turn this flag off. Movement will turn it back on if needed.
            // If hooked, move with the hook instead of taking input
            if (!this.isHooked) {
                this.arrowKeyMovement();
                this.touchMovement();
            }
            else {
                this.isMoving = true;
                this.body.velocity = this.hookedVelocity;
            }
            if (this.body.y > 400) {
                this.body.velocity = new Phaser.Point(0, 0);
                this.body.y = 400;
            }
            if (this.isMoving) {
                this.stopAbducting(false);
            }
            if (this.isAbudcting) {
                if (this.alienAbductee.x !== this.x) {
                    this.alienAbductee.x = Phaser.Math.bezierInterpolation([this.alienAbductee.x, this.x], 0.085); // 0.085 felt like a good speed. No significant meaning.
                }
            }
        };
        /**
         * @description Setter for hooked Velocity and sets the isHooked flag. This is called when colliding with the end of a hook.
         * The ship and the hook must move at the same time, angle, and speed to make it look like the hook is pulling the ship.
         * @param vel The new velocity of the hook.
         */
        Player.prototype.hookShip = function (vel) {
            this.isHooked = true;
            this.hookedVelocity = vel;
        };
        /**
         * @description moves the ship's position according to touch/mouse input.
         */
        Player.prototype.touchMovement = function () {
            var pos = new Phaser.Point(this.game.input.worldX, this.game.input.worldY);
            var ang = Phaser.Math.angleBetweenPoints(this.position, pos);
            var moveAmtX = this.realSpeed() * Math.cos(ang);
            var moveAmtY = this.realSpeed() * Math.sin(ang);
            if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {
                if (Phaser.Point.distance(this.position, pos) > this.moveDistThreshold) {
                    // Move along the X-axis
                    if (Phaser.Math.difference(this.position.x, pos.x) > this.moveDistThreshold) {
                        this.body.x += moveAmtX;
                        // Stop abducting when moving
                        this.isMoving = true;
                    }
                    // Move along the Y-Axis
                    if (Phaser.Math.difference(this.position.y, pos.y) > this.moveDistThreshold) {
                        this.body.y += moveAmtY;
                        // Stop abducting when moving
                        this.isMoving = true;
                    }
                }
            }
        };
        /**
         * @description moves the ship according to array key input
         */
        Player.prototype.arrowKeyMovement = function () {
            // Make it so that if the ship is moving diagonally, both speeds are multiplied by 0.707, aka sin(45)
            // This keeps the ship from moving too fast when diagonal. For more, look up "vector addition".
            var isDiagonal = ((this.cursor.right.isDown || this.cursor.left.isDown) && (this.cursor.up.isDown || this.cursor.down.isDown));
            // Horizontal movement
            if (this.cursor.right.isDown == true || this.wasd.right.isDown) {
                this.body.x += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
            else if (this.cursor.left.isDown == true || this.wasd.left.isDown) {
                this.body.x -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
            // Vertical movement
            if (this.cursor.up.isDown == true || this.wasd.up.isDown) {
                this.body.y -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
            else if (this.cursor.down.isDown == true || this.wasd.down.isDown) {
                this.body.y += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
        };
        /**
         * @description Provides a variable time multiplier based on the framerate instead of the ms passed.
         * @returns a number, roughly representing the time spent per frame
         */
        Player.prototype.getDeltaTime = function () {
            return (this.game.time.elapsedMS / 60);
        };
        /**
         * @description takes the ship's nice integer value movespeed and multiplies it by delta time.
         * @returns a number representing the movespeed of the ship over time
         */
        Player.prototype.realSpeed = function () {
            return (this.moveSpeed * this.getDeltaTime());
        };
        /**
         * @Descirption Handles what should happen the imediate frame after a collision first occurs.
         * @param other The object the player's ship collided with
         */
        Player.prototype.OnCollisionEnter = function (other) {
            if (other.tag == CosmicArkAdvanced.PhysicsTag.ALIEN) {
                this.Abduct(other);
            }
        };
        /**
         * @description Handles what should happen the exact frame a collision occurs. Answers the question "Do I want procede with this collision?"
         * @param other The object the player's ship collided with
         * @returns {boolean} Should the player's ship accept the collision, or act like nothing happened?
         */
        Player.prototype.OnCollisionProposal = function (other) {
            return true; // We want to accept the collision by default
        };
        /**
         * @descirption Handles what should happen for EVERY FRAME of a collision EXCEPT for the first, which is only handled by OnCollisionProposal.
         * @see {this.OnCollisionProposal}
         * @param other The object the player's ship collided with
         */
        Player.prototype.OnCollision = function (other) {
        };
        /**
         * @Descirption Handles what should happen the imediate frame after a collision stops occurring.
         * @param other The object the player's ship collided with
         */
        Player.prototype.OnCollisionExit = function (other) {
            this.stopAbducting(false);
        };
        /**
         * @description Clears the alienAbductee property, and isAbducting flag. Also destroys any graphical artifacts associated with the "tractor beam".
         * @param caught Set to true if the abduction is stopping because you caught the alien. Set to false if it got away or you moved
         */
        Player.prototype.stopAbducting = function (caught) {
            if (this.alienAbductee != null) {
                if (caught) {
                    this.alienAbductee.kill(); // If caught by the player's ship, "destroy" it
                    console.log("I died");
                }
                var ab = this.alienAbductee.body; // Get a copy of it's physics body
                ab.velocity = new Phaser.Point(this.alienAbductee.data.speed * this.alienAbductee.scale.x, 0); // Reset it's speed
                this.alienAbductee.position = new Phaser.Point(this.alienAbductee.x, Math.abs(this.alienAbductee.data.initialY)); // Reset it's y-coordinate
                this.alienAbductee.mask = null; // Clear it's render mask
                this.alienAbductee = null; // Clear it from it's abducting duties ;)
            }
            this.abductionSound.stop(); // Stop the annoying noise
            this.isAbudcting = false;
            this.beam.clear(); // Destroy any graphic's artifacts of the beam
            this.beamMask.clear(); // Destroy any graphic's artifacts of the beam's mask. This shouldn't make a difference since the mask isn't technically rendered, but do it anyway just in case of weirdness.
        };
        /**
         * @Description Should be called when colliding with the mothership.
         * This method resets the "In Transit" score to 0, and increases the "Captured" score appropriately
         */
        Player.prototype.Capture = function () {
            this.aliensCaptured += this.aliensOnBoard;
            this.aliensOnBoard = 0;
        };
        /**
         * @description Will exit imediately if the isMoving flag is set. Begins drawing the Tractor beam. Sets the isAbducting flag and the alienAbductee property.
         * @param a The alien the player will begin abducting
         */
        Player.prototype.Abduct = function (a) {
            // Only abduct 1 alien at a time
            if (this.alienAbductee != null && this.alienAbductee != a) {
                return;
            }
            if (!this.abductionSound.isPlaying) {
                this.abductionSound.play();
            }
            if (this.isMoving) {
                this.animations.frame = 1; // Turn on the blue glow
                this.stopAbducting(false); // If the player is moving, we can't continue abducting
                return; // If the player is moving, just go ahead and kick out of this.
            }
            this.animations.frame = 0; // If we haven't returned yet, then we "have a live one". Turn off the ufo glow
            // If the abductee is null (meaning we just hit with them) Calculate the height the "tractor" beam needs to be.
            if (this.alienAbductee == null) {
                this.beamDrawHeight = a.worldPosition.y - this.worldPosition.y + this.body.height / 2;
            }
            // If the alienAbductee exists, we must be in the middle of abducting something
            if (this.alienAbductee != null) {
                // If that alien is now higher than the tractor beam, that alien should be considered captured.
                if (this.alienAbductee.worldPosition.y <= this.worldPosition.y) {
                    this.aliensOnBoard++;
                    this.stopAbducting(true); // Tell the alien we have stopped abducting him
                    return;
                }
            }
            this.alienAbductee = a; // Set the alien abductee property equal to the alien the ship collided with
            // TODO: Tell the alien that we have started to abduct it so that it can make changes to it's behaviour too
            var ab = this.alienAbductee.body;
            ab.velocity = new Phaser.Point(0, this.abductionSpeed * -1);
            this.alienAbductee.mask = this.beamMask; // Set the alien's mask equal to the beam's bitmask
            this.isAbudcting = true; // Set the isAbducting flag
            this.renderBeam(); // Show the beam
        };
        /**
         * @description Draws the beam according to "beamDrawHeight" property
         */
        Player.prototype.renderBeam = function () {
            this.beam.clear(); // Destroy the beam from the previous frame
            this.beamMask.clear(); // Destroy the beam Mask from the previous frame
            // this.beam.x = this.x;
            // this.beam.y = this.y;
            // Pick a random color, favoriting blue, with the ranges like so:
            // r: 0-45          g: 75-150           b: 155-255
            var color = Phaser.Color.getColor(Math.random() * 45, Math.random() * 75 + 75, Math.random() * 100 + 155);
            // beamDrawHeight is calculated OnCollisionEnter()
            var rect = new Phaser.Rectangle(this.x - (this.body.width / 2) + 2, this.y - (this.body.height / 2), this.body.width - 4, this.beamDrawHeight);
            this.beam.lineStyle(1, color, 0.75);
            this.beam.beginFill(color, 0.8);
            this.beam.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.beam.endFill();
            var maskRect = new Phaser.Rectangle(this.x - (this.body.width * 2), this.y - (this.body.height / 10), this.body.width * 4, this.beamDrawHeight); // These values are pretty much just eyeballed. 
            this.beamMask.beginFill(0xFFFFFF);
            this.beamMask.drawRect(maskRect.x, maskRect.y, maskRect.width, maskRect.height);
            this.beamMask.endFill();
        };
        return Player;
    }(Phaser.Sprite));
    CosmicArkAdvanced.Player = Player;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Player.js.map