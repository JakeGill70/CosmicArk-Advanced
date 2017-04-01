module CosmicArkAdvanced {

    // TODO: A lot of this needs to split off into a default abstract class called "ALIEN"

    /**
     * @description Test creature which aimlessly wonders across the bottom of the screen, just begging to be abducted
     * @property game {Phaser.game}                 - The game context used by everything else in the game.
     * @property moveSpeed {number}                 - How fast the alien moves across the screen
     * @property moveSpeedCurr {number}             - The velocity as a 2D vector
     * @property startY {number}                    - Holds the original y-coordinate of this alien. Used for moving it back to the correct spot if abduction stops before completing. 
     * @property tag {CosmicArkAdvanced.PhysicsTag} - What type of physics object is this?
     * @property canMove {boolean}                  - Determines if the alien can walk at the moment
     * @property isBeingAbducted {boolean}          - Is this alien being abducting right now?
     * @property abductionSpeed {number}            - The speed the alien travels up towards the spaceship while being abducted
     */
    export class Man extends Phaser.Sprite implements IPhysicsReady{
        game: Phaser.Game;              // Game Context
        
        moveSpeed: number;              // How fast the alien moves across the screen

        moveSpeedCurr: number;          // Velocity as a vector 

        startY: number;                 // Holds the original y-coordinate of this alien. Used for moving it back to the correct spot if abduction stops before completing. 

        tag: PhysicsTag;                // What type of physics object is this?

        canMove: boolean;               // Can this alien move right now?

        isBeingAbducted: boolean;       // Is this alien being abducting at this exact moment?

        abductionSpeed: number;         // How quickly the alien travels up to the space ship


        /**
         * @constructor
         * @param _game The game context
         * @param _x The initial world x-coordinate
         * @param _y this intial world y coordinate
         * @param _name The unique identifer to this object
         */
        constructor(_game: Phaser.Game, _x: number, _y: number, _name: string) {
            super(_game, _x, _y, "man"); // Create the sprite at the x,y coordinate in game
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name

            this.game.add.existing(this);           // Add this object to the gamestate

            this.moveSpeed = 5; // Set current walking speed

            this.tag = PhysicsTag.ALIEN; // Physics tag to determine how other sections of code should interact with it.

            this.canMove = true; // Let the alien know that it is ok to move around for right now

            this.isBeingAbducted = false; // Let the alien know that nothing is capturing him.... yet....

            this.startY = _y;
            
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center

            this.game.physics.enable(this, Phaser.Physics.ARCADE); // enable physics for this alien

            let offset = 75;                    // Offset is how much extra height should be added the alien's collider so the ship will collide at altitude
            this.body.setSize(this.width, this.height + offset, 0, -offset); // Extend the collision box upwards so it can hit the ship
        }

        /**
         * @description Called every frame. 
         * Moves the ship depending on the canMove and isBeingAbucted flags
         */
        update() {
            // OR this with other flags as needed
            this.canMove = !this.isBeingAbducted; // We can move if we are not being abducted

            //console.log(this.startY + ", " + this.worldPosition.y);

            if (this.canMove) {
                this.autoMovement();
            }
            else {
                if (this.isBeingAbducted) {
                    this.y -= this.realAbductionSpeed();
                }
            }
        }

        /**
         * @description Checks if this alien is too close to the edge of the screen, then faces it towards the center of the world.
         * Moves this alien along the x-axis according to the moveSpeedCurr property
         */
        autoMovement() {

            // Horizontal movement
            if ((this.x > (this.game.world.width * 0.90)) || (this.x < (this.game.world.width * 0.10))) { // if (too far right || too far left)
                this.turnToFaceCenter();
            }

            this.x += this.realSpeed();

            // Reset Y coord
            this.y = this.startY;
        }
        
        /**
         * @Description Flips the object's scale to simulate mirror the sprite so it will always face the direction it is walking
         */
        turnToFaceCenter() {
            if (this.x > this.game.world.width * 0.5) {
                this.moveSpeedCurr = this.moveSpeed * -1.0;
                this.scale.setTo(-1, 1);
            }
            else {
                this.moveSpeedCurr = this.moveSpeed;
                this.scale.setTo(1, 1);
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
         * @description takes the alien's nice integer value movespeed and multiplies it by delta time.
         * @returns a number representing the movespeed of the alien over time
         */
        realSpeed() {
            return (this.moveSpeedCurr * this.getDeltaTime());
        }

        /**
         * @description takes the alien's nice integer value abductionspeed and multiplies it by delta time.
         * @returns a number representing the movespeed of the alien over time
         */
        realAbductionSpeed() {
            return (this.abductionSpeed * this.getDeltaTime());
        }

        /**
         * @description Handles what should happen when the ship stops abducting this object
         */
        stopAbducting() {
            console.log("Whew, that was close - they let me go!");
            this.isBeingAbducted = false;
            this.tint = 0xFFFFFF;
        }
        /**
         * @description Handles what should happen when the ship starts abducting this object
         * @param spd The abduction speed according the ship
         */
        startAbducting(spd : number) {
            console.log("OH NO!! I'M BEING ABDUCTED!!!");
            this.isBeingAbducted = true;
            this.abductionSpeed = spd;
            this.tint = 0x5DDEFF;
        }

        /**
         * @Descirption Handles what should happen the imediate frame after a collision first occurs.
         * @param other The object this object collided with
         */
        OnCollisionEnter(other: IPhysicsReady) {
        }

        /**
         * @description Handles what should happen the exact frame a collision occurs. Answers the question "Do I want procede with this collision?"
         * @param other The object this object collided with
         * @returns {boolean} Should this object accept the collision, or act like nothing happened?
         */
        OnCollisionProposal(other: IPhysicsReady) {
            return true; // We want to accept the collision by default
        }

        /**
         * @descirption Handles what should happen for EVERY FRAME of a collision EXCEPT for the first, which is only handled by OnCollisionProposal.
         * @see {this.OnCollisionProposal}
         * @param other The object this object collided with
         */
        OnCollision(other: IPhysicsReady) {
        }

        /**
         * @Descirption Handles what should happen the imediate frame after a collision stops occurring.
         * @param other The object this object collided with
         */
        OnCollisionExit(other) {
        }
    }
}


