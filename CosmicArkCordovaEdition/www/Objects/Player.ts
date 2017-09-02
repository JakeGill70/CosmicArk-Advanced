﻿module CosmicArkAdvanced {

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
    export class Player extends Phaser.Sprite implements IPhysicsReady {
        game: Phaser.Game;              // Game Context
        cursor: Phaser.CursorKeys;      // Arrow Key input
        beam: Phaser.Graphics;      // Used to draw the 'tractor beam'
        beamMask: Phaser.Graphics;
        beamDrawHeight: number;         // Original y-coordinate of the alien being abducted. 
                                        // This is used to root the tractor beam at the bottom of where the alien was standing.
        moveDistThreshold: number;      // How far away the touch must be before moving towards it
        moveSpeed: number;              // How fast the ship moves across the screen
        abductionSpeed: number;         // How fast the ship can abduct a normal alien
        alienAbductee: Phaser.Sprite;             // Reference to the alien currently being abducted
        tag: PhysicsTag;                // Used to help weed out possible collisions
        isAbudcting: boolean;           // Flag for if the player should be abducting someone right now
        isMoving: boolean;              // Flag for if the user is moving the ship right now
        isHooked: boolean;              // Flag for if the player is captured by a hook bullet/turret right now.
        hookedVelocity: Phaser.Point    // X and Y velocity the ship should have while isHooked is set

        aliensOnBoard: number;              // Number of aliens captured, but not yet returned to the mothership
        aliensCaptured: number;             // Number of aliens captured, AND returned to the mothership

        maxHeight: number = 400;      // Max height is the highest the y value can be. 
                                    // This translates to the lowests point the player can go on the screen. 
                                    // So it can also be thought of as the min height for the player, and still be correct.

        abductionSound: Phaser.Sound;

        wasd;

        /**
         * @description Constructor for the player's ship
         * @constructor
         * @param _game Context of the main game window
         * @param _x Starting world X coordinate
         * @param _y Starting world Y coordinate
         * @param _name Unique identifer for this object
         * @param _beam Context of the Phaser.Graphics object which handles rendering the "tractor beam"
         */
        constructor(_game: Phaser.Game, _x: number, _y: number, _name: string) {
            super(_game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game
            this.game = _game;                      // get game context
            this.name = _name;                      // Set the objects unique name

            this.aliensOnBoard = 0;       // Reset score counters
            this.aliensCaptured = 0;           

            this.beam = this.game.add.graphics(0, 0);           // Create and add the beam to the gamestate
            this.beamMask = this.game.add.graphics(0, 0);     // Create and add the beam's bit mask to the gamestate
            this.beamMask.renderable = false;
      
            this.game.add.existing(this);           // Add this object to the gamestate. We have to add it last so that it will render on top of the beam

            this.moveSpeed = 15; // Set current walking speed

            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen

            this.tag = PhysicsTag.PLAYER; // Physics tag to determine how other sections of code should interact with it.

            this.isAbudcting = false;   // is the player abduction someone right now?

            this.abductionSpeed = 70;   // Set the speed which aliens are abducted at. (px / sec)

            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center

            this.animations.add("flash",[0,1],5,true);      // Add the animation which makes the ship glow

            this.game.physics.enable(this, Phaser.Physics.ARCADE);      // Enable physics for the ship

            this.body.collideWorldBounds = true;     // Automatically lock the players sprite into the world so they cannot move off screen.

            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"

            this.wasd = {
                up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            };

            this.abductionSound = this.game.add.sound("abduction", 0.06 * this.game.music.volume, true);
        }

        /**
         * @description Called every frame. Handles moving the player and sets the "isMoving" flag. 
         * Also, if abducting, will LERP the abductee's x-coordinate to match the player's.
         */
        update() {
            this.body.velocity = new Phaser.Point(0, 0);
            this.isMoving = false;  // Turn this flag off. Movement will turn it back on if needed.

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

            if (this.isMoving) {    // If the flag was set after moving, stop abducting
                this.stopAbducting(false);
            }


            if (this.isAbudcting) {
                if (this.alienAbductee.x !== this.x) {
                    this.alienAbductee.x = Phaser.Math.bezierInterpolation([this.alienAbductee.x, this.x], 0.085);  // 0.085 felt like a good speed. No significant meaning.
                }
            }
        }

        /**
         * @description Setter for hooked Velocity and sets the isHooked flag. This is called when colliding with the end of a hook.
         * The ship and the hook must move at the same time, angle, and speed to make it look like the hook is pulling the ship.
         * @param vel The new velocity of the hook.
         */
        public hookShip(vel:Phaser.Point) {
            this.isHooked = true;
            this.hookedVelocity = vel;
        }

        /**
         * @description moves the ship's position according to touch/mouse input.
         */
        touchMovement() {
            let pos = new Phaser.Point(this.game.input.worldX, this.game.input.worldY);
            let ang = Phaser.Math.angleBetweenPoints(this.position, pos);
            let moveAmtX = this.realSpeed() * Math.cos(ang);
            let moveAmtY = this.realSpeed() * Math.sin(ang);

            if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {   // If touching the screen
                if (Phaser.Point.distance(this.position, pos) > this.moveDistThreshold) {    // And the touch if far enough away
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
        }

        /**
         * @description moves the ship according to array key input
         */
        arrowKeyMovement() {
            // Make it so that if the ship is moving diagonally, both speeds are multiplied by 0.707, aka sin(45)
            // This keeps the ship from moving too fast when diagonal. For more, look up "vector addition".
            let isDiagonal = ((this.cursor.right.isDown || this.cursor.left.isDown) && (this.cursor.up.isDown || this.cursor.down.isDown));

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
        }

        /**
         * @description Provides a variable time multiplier based on the framerate instead of the ms passed.
         * @returns a number, roughly representing the time spent per frame
         */
        getDeltaTime() {
            return (this.game.time.elapsedMS / 60);
        }

        /**
         * @description takes the ship's nice integer value movespeed and multiplies it by delta time.
         * @returns a number representing the movespeed of the ship over time
         */
        realSpeed() {
            return (this.moveSpeed * this.getDeltaTime());
        }

        /**
         * @Descirption Handles what should happen the imediate frame after a collision first occurs.
         * @param other The object the player's ship collided with
         */
        OnCollisionEnter(other: IPhysicsReady) {
            if (other.tag == PhysicsTag.ALIEN) {
                this.Abduct(other as Man);
            }
        }

        /**
         * @description Handles what should happen the exact frame a collision occurs. Answers the question "Do I want procede with this collision?"
         * @param other The object the player's ship collided with
         * @returns {boolean} Should the player's ship accept the collision, or act like nothing happened?
         */
        OnCollisionProposal(other: IPhysicsReady) {
            return true; // We want to accept the collision by default
        }

        /**
         * @descirption Handles what should happen for EVERY FRAME of a collision EXCEPT for the first, which is only handled by OnCollisionProposal.
         * @see {this.OnCollisionProposal}
         * @param other The object the player's ship collided with
         */
        OnCollision(other: IPhysicsReady) {
        }

        /**
         * @Descirption Handles what should happen the imediate frame after a collision stops occurring.
         * @param other The object the player's ship collided with
         */
        OnCollisionExit(other) {
            this.stopAbducting(false);
        }

        /**
         * @description Clears the alienAbductee property, and isAbducting flag. Also destroys any graphical artifacts associated with the "tractor beam".
         * @param caught Set to true if the abduction is stopping because you caught the alien. Set to false if it got away or you moved
         */
        stopAbducting(caught:boolean) {
            if (this.alienAbductee != null) {
                if (caught) {
                    this.alienAbductee.kill();              // If caught by the player's ship, "destroy" it
                    console.log("I died");
                }
                let ab: Phaser.Physics.Arcade.Body = this.alienAbductee.body;               // Get a copy of it's physics body
                ab.velocity = new Phaser.Point(this.alienAbductee.data.speed * this.alienAbductee.scale.x, 0);    // Reset it's speed
                this.alienAbductee.position = new Phaser.Point(this.alienAbductee.x, Math.abs(this.alienAbductee.data.initialY));  // Reset it's y-coordinate
                this.alienAbductee.mask = null;                             // Clear it's render mask
                this.alienAbductee = null;                              // Clear it from it's abducting duties ;)
            }

            this.abductionSound.stop(); // Stop the annoying noise
            this.isAbudcting = false;
            this.beam.clear();  // Destroy any graphic's artifacts of the beam
            this.beamMask.clear();  // Destroy any graphic's artifacts of the beam's mask. This shouldn't make a difference since the mask isn't technically rendered, but do it anyway just in case of weirdness.
        }

        /**
         * @Description Should be called when colliding with the mothership.
         * This method resets the "In Transit" score to 0, and increases the "Captured" score appropriately
         */
        Capture() {
            this.aliensCaptured += this.aliensOnBoard;
            this.aliensOnBoard = 0;
        }

        /**
         * @description Will exit imediately if the isMoving flag is set. Begins drawing the Tractor beam. Sets the isAbducting flag and the alienAbductee property.
         * @param a The alien the player will begin abducting
         */
        Abduct(a: Phaser.Sprite) {
            // Only abduct 1 alien at a time
            if (this.alienAbductee != null && this.alienAbductee != a) {
                return;
            }

            if (!this.abductionSound.isPlaying) {
                this.abductionSound.play();
            }

            if (this.isMoving) {
                this.animations.frame = 1;     // Turn on the blue glow
                this.stopAbducting(false);       // If the player is moving, we can't continue abducting
                return; // If the player is moving, just go ahead and kick out of this.
            }
            this.animations.frame = 0;  // If we haven't returned yet, then we "have a live one". Turn off the ufo glow

            // If the abductee is null (meaning we just hit with them) Calculate the height the "tractor" beam needs to be.
            if (this.alienAbductee == null) {
                this.beamDrawHeight = a.worldPosition.y - this.worldPosition.y + this.body.height / 2;
            }

            // If the alienAbductee exists, we must be in the middle of abducting something
            if (this.alienAbductee != null) {
                // If that alien is now higher than the tractor beam, that alien should be considered captured.
                if (this.alienAbductee.worldPosition.y <= this.worldPosition.y) {
                    this.aliensOnBoard++;
                    this.stopAbducting(true);                                       // Tell the alien we have stopped abducting him
                    return;
                }
            }

            this.alienAbductee = a;                                     // Set the alien abductee property equal to the alien the ship collided with
            // TODO: Tell the alien that we have started to abduct it so that it can make changes to it's behaviour too
            let ab: Phaser.Physics.Arcade.Body = this.alienAbductee.body;
            ab.velocity = new Phaser.Point(0, this.abductionSpeed * -1);
            this.alienAbductee.mask = this.beamMask;                    // Set the alien's mask equal to the beam's bitmask
            this.isAbudcting = true;                                    // Set the isAbducting flag

            this.renderBeam();                                          // Show the beam
        }

        /**
         * @description Draws the beam according to "beamDrawHeight" property
         */
        renderBeam() {
            this.beam.clear();  // Destroy the beam from the previous frame
            this.beamMask.clear();  // Destroy the beam Mask from the previous frame

            // this.beam.x = this.x;
            // this.beam.y = this.y;

            // Pick a random color, favoriting blue, with the ranges like so:
            // r: 0-45          g: 75-150           b: 155-255
            let color: number = Phaser.Color.getColor(Math.random() * 45, Math.random() * 75 + 75, Math.random() * 100 + 155);
            // beamDrawHeight is calculated OnCollisionEnter()
            let rect = new Phaser.Rectangle(this.x - (this.body.width / 2) + 2, this.y - (this.body.height / 2), this.body.width - 4, this.beamDrawHeight);
            this.beam.lineStyle(1, color, 0.75);
            this.beam.beginFill(color, 0.8);
            this.beam.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.beam.endFill();
            
            let maskRect = new Phaser.Rectangle(this.x - (this.body.width * 2), this.y - (this.body.height / 10), this.body.width * 4, this.beamDrawHeight);        // These values are pretty much just eyeballed. 
            this.beamMask.beginFill(0xFFFFFF);
            this.beamMask.drawRect(maskRect.x, maskRect.y, maskRect.width, maskRect.height);
            this.beamMask.endFill();
        }
    }
}


