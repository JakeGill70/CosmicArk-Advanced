module CosmicArkAdvanced {

    //TODO: Come up with someway to notify the player which the ship is close enough to abduct an alien

    export class Player extends Phaser.Sprite implements IPhysicsReady {
        game: Phaser.Game;              // Game Context
        cursor: Phaser.CursorKeys;      // Arrow Key input
        beam: Phaser.Graphics;      // Used to draw the 'tractor beam'\
        beamDrawHeight: number;     // Original y-coordinate of the alien being abducted. This is used to root the tractor beam at the bottom of where the alien was standing.

        moveDistThreshold: number;      // How far away the touch must be before moving towards it

        moveSpeed: number;              // How fast the ship moves across the screen

        abductionSpeed: number;         // How fast the ship can abduct a normal alien

        alienAbductee: Man;   // Reference to the alien currently being abducted

        tag: PhysicsTag;

        isAbudcting: boolean;

        isMoving: boolean;


        constructor(_game: Phaser.Game, _x: number, _y: number, _name:string, _beam) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name
            this.beam = _beam;

            this.moveSpeed = 15; // Set current walking speed

            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen

            this.tag = PhysicsTag.PLAYER; // Physics tag to determine how other sections of code should interact with it.

            this.isAbudcting = false;   // is the player abduction someone right now?

            this.abductionSpeed = 10;   // Set the speed which aliens are abducted at.

            super(_game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-left
            //this.scale.set(2.0, 2.0);

            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
        }
        
        create() {

        }

        update() {
            if (!this.game.paused) {

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

        getDeltaTime() {
            return (this.game.time.elapsedMS / 60);
        }

        realSpeed() {
            return (this.moveSpeed * this.getDeltaTime());
        }

        OnCollisionEnter(other) {
            if (other.tag == PhysicsTag.ALIEN) {

                this.startAbducting(other as Man);
                this.beamDrawHeight = other.worldPosition.y - this.worldPosition.y + this.height / 2;

            }
        }

        OnCollisionProposal(other) {
            return true; // We want to accept the collision by default
        }

        OnCollision(other) {
            if (other.tag == PhysicsTag.ALIEN) {
                this.renderBeam();
            }
        }

        OnCollisionExit(other) {
            this.stopAbducting();
        }

        stopAbducting() {
            if (this.alienAbductee != null) {
                this.alienAbductee.stopAbducting();
                this.alienAbductee = null;
            }

            this.isAbudcting = false;
            this.beam.clear();  // Destroy any graphic's artifacts of the beam
        }

        startAbducting(a: Man) {
            if (this.isMoving) {
                return; // If the player is moving, just go ahead and kick out of this.
            }

            if (this.alienAbductee == null) {
                this.beamDrawHeight = a.worldPosition.y - this.worldPosition.y + this.height / 2;
            }

            this.alienAbductee = a;
            this.alienAbductee.startAbducting(this.abductionSpeed);
            this.isAbudcting = true;

            this.renderBeam(); // TEMP
        }

        // TODO: Find some way to draw the beam behind the ship

        renderBeam() {
            this.beam.clear();  // Destroy the beam from the previous frame

            // Pick a random color, favoriting blue, with the ranges like so:
            // r: 0-45          g: 75-150           b: 155-255
            let color: number = Phaser.Color.getColor(Math.random() * 45, Math.random() * 75 + 75, Math.random() * 100 + 155);
            // beamDrawHeight is calculated OnCollisionEnter()
            let rect = new Phaser.Rectangle(-this.width / 2, -this.height / 2, this.width, this.beamDrawHeight);
            this.beam.lineStyle(1, color, 0.75);

            this.beam.beginFill(color, 0.8);
            this.beam.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.beam.endFill();
        }
    }
}


