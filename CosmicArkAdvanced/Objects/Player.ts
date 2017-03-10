module CosmicArkAdvanced {

    export class Player extends Phaser.Sprite implements IPhysicsReady {
        game: Phaser.Game;              // Game Context
        cursor: Phaser.CursorKeys;      // Arrow Key input

        moveDistThreshold: number;      // How far away the touch must be before moving towards it

        moveSpeed: number;              // How fast the ship moves across the screen

        tag: PhysicsTag;

        isAbudcting: boolean;


        constructor(_game: Phaser.Game, _x: number, _y: number, _name:string) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name

            this.moveSpeed = 15; // Set current walking speed

            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen

            this.tag = PhysicsTag.PLAYER; // Physics tag to determine how other sections of code should interact with it.

            this.isAbudcting = false;

            super(_game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-left
            this.scale.set(2.0, 2.0);

            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
        }
        
        create() {
            
        }

        // preUpdate() {
        //     this.isAbudcting = false;   // Set isAbucting to false each frame
        // }

        update() {
            if (!this.game.paused) {
                this.arrowKeyMovement();
                this.touchMovement();
            }
        }

        touchMovement() {
            let pos = new Phaser.Point(this.game.input.worldX, this.game.input.worldY);
            let ang = Phaser.Math.angleBetweenPoints(this.position, pos);
            let moveAmtX = this.realSpeed() * Math.cos(ang);
            let moveAmtY = this.realSpeed() * Math.sin(ang);

            if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {   // If touching the screen
                if (Phaser.Point.distance(this.position, pos) > this.moveDistThreshold){    // And the touch if far enough away
                    // Move along the X-axis
                    if (Phaser.Math.difference(this.position.x, pos.x) > this.moveDistThreshold) {
                        this.x += moveAmtX;
                    }

                    // Move along the Y-Axis
                    if (Phaser.Math.difference(this.position.y, pos.y) > this.moveDistThreshold) {
                        this.y += moveAmtY;
                    }
                }
            }
        }

        arrowKeyMovement() {
            // Make it so that if the ship is moving diagonally, both speeds are multiplied by 0.707, aka sin(45)
            // This keeps the ship from moving too fast when diagonal. For more, look up "vector addition".
            let isDiagonal = ((this.cursor.right.isDown || this.cursor.left.isDown) && (this.cursor.up.isDown || this.cursor.down.isDown));

            // Horizontal movement
            if (this.cursor.right.isDown == true) {
                this.x += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed(); 
            }
            else if (this.cursor.left.isDown == true) {
                this.x -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();  
            }

            //Vertical movement
            if (this.cursor.up.isDown == true) {
                this.y -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed(); 
            }
            else if (this.cursor.down.isDown == true) {
                this.y += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed(); 
            }
        }

        getDeltaTime() {
            return (this.game.time.elapsedMS / 60);
        }

        realSpeed() {
            return (this.moveSpeed * this.getDeltaTime());
        }

        OnCollisionEnter(other) {
            console.log("Player Enter");
        }

        OnCollisionProposal(other) {
            return true; // We want to accept the collision by default
        }

        OnCollision(other) {
            if (other.tag == PhysicsTag.ALIEN) {
                this.isAbudcting = true;
            }
        }

        OnCollisionExit(other) {
            console.log("Player Exit");
        }
    }
}


