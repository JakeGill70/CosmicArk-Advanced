module CosmicArkAdvanced {

    // TODO: A lot of this needs to split off into a default abstract class called "ALIEN"

    export class Man extends Phaser.Sprite implements IPhysicsReady{
        game: Phaser.Game;              // Game Context
        
        moveSpeed: number;              // How fast the ship moves across the screen
        moveSpeedCurr: number;          // Velocity as a vector 
        startY: number;                 // Holds the original y-coordinate of this alien. Used for moving it back to the correct spot if abduction stops before completing. 

        tag: PhysicsTag;                // What type of physics object is this?

        canMove: boolean;               // Can this alien move right now?

        isBeingAbducted: boolean;       // Is this alien being abducting at this exact moment?
        abductionSpeed: number;         // How quickly the alien travels up to the space ship


        constructor(_game: Phaser.Game, _x: number, _y: number, _name:string) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name

            this.moveSpeed = 5; // Set current walking speed

            this.tag = PhysicsTag.ALIEN; // Physics tag to determine how other sections of code should interact with it.

            this.canMove = true; // Let the alien know that it is ok to move around for right now

            this.isBeingAbducted = false; // Let the alien know that nothing is capturing him.... yet....

            this.startY = _y;

            super(_game, _x, _y, "man"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center
        }

        create() {
            
        }

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

        
        autoMovement() {

            // Horizontal movement
            if ((this.position.x > (this.game.world.width * 0.90)) || (this.position.x < (this.game.world.width * 0.10))) { // if (too far right || too far left)
                this.turnToFaceCenter();
            }

            this.x += this.realSpeed();

            // Reset Y coord
            this.y = this.startY;
        }
        
        turnToFaceCenter() {
            if (this.position.x > this.game.world.width * 0.5) {
                this.moveSpeedCurr = this.moveSpeed * -1.0;
                this.scale.setTo(-1, 1);
            }
            else {
                this.moveSpeedCurr = this.moveSpeed;
                this.scale.setTo(1, 1);
            }
        }

        getDeltaTime() {
            return (this.game.time.elapsedMS / 60);
        }

        realSpeed() {
            return (this.moveSpeedCurr * this.getDeltaTime());
        }

        realAbductionSpeed() {
            return (this.abductionSpeed * this.getDeltaTime());
        }

        stopAbducting() {
            console.log("Whew, that was close - they let me go!");
            this.isBeingAbducted = false;
            this.tint = 0xFFFFFF;
        }

        startAbducting(spd : number) {
            console.log("OH NO!! I'M BEING ABDUCTED!!!");
            this.isBeingAbducted = true;
            this.abductionSpeed = spd;
            this.tint = 0x5DDEFF;
        }

        OnCollisionEnter(other:IPhysicsReady) {
        }

        OnCollisionProposal(other: IPhysicsReady) {
            return true;
        }

        OnCollision(other: IPhysicsReady) {

        }

        OnCollisionExit(other: IPhysicsReady) {
            if (other.tag == CosmicArkAdvanced.PhysicsTag.PLAYER) {
                //this.stopAbducting();
            }
        }
    }
}


