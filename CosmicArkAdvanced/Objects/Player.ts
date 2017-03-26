module CosmicArkAdvanced {

    //TODO: Come up with someway to notify the player which the ship is close enough to abduct an alien

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
     */
    export class Player extends Phaser.Sprite implements IPhysicsReady {
        game: Phaser.Game;              // Game Context
        cursor: Phaser.CursorKeys;      // Arrow Key input
        beam: Phaser.Graphics;      // Used to draw the 'tractor beam'
        beamMask: Phaser.Graphics;
        beamDrawHeight: number;     // Original y-coordinate of the alien being abducted. This is used to root the tractor beam at the bottom of where the alien was standing.

        moveDistThreshold: number;      // How far away the touch must be before moving towards it

        moveSpeed: number;              // How fast the ship moves across the screen

        abductionSpeed: number;         // How fast the ship can abduct a normal alien

        alienAbductee: Man;             // Reference to the alien currently being abducted

        tag: PhysicsTag;                // Used to help weed out possible collisions

        isAbudcting: boolean;           // Flag for if the player should be abducting someone right now

        isMoving: boolean;              // Flag for if the user is moving the ship right now

        /**
         * @description Constructor for the player's ship
         * @constructor
         * @param _game Context of the main game window
         * @param _x Starting world X coordinate
         * @param _y Starting world Y coordinate
         * @param _name Unique identifer for this object
         * @param _beam Context of the Phaser.Graphics object which handles rendering the "tractor beam"
         */
        constructor(_game: Phaser.Game, _x: number, _y: number, _name: string, _beam: Phaser.Graphics, _beamMask: Phaser.Graphics) {
            this.game = _game;                      // get game context
            this.name = _name;                      // Set the objects unique name
            this.beam = _beam;                      // Pass a reference to the "tractor beam"
            this.beamMask = _beamMask;

            this.moveSpeed = 15; // Set current walking speed

            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen

            this.tag = PhysicsTag.PLAYER; // Physics tag to determine how other sections of code should interact with it.

            this.isAbudcting = false;   // is the player abduction someone right now?

            this.abductionSpeed = 10;   // Set the speed which aliens are abducted at.

            super(_game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game

            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center

            this.animations.add("flash",[0,1],5,true);      // Add the animation which makes the ship glow

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;     // Automatically lock the players sprite into the world so they cannot move off screen.

            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
        }
        
        /**
         * @description Handles function calls before the state begins.
         */
        create() {
        }

        /**
         * @description Called every frame. Handles moving the player and sets the "isMoving" flag. 
         * Also, if abducting, will LERP the abductee's x-coordinate to match the player's.
         */
        update() {
            if (!this.game.paused) {
                this.body.velocity = new Phaser.Point(0, 0);
                this.isMoving = false;  // Turn this flag off. Movement will turn it back on if needed.

                this.arrowKeyMovement();
                this.touchMovement();

                if (this.isMoving) {    // If the flag was set after moving, stop abducting
                    this.stopAbducting();
                }

                if (this.isAbudcting) {
                    if (this.alienAbductee.x != this.x) {
                        this.alienAbductee.x = Phaser.Math.bezierInterpolation([this.alienAbductee.x, this.x], 0.085);  // 0.085 felt like a good speed. No significant meaning.
                    }
                }
            }
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
                        this.x += moveAmtX;

                        // Stop abducting when moving
                        this.isMoving = true;
                    }

                    // Move along the Y-Axis
                    if (Phaser.Math.difference(this.position.y, pos.y) > this.moveDistThreshold) {
                        this.y += moveAmtY;

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
            if (this.cursor.right.isDown == true) {
                this.x += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed(); 

                // Stop abducting when moving
                this.isMoving = true;
            }
            else if (this.cursor.left.isDown == true) {
                this.x -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();  

                // Stop abducting when moving
                this.isMoving = true;
            }

            //Vertical movement
            if (this.cursor.up.isDown == true) {
                this.y -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed(); 

                // Stop abducting when moving
                this.isMoving = true;
            }
            else if (this.cursor.down.isDown == true) {
                this.y += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed(); 

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
                this.beamDrawHeight = other.worldPosition.y - this.worldPosition.y + this.body.height / 2;

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
            if (other.tag == PhysicsTag.ALIEN) {
                this.renderBeam();
            }
        }

        /**
         * @Descirption Handles what should happen the imediate frame after a collision stops occurring.
         * @param other The object the player's ship collided with
         */
        OnCollisionExit(other) {
            this.stopAbducting();
        }

        /**
         * @description Clears the alienAbductee property, and isAbducting flag. Also destroys any graphical artifacts associated with the "tractor beam".
         */
        stopAbducting() {
            if (this.alienAbductee != null) {
                this.alienAbductee.stopAbducting();
                this.alienAbductee.mask = null;
                this.alienAbductee = null;
            }

            this.isAbudcting = false;
            this.beam.clear();  // Destroy any graphic's artifacts of the beam
            this.beamMask.clear();  // Destroy any graphic's artifacts of the beam's mask. This shouldn't make a difference since the mask isn't technically rendered, but do it anyway just in case of weirdness.
        }

        /**
         * @description Will exit imediately if the isMoving flag is set. Begins drawing the Tractor beam. Sets the isAbducting flag and the alienAbductee property.
         * @param a The alien the player will begin abducting
         */
        Abduct(a: Man) {
            if (this.isMoving) {
                this.stopAbducting();
                return; // If the player is moving, just go ahead and kick out of this.
            }

            // If the abductee is null (meaning we just "collided" with them) Calculate the height the "tractor" beam needs to be.
            if (this.alienAbductee == null) {
                this.beamDrawHeight = a.worldPosition.y - this.worldPosition.y + this.body.height / 2;
            }

            if (this.alienAbductee != null) {
                if (this.alienAbductee.worldPosition.y <= this.worldPosition.y) {
                    this.alienAbductee.x = (Math.random() * 1500) + 50;
                    this.stopAbducting();
                    return;
                }
            }

            this.alienAbductee = a;
            this.alienAbductee.startAbducting(this.abductionSpeed);
            this.alienAbductee.mask = this.beamMask;
            this.isAbudcting = true;

            this.renderBeam();
        }

        // TODO: Find some way to draw the beam behind the ship

        /**
         * @description Draws the beam according to "beamDrawHeight" property
         */
        renderBeam() {
            this.beam.clear();  // Destroy the beam from the previous frame
            this.beamMask.clear();  // Destroy the beam Mask from the previous frame

            //this.beam.x = this.x;
            //this.beam.y = this.y;

            // Pick a random color, favoriting blue, with the ranges like so:
            // r: 0-45          g: 75-150           b: 155-255
            let color: number = Phaser.Color.getColor(Math.random() * 45, Math.random() * 75 + 75, Math.random() * 100 + 155);
            // beamDrawHeight is calculated OnCollisionEnter()
            let rect = new Phaser.Rectangle(this.x - (this.body.width / 2), this.y - (this.body.height / 2), this.body.width, this.beamDrawHeight);
            this.beam.lineStyle(1, color, 0.75);
            this.beam.beginFill(color, 0.8);
            this.beam.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.beam.endFill();

            let maskRect = new Phaser.Rectangle(this.x - (this.body.width * 2), this.y - (this.body.height / 3), this.body.width * 4, this.beamDrawHeight);
            this.beamMask.beginFill(0xFFFFFF);
            this.beamMask.drawRect(maskRect.x, maskRect.y, maskRect.width, maskRect.height);
            this.beamMask.endFill();
        }
    }
}


