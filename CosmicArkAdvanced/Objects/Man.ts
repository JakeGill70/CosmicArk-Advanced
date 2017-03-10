module CosmicArkAdvanced {

    export class Man extends Phaser.Sprite implements IPhysicsReady{
        game: Phaser.Game;              // Game Context
        
        moveSpeed: number;              // How fast the ship moves across the screen
        moveSpeedCurr: number;          // Velocity as a vector 

        tag: PhysicsTag;


        constructor(_game: Phaser.Game, _x: number, _y: number, _name:string) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name

            this.moveSpeed = 5; // Set current walking speed

            this.tag = PhysicsTag.ALIEN; // Physics tag to determine how other sections of code should interact with it.

            super(_game, _x, _y, "man"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center
        }

        create() {

        }

        update() {
            this.autoMovement();
        }

        
        autoMovement() {

            // Horizontal movement
            if ((this.position.x > (this.game.world.width * 0.90)) || (this.position.x < (this.game.world.width * 0.10))) { // if (too far right || too far left)
                this.turnToFaceCenter();
            }

            this.x += this.realSpeed();
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


        OnCollisionEnter(other) {
            console.log("Man Enter");
        }

        OnCollisionProposal(other) {
            return true;
        }

        OnCollision(other) {
            //console.log("Collision Code on man");
        }

        OnCollisionExit(other) {
            console.log("Man Exit");
        }
    }
}


